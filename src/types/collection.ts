export type CollectionType = 'STANDARD' | 'LIMITED' | 'HIDDEN'

export interface Collection {
  collectionId: number
  name: string
  description: string
  type: CollectionType
  totalCards: number
  imageUrl?: string
}

export interface CollectionProgress {
  collectionId: number
  collectionName: string
  ownedCards: number
  totalCards: number
  progressPercent: number  // 0-100
  isCompleted: boolean
}

export interface CollectionProgressDetail {
  collectionId: number
  collectionName: string
  ownedCards: number
  totalCards: number
  stories: StoryStatus[]
  achievements: AchievementStatus[]
}

export interface StoryStatus {
  storyId: number
  title: string
  isUnlocked: boolean  // true nếu collection đủ card để unlock
}

export interface AchievementStatus {
  achievementId: number
  name: string
  isEarned: boolean
}
