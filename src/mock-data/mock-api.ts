import type {
  Account,
  AuthResponseData,
  ReadingCard,
  ReadingMode,
  ReadingSession,
  ResponseBase,
} from '@/types'
import type { ApiError } from '@/api/client'
import {
  mockAccount,
  mockAchievements,
  mockCardsByNfc,
  mockCollectionProgress,
  mockCollectionProgressDetails,
  mockCollections,
  mockMarketCardTemplates,
  mockMyAchievements,
  mockMyCards,
  mockOrders,
  mockPacks,
  mockSessions,
  mockSpreads,
  mockStories,
  mockStoryDetails,
  mockUnlinkRequests,
  mockVouchers,
  mockWallet,
} from './data'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type MockState = {
  account: Account
  myCards: typeof mockMyCards
  orders: typeof mockOrders
  vouchers: typeof mockVouchers
  wallet: typeof mockWallet
  unlinkRequests: typeof mockUnlinkRequests
  sessions: typeof mockSessions
}

const state: MockState = {
  account: { ...mockAccount },
  myCards: [...mockMyCards],
  orders: [...mockOrders],
  vouchers: [...mockVouchers],
  wallet: { ...mockWallet },
  unlinkRequests: [...mockUnlinkRequests],
  sessions: [...mockSessions],
}

function ok<T>(data: T, message = 'OK'): ResponseBase<T> {
  return { code: 200, message, data }
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

function apiError(status: number, message: string, data?: Record<string, unknown>): never {
  throw { status, message, data } as ApiError
}

function parseUrl(path: string): URL {
  return new URL(path, 'http://mock.local')
}

function toMethod(method?: string): HttpMethod {
  return ((method ?? 'GET').toUpperCase() as HttpMethod)
}

async function parseBody(init?: RequestInit): Promise<unknown> {
  if (!init?.body || typeof init.body !== 'string') return undefined
  try {
    return JSON.parse(init.body)
  } catch {
    return undefined
  }
}

function getSessionById(sessionId: number): ReadingSession | undefined {
  return state.sessions.find((s) => s.sessionId === sessionId)
}

function buildReadingCards(count: number): ReadingCard[] {
  return state.myCards.slice(0, Math.max(count, 1)).map((c, index) => ({
    readingCardId: 20000 + index,
    cardTemplate: c.cardTemplate,
    positionIndex: index,
    positionName: `Vị trí ${index + 1}`,
    isReversed: index % 2 === 1,
  }))
}

export async function mockApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const method = toMethod(init?.method)
  const url = parseUrl(path)
  const body = await parseBody(init)

  await new Promise((resolve) => setTimeout(resolve, 120))

  // Auth
  if (method === 'POST' && url.pathname === '/api/accounts/auth/login') {
    const authData: AuthResponseData = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      account: {
        customerId: state.account.customerId,
        email: state.account.email,
        name: state.account.name,
        role: state.account.role,
      },
    }
    return ok(authData, 'Đăng nhập thành công') as T
  }

  if (method === 'POST' && url.pathname === '/api/accounts/auth/google/verify') {
    const authData: AuthResponseData = {
      accessToken: 'mock-google-access-token',
      refreshToken: 'mock-google-refresh-token',
      account: {
        customerId: state.account.customerId,
        email: state.account.email,
        name: state.account.name,
        role: state.account.role,
      },
    }
    return ok(authData, 'Xác thực Google thành công') as T
  }

  if (method === 'POST' && url.pathname === '/api/accounts/auth/registration') {
    const req = body as Partial<Account> | undefined
    state.account = {
      ...state.account,
      name: req?.name ?? state.account.name,
      email: req?.email ?? state.account.email,
      updatedAt: new Date().toISOString(),
    }
    return ok(clone(state.account), 'Tạo tài khoản thành công') as T
  }

  if (method === 'POST' && url.pathname === '/api/accounts/auth/forgot-password') {
    return ok(null, 'Đã gửi email khôi phục mật khẩu') as T
  }

  if (method === 'POST' && url.pathname === '/api/accounts/auth/checkout-token') {
    return { message: 'OK', data: { checkoutToken: 'mock-checkout-token' } } as T
  }

  // Account
  const accountMatch = url.pathname.match(/^\/api\/accounts\/(\d+)$/)
  if (accountMatch && method === 'GET') {
    return ok(clone(state.account)) as T
  }
  if (accountMatch && method === 'PUT') {
    const req = body as { name?: string } | undefined
    if (req?.name) state.account.name = req.name
    state.account.updatedAt = new Date().toISOString()
    return ok(clone(state.account), 'Cập nhật thành công') as T
  }

  const passwordMatch = url.pathname.match(/^\/api\/accounts\/(\d+)\/password$/)
  if (passwordMatch && method === 'PUT') {
    return ok(undefined, 'Đổi mật khẩu thành công') as T
  }

  // Marketplace
  if (method === 'GET' && url.pathname === '/api/packs/available') {
    return ok(clone(mockPacks)) as T
  }

  const packMatch = url.pathname.match(/^\/api\/packs\/(\d+)$/)
  if (packMatch && method === 'GET') {
    const packId = Number(packMatch[1])
    const pack = mockPacks.find((p) => p.packId === packId)
    if (!pack) apiError(404, 'Không tìm thấy pack')
    return ok(clone(pack)) as T
  }

  if (method === 'GET' && url.pathname === '/api/card-templates') {
    return ok(clone(mockMarketCardTemplates)) as T
  }

  // Orders
  const orderByCustomerMatch = url.pathname.match(/^\/api\/orders\/customer\/(\d+)$/)
  if (orderByCustomerMatch && method === 'GET') {
    return ok(clone(state.orders)) as T
  }

  const orderMatch = url.pathname.match(/^\/api\/orders\/(\d+)$/)
  if (orderMatch && method === 'GET') {
    const orderId = Number(orderMatch[1])
    const order = state.orders.find((o) => o.orderId === orderId)
    if (!order) apiError(404, 'Không tìm thấy đơn hàng')
    return ok(clone(order)) as T
  }

  // Collections
  const collectionsMatch = url.pathname.match(/^\/api\/collections\/customer\/(\d+)$/)
  if (collectionsMatch && method === 'GET') {
    return ok(clone(mockCollections)) as T
  }

  if (method === 'GET' && url.pathname === '/api/collections/progress') {
    return ok(clone(mockCollectionProgress)) as T
  }

  if (method === 'GET' && url.pathname === '/api/collections/progress/detail') {
    const collectionId = Number(url.searchParams.get('collectionId'))
    const detail = mockCollectionProgressDetails.find((d) => d.collectionId === collectionId)
    if (!detail) apiError(404, 'Không tìm thấy chi tiết bộ sưu tập')
    return ok(clone(detail)) as T
  }

  // Stories / Achievements
  if (method === 'GET' && url.pathname === '/api/stories') {
    return ok(clone(mockStories)) as T
  }

  const storyMatch = url.pathname.match(/^\/api\/stories\/(\d+)$/)
  if (storyMatch && method === 'GET') {
    const storyId = Number(storyMatch[1])
    const detail = mockStoryDetails.find((s) => s.storyId === storyId)
    if (!detail) apiError(404, 'Không tìm thấy câu chuyện')
    if (!detail.isUnlocked) apiError(403, 'Nội dung đã khoá')
    return ok(clone(detail)) as T
  }

  if (method === 'GET' && url.pathname === '/api/achievements') {
    return ok(clone(mockAchievements)) as T
  }

  if (method === 'GET' && url.pathname === '/api/achievements/my') {
    return ok(clone(mockMyAchievements)) as T
  }

  // Inventory / NFC
  if (method === 'GET' && url.pathname === '/api/inventory/my-cards') {
    return ok(clone(state.myCards)) as T
  }

  const myCardDetailMatch = url.pathname.match(/^\/api\/inventory\/my-cards\/(\d+)$/)
  if (myCardDetailMatch && method === 'GET') {
    const templateId = Number(myCardDetailMatch[1])
    const card = state.myCards.find((c) => c.cardTemplate.templateId === templateId)
    if (!card) apiError(404, 'Không tìm thấy thẻ')
    return ok(clone(card)) as T
  }

  if (method === 'POST' && url.pathname === '/api/unlink-requests') {
    const req = body as { nfcUid?: string } | undefined
    const nfcUid = req?.nfcUid
    if (!nfcUid) apiError(400, 'Thiếu nfcUid')
    const existed = state.unlinkRequests.find((r) => r.card.nfcUid === nfcUid && r.status === 'PENDING')
    if (existed) apiError(409, 'Bạn đã có yêu cầu đang chờ cho thẻ này')
    state.unlinkRequests = [
      ...state.unlinkRequests,
      {
        requestId: Date.now(),
        customer: { accountId: state.account.customerId, name: state.account.name },
        card: { cardId: 1001, nfcUid, template: { name: 'Chrono Fox' } },
        requestedAt: new Date().toISOString(),
        status: 'PENDING',
      },
    ]
    return ok(undefined, 'Đã gửi yêu cầu') as T
  }

  if (method === 'POST' && (url.pathname === '/api/nfc/scan' || url.pathname === '/api/nfc/link')) {
    return ok(undefined) as T
  }

  if (method === 'GET' && url.pathname === '/api/staff/unlink-requests') {
    return ok(clone(state.unlinkRequests)) as T
  }

  const approveMatch = url.pathname.match(/^\/api\/staff\/unlink-requests\/(\d+)\/approve$/)
  if (approveMatch && method === 'POST') {
    const requestId = Number(approveMatch[1])
    state.unlinkRequests = state.unlinkRequests.map((r) =>
      r.requestId === requestId ? { ...r, status: 'APPROVED' as const } : r,
    )
    return ok(undefined, 'Đã phê duyệt') as T
  }

  const rejectMatch = url.pathname.match(/^\/api\/staff\/unlink-requests\/(\d+)\/reject$/)
  if (rejectMatch && method === 'POST') {
    const requestId = Number(rejectMatch[1])
    const req = (body as { staffNote?: string } | undefined) ?? {}
    state.unlinkRequests = state.unlinkRequests.map((r) =>
      r.requestId === requestId ? { ...r, status: 'REJECTED' as const, staffNote: req.staffNote } : r,
    )
    return ok(undefined, 'Đã từ chối') as T
  }

  const cardByNfcMatch = url.pathname.match(/^\/api\/cards\/nfc\/(.+)$/)
  if (cardByNfcMatch && method === 'GET') {
    const uid = decodeURIComponent(cardByNfcMatch[1])
    const card = mockCardsByNfc.find((c) => c.nfcUid === uid)
    if (!card) apiError(404, 'Không tìm thấy thẻ')
    return ok(clone(card)) as T
  }

  if (method === 'POST' && url.pathname === '/api/cards/bind') {
    const req = body as { nfcUid?: string; templateId?: number } | undefined
    const card = mockCardsByNfc.find((c) => c.nfcUid === req?.nfcUid)
    if (!card) apiError(404, 'Không tìm thấy thẻ')
    const bound = {
      ...card,
      status: 'READY' as const,
    }
    return ok(bound, 'Bind thành công') as T
  }

  // Wallet
  if (method === 'GET' && url.pathname === '/api/wallet/balance') {
    return ok(clone(state.wallet)) as T
  }

  if (method === 'GET' && url.pathname === '/api/vouchers/my') {
    return ok(clone(state.vouchers)) as T
  }

  if (method === 'POST' && url.pathname === '/api/wallet/exchange') {
    if (state.wallet.balance < 1000) apiError(400, 'Không đủ điểm để đổi voucher')
    state.wallet.balance -= 1000
    state.vouchers = [
      {
        voucherId: Date.now(),
        code: `PM-${Date.now().toString().slice(-6)}`,
        discountPercent: 10,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
        isUsed: false,
      },
      ...state.vouchers,
    ]
    return ok(undefined, 'Đổi điểm thành công') as T
  }

  // Tarot
  if (method === 'GET' && url.pathname === '/api/v1/readings/spreads') {
    return ok(clone(mockSpreads)) as T
  }

  if (method === 'GET' && url.pathname === '/api/v1/readings/sessions') {
    return ok(clone(state.sessions)) as T
  }

  if (method === 'POST' && url.pathname === '/api/v1/readings/sessions') {
    const req = (body as { spreadId: number; mainQuestion: string; mode: ReadingMode } | undefined)
    const existing = state.sessions.find((s) => s.status === 'PENDING' || s.status === 'INTERPRETING')
    if (existing) apiError(409, 'Bạn đang có session chưa hoàn thành', { activeSessionId: existing.sessionId })
    const spread = mockSpreads.find((s) => s.spreadId === req?.spreadId) ?? mockSpreads[0]
    const created: ReadingSession = {
      sessionId: Date.now(),
      spread,
      mode: req?.mode ?? 'EXPLORE',
      mainQuestion: req?.mainQuestion ?? '',
      status: 'PENDING',
      readingCards: [],
      aiInterpretation: null,
      createdAt: new Date().toISOString(),
    }
    state.sessions = [created, ...state.sessions]
    return ok(created, 'Tạo phiên thành công') as T
  }

  const sessionDetailMatch = url.pathname.match(/^\/api\/v1\/readings\/sessions\/(\d+)$/)
  if (sessionDetailMatch && method === 'GET') {
    const sessionId = Number(sessionDetailMatch[1])
    const session = getSessionById(sessionId)
    if (!session) apiError(404, 'Không tìm thấy session')
    return ok(clone(session)) as T
  }

  const sessionDrawMatch = url.pathname.match(/^\/api\/v1\/readings\/sessions\/(\d+)\/draw$/)
  if (sessionDrawMatch && method === 'POST') {
    const sessionId = Number(sessionDrawMatch[1])
    const target = getSessionById(sessionId)
    if (!target) apiError(404, 'Không tìm thấy session')
    const drawnCards = buildReadingCards(target.spread.positionCount)
    target.readingCards = drawnCards
    target.status = 'INTERPRETING'
    return ok({ drawnCards }) as T
  }

  const sessionInterpretMatch = url.pathname.match(/^\/api\/v1\/readings\/sessions\/(\d+)\/interpret$/)
  if (sessionInterpretMatch && method === 'GET') {
    const sessionId = Number(sessionInterpretMatch[1])
    const target = getSessionById(sessionId)
    if (!target) apiError(404, 'Không tìm thấy session')
    if (target.status === 'INTERPRETING') {
      target.status = 'COMPLETED'
      target.aiInterpretation = 'Trải bài cho thấy bạn nên tập trung vào kỷ luật cá nhân và giữ nhịp học ổn định trong 7 ngày tới.'
    }
    return ok(clone(target)) as T
  }

  apiError(404, `Mock chưa hỗ trợ endpoint: ${method} ${url.pathname}`)
}
