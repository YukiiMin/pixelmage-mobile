import { secureStore, TOKEN_KEYS } from './secureStore'

const BE_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

let isRefreshing = false
let failQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = []

export interface ApiError {
  status: number
  message: string
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await secureStore.get('accessToken')
  
  const headers = new Headers(init?.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const doRequest = () => fetch(BE_BASE_URL + path, { ...init, headers })

  let response = await doRequest()

  if (response.status === 401 && !(init as any)._retry) {
    (init as any)._retry = true
    
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        failQueue.push({
          resolve: () => doRequest().then(r => r.json()).then(resolve).catch(reject),
          reject: (err) => reject(err)
        })
      })
    }

    isRefreshing = true
    try {
      const refreshToken = await secureStore.get('refreshToken')
      const refreshResp = await fetch(`${BE_BASE_URL}/api/accounts/auth/refresh?refreshToken=${refreshToken}`, {
        method: 'POST'
      })

      if (!refreshResp.ok) throw new Error('Refresh failed')
      
      const refreshData = await refreshResp.json()
      // Assume refreshData.data.accessToken exists based on typical BE wrap, or standard
      const newAccessToken = refreshData.data?.accessToken ?? refreshData.accessToken
      
      if (newAccessToken) {
        await secureStore.set('accessToken', newAccessToken)
        headers.set('Authorization', `Bearer ${newAccessToken}`)
      }
      
      failQueue.forEach(q => q.resolve(null))
      failQueue = []
      
      // Retry original request
      response = await doRequest()
    } catch (e) {
      failQueue.forEach(q => q.reject(e))
      failQueue = []
      await secureStore.clearAll()
      // Usually would redirect here, but that's handled at component/guard level
      throw { status: 401, message: 'Session expired' }
    } finally {
      isRefreshing = false
    }
  }

  if (!response.ok) {
    let message = 'Error'
    try {
      const errData = await response.json()
      message = errData.message ?? errData.error ?? `Error ${response.status}`
    } catch (e) {
      // Ignored
    }
    throw { status: response.status, message } as ApiError
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as any as T
  }

  return response.json() as Promise<T>
}

export const client = {
  get: <T>(path: string, init?: RequestInit) => apiFetch<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) => apiFetch<T>(path, {
    ...init,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  }),
  put: <T>(path: string, body?: unknown, init?: RequestInit) => apiFetch<T>(path, {
    ...init,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  }),
}
