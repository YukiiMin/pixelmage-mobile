import type {
  Account,
  Achievement,
  Collection,
  CollectionProgress,
  CollectionProgressDetail,
  MarketCardTemplate,
  Order,
  Pack,
  ReadingSession,
  Spread,
  Story,
  StoryDetail,
  UnlinkRequest,
  UserInventory,
  Voucher,
  WalletBalance,
} from '@/types'
import type { CardInfo } from '@/types/card'

const now = new Date()
const iso = (offsetDays = 0) => {
  const d = new Date(now)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString()
}

export const mockAccount: Account = {
  customerId: 101,
  email: 'minh.nguyen@pixelmage.app',
  name: 'Minh Nguyen',
  phoneNumber: '0901234567',
  avatarUrl: null,
  emailVerified: true,
  authProvider: 'LOCAL',
  isActive: true,
  role: { roleId: 2, roleName: 'CUSTOMER' },
  createdAt: iso(-120),
  updatedAt: iso(-1),
  guestReadingUsedAt: null,
}

export const mockMarketCardTemplates: MarketCardTemplate[] = [
  { cardTemplateId: 1, name: 'Chrono Fox', description: 'Guardian of time loops.', rarity: 'COMMON', imageUrl: 'https://picsum.photos/seed/chronofox/300/420' },
  { cardTemplateId: 2, name: 'Moonlit Oracle', description: 'Sees through hidden paths.', rarity: 'RARE', imageUrl: 'https://picsum.photos/seed/moonoracle/300/420' },
  { cardTemplateId: 3, name: 'Aether Dragon', description: 'Ancient legendary spirit.', rarity: 'LEGENDARY', imageUrl: 'https://picsum.photos/seed/aetherdragon/300/420' },
]

export const mockPacks: Pack[] = [
  { packId: 11, name: 'Starter Arcana Pack', description: 'Gói cơ bản cho người mới bắt đầu hành trình PixelMage.', price: 59000, status: 'STOCKED', cardCount: 5, imageUrl: 'https://picsum.photos/seed/packstarter/600/400' },
  { packId: 12, name: 'Eclipse Limited Pack', description: 'Phiên bản giới hạn mùa nhật thực.', price: 129000, status: 'RESERVED', cardCount: 5, imageUrl: 'https://picsum.photos/seed/packeclipse/600/400' },
  { packId: 13, name: 'Legend Vault Pack', description: 'Tăng cơ hội nhận thẻ hiếm và huyền thoại.', price: 199000, status: 'SOLD', cardCount: 5, imageUrl: 'https://picsum.photos/seed/packlegend/600/400' },
]

export const mockMyCards: UserInventory[] = [
  {
    inventoryId: 5001,
    linkedAt: iso(-20),
    nfcUid: '04A1B2C3D4',
    cardTemplate: {
      templateId: 1,
      name: 'Chrono Fox',
      imageUrl: 'https://picsum.photos/seed/chronofox/300/420',
      rarity: 'COMMON',
      description: 'Guardian of time loops.',
      collection: { collectionId: 201, name: 'Chronicle of Dawn' },
    },
  },
  {
    inventoryId: 5002,
    linkedAt: iso(-7),
    nfcUid: '04E5F6A7B8',
    cardTemplate: {
      templateId: 2,
      name: 'Moonlit Oracle',
      imageUrl: 'https://picsum.photos/seed/moonoracle/300/420',
      rarity: 'RARE',
      description: 'Sees through hidden paths.',
      collection: { collectionId: 201, name: 'Chronicle of Dawn' },
    },
  },
]

export const mockCollections: Collection[] = [
  { collectionId: 201, name: 'Chronicle of Dawn', description: 'Bộ sưu tập mở đầu hành trình.', type: 'STANDARD', totalCards: 4, imageUrl: 'https://picsum.photos/seed/collectiondawn/600/300' },
  { collectionId: 202, name: 'Nebula Relics', description: 'Thẻ cổ vật không gian hiếm.', type: 'LIMITED', totalCards: 3, imageUrl: 'https://picsum.photos/seed/collectionnebula/600/300' },
]

export const mockCollectionProgress: CollectionProgress[] = [
  { collectionId: 201, collectionName: 'Chronicle of Dawn', ownedCards: 2, totalCards: 4, progressPercent: 50, isCompleted: false },
  { collectionId: 202, collectionName: 'Nebula Relics', ownedCards: 0, totalCards: 3, progressPercent: 0, isCompleted: false },
]

export const mockCollectionProgressDetails: CollectionProgressDetail[] = [
  {
    collectionId: 201,
    collectionName: 'Chronicle of Dawn',
    ownedCards: 2,
    totalCards: 4,
    stories: [
      { storyId: 301, title: 'Khởi Nguyên Ánh Sao', isUnlocked: true },
      { storyId: 302, title: 'Cánh Cổng Bị Lãng Quên', isUnlocked: false },
    ],
    achievements: [
      { achievementId: 401, name: 'Nhà Sưu Tầm Tập Sự', isEarned: true },
      { achievementId: 402, name: 'Người Gác Bình Minh', isEarned: false },
    ],
  },
  {
    collectionId: 202,
    collectionName: 'Nebula Relics',
    ownedCards: 0,
    totalCards: 3,
    stories: [{ storyId: 303, title: 'Tín Hiệu Từ Tinh Vân', isUnlocked: false }],
    achievements: [{ achievementId: 403, name: 'Kẻ Truy Tìm Cổ Vật', isEarned: false }],
  },
]

export const mockStories: Story[] = [
  { storyId: 301, title: 'Khởi Nguyên Ánh Sao', isUnlocked: true, coverImageUrl: 'https://picsum.photos/seed/story301/600/300', collection: { collectionId: 201, name: 'Chronicle of Dawn' } },
  { storyId: 302, title: 'Cánh Cổng Bị Lãng Quên', isUnlocked: false, coverImageUrl: 'https://picsum.photos/seed/story302/600/300', collection: { collectionId: 201, name: 'Chronicle of Dawn' } },
]

export const mockStoryDetails: StoryDetail[] = [
  {
    storyId: 301,
    title: 'Khởi Nguyên Ánh Sao',
    isUnlocked: true,
    collection: { collectionId: 201, name: 'Chronicle of Dawn' },
    content: 'Khi mặt trời đầu tiên trỗi dậy, Chrono Fox đã đánh thức những mảnh ký ức cổ xưa...',
    unlockedAt: iso(-5),
    coverImageUrl: 'https://picsum.photos/seed/story301/600/300',
  },
  {
    storyId: 302,
    title: 'Cánh Cổng Bị Lãng Quên',
    isUnlocked: false,
    collection: { collectionId: 201, name: 'Chronicle of Dawn' },
    content: '',
    coverImageUrl: 'https://picsum.photos/seed/story302/600/300',
  },
]

export const mockAchievements: Achievement[] = [
  { achievementId: 401, name: 'Nhà Sưu Tầm Tập Sự', description: 'Sở hữu 2 thẻ đầu tiên.', iconUrl: 'https://picsum.photos/seed/ach401/80/80' },
  { achievementId: 402, name: 'Người Gác Bình Minh', description: 'Hoàn thành Chronicle of Dawn.', iconUrl: 'https://picsum.photos/seed/ach402/80/80' },
  { achievementId: 403, name: 'Kẻ Truy Tìm Cổ Vật', description: 'Mở khóa 1 truyện Nebula.', iconUrl: 'https://picsum.photos/seed/ach403/80/80' },
]

export const mockMyAchievements: Achievement[] = [
  { achievementId: 401, name: 'Nhà Sưu Tầm Tập Sự', description: 'Sở hữu 2 thẻ đầu tiên.', earnedAt: iso(-4), iconUrl: 'https://picsum.photos/seed/ach401/80/80' },
]

export const mockOrders: Order[] = [
  {
    orderId: 7001,
    customerId: 101,
    status: 'COMPLETED',
    totalPrice: 59000,
    createdAt: iso(-10),
    items: [{ orderItemId: 9001, quantity: 1, unitPrice: 59000, pack: mockPacks[0] }],
  },
  {
    orderId: 7002,
    customerId: 101,
    status: 'PROCESSING',
    totalPrice: 129000,
    createdAt: iso(-2),
    items: [{ orderItemId: 9002, quantity: 1, unitPrice: 129000, pack: mockPacks[1] }],
  },
]

export const mockWallet: WalletBalance = { balance: 2400, userId: 101 }

export const mockVouchers: Voucher[] = [
  { voucherId: 8001, code: 'PM-NEW-10', discountPercent: 10, expiresAt: iso(14), isUsed: false },
  { voucherId: 8002, code: 'PM-VIP-15', discountPercent: 15, expiresAt: iso(-2), isUsed: true },
]

export const mockUnlinkRequests: UnlinkRequest[] = [
  {
    requestId: 6001,
    customer: { accountId: 101, name: 'Minh Nguyen' },
    card: { cardId: 1001, nfcUid: '04A1B2C3D4', template: { name: 'Chrono Fox' } },
    requestedAt: iso(-1),
    status: 'PENDING',
  },
]

export const mockCardsByNfc: CardInfo[] = [
  {
    cardId: 1001,
    nfcUid: '04A1B2C3D4',
    status: 'PENDING_BIND',
    template: { templateId: 1, name: 'Chrono Fox', imageUrl: 'https://picsum.photos/seed/chronofox/300/420', rarity: 'COMMON' },
    owner: null,
  },
  {
    cardId: 1002,
    nfcUid: '04E5F6A7B8',
    status: 'LINKED',
    template: { templateId: 2, name: 'Moonlit Oracle', imageUrl: 'https://picsum.photos/seed/moonoracle/300/420', rarity: 'RARE' },
    owner: { accountId: 101, name: 'Minh Nguyen' },
  },
]

export const mockSpreads: Spread[] = [
  { spreadId: 1, name: 'One Card', description: 'Câu trả lời nhanh cho hiện tại.', positionCount: 1, minCardsRequired: 0 },
  { spreadId: 2, name: 'Past Present Future', description: 'Nhìn lại - hiện tại - định hướng.', positionCount: 3, minCardsRequired: 3 },
]

export const mockSessions: ReadingSession[] = [
  {
    sessionId: 9901,
    spread: mockSpreads[1],
    mode: 'YOUR_DECK',
    mainQuestion: 'Điều gì nên tập trung tuần này?',
    status: 'INTERPRETING',
    readingCards: [],
    aiInterpretation: null,
    createdAt: iso(-1),
  },
]
