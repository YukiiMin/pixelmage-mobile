/**
 * Mobile API Client — with production-grade Refresh Token flow
 *
 * Refresh Token Strategy:
 * ──────────────────────────────────────────────────────────────────
 * 1. Every request reads the stored accessToken from SecureStore.
 * 2. On 401, a single refresh call is made (isRefreshing gate).
 * 3. All concurrent requests that hit 401 during the refresh are
 *    queued. They each receive the NEW token once refresh completes,
 *    then retry with it — no stale-token race condition.
 * 4. If refresh fails → clear all tokens → emit SESSION_EXPIRED event
 *    so any mounted AuthGuard/RootLayout can navigate to login.
 *
 * BE Refresh Endpoint (from AccountController):
 *   POST /api/accounts/auth/refresh?refreshToken=<token>
 *   Response: ResponseBase<{ accessToken: string }>
 */

import { secureStore } from './secureStore'
import { mockApiFetch } from '@/mock-data/mock-api'

// ─── Public API ───────────────────────────────────────────────────────────────

export interface ApiErrorData {
  message?: string
  activeSessionId?: number
  [key: string]: unknown
}

export interface ApiError extends Error {
  status: number
  message: string
  data?: ApiErrorData
}

// ─── Session-expired event bus ────────────────────────────────────────────────
// Pattern: lightweight event emitter so the client module (non-React) can
// signal that the refresh failed and the user must re-authenticate.
// Usage in RootLayout: sessionExpiredBus.subscribe(() => router.replace('/(auth)/login'))

type Listener = () => void

class EventBus {
  private listeners: Listener[] = []

  subscribe(fn: Listener): () => void {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn)
    }
  }

  emit(): void {
    this.listeners.forEach((l) => l())
  }
}

export const sessionExpiredBus = new EventBus()

// ─── Refresh Token State ──────────────────────────────────────────────────────
// Each pending item receives the new access token string (or null on failure)
// so it can retry its own request with the updated header.

type QueueItem = {
  resolve: (newToken: string) => void
  reject: (err: unknown) => void
}

let isRefreshing = false
let waitingQueue: QueueItem[] = []

function processQueue(newToken: string): void {
  waitingQueue.forEach((item) => item.resolve(newToken))
  waitingQueue = []
}

function rejectQueue(err: unknown): void {
  waitingQueue.forEach((item) => item.reject(err))
  waitingQueue = []
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

const BE_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '')
const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = await secureStore.get('accessToken')

  const buildHeaders = (token: string | null): Record<string, string> => {
    const h: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) h['Authorization'] = `Bearer ${token}`
    // Carry through any caller-supplied extra headers
    if (init?.headers) {
      const extra = new Headers(init.headers)
      extra.forEach((v, k) => { h[k] = v })
    }
    return h
  }

  const executeRequest = (token: string | null) =>
    fetch(BE_BASE_URL + path, { ...init, headers: buildHeaders(token) })

  if (USE_MOCK_API) {
    return mockApiFetch<T>(path, {
      ...init,
      headers: buildHeaders(accessToken),
    })
  }

  let response = await executeRequest(accessToken)

  // ── 401: try refresh ──────────────────────────────────────────────────────
  if (response.status === 401) {
    // If another refresh is already in-flight, queue this request and wait
    // for the refresh to complete so we can retry with the new token.
    if (isRefreshing) {
      const newToken = await new Promise<string>((resolve, reject) => {
        waitingQueue.push({ resolve, reject })
      })
      // Retry this request with the freshly issued token
      response = await executeRequest(newToken)
    } else {
      // We are the first request to hit 401 — own the refresh
      isRefreshing = true

      try {
        const storedRefreshToken = await secureStore.get('refreshToken')
        if (!storedRefreshToken) throw new Error('No refresh token stored')

        const refreshResp = await fetch(
          `${BE_BASE_URL}/api/accounts/auth/refresh?refreshToken=${encodeURIComponent(storedRefreshToken)}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        )

        if (!refreshResp.ok) throw new Error(`Refresh failed: ${refreshResp.status}`)

        // BE returns: ResponseBase<{ accessToken: string }>
        // { code, message, data: { accessToken: "..." } }
        const refreshBody = await refreshResp.json()
        const newToken: string | undefined =
          refreshBody?.data?.accessToken ?? refreshBody?.accessToken

        if (!newToken) throw new Error('Refresh response missing accessToken')

        // Persist the new token
        await secureStore.set('accessToken', newToken)

        // Unblock all queued requests with the new token
        processQueue(newToken)

        // Retry the original request that triggered the 401
        response = await executeRequest(newToken)
      } catch (err) {
        // Refresh failed — session is truly expired
        rejectQueue(err)
        await secureStore.clearAll()
        sessionExpiredBus.emit() // → RootLayout will redirect to login
        throw { status: 401, message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' } as ApiError
      } finally {
        isRefreshing = false
      }
    }
  }

  // ── Non-2xx error handling ────────────────────────────────────────────────
  if (!response.ok) {
    let message = `HTTP ${response.status}`
    let data: unknown = null
    try {
      const errBody = await response.json()
      message = errBody?.message ?? errBody?.error ?? message
      data = errBody?.data ?? errBody
    } catch {
      // body not JSON — keep default message
    }
    throw { status: response.status, message, data } as ApiError
  }

  // ── 204 No Content ────────────────────────────────────────────────────────
  if (response.status === 204) return null as unknown as T

  return response.json() as Promise<T>
}

// ─── Typed client ─────────────────────────────────────────────────────────────

export const client = {
  get: <T>(path: string, init?: RequestInit) =>
    apiFetch<T>(path, { ...init, method: 'GET' }),

  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    apiFetch<T>(path, {
      ...init,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    apiFetch<T>(path, {
      ...init,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, init?: RequestInit) =>
    apiFetch<T>(path, { ...init, method: 'DELETE' }),
}
