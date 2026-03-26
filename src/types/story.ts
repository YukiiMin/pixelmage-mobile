export interface Story {
  storyId: number
  title: string
  coverImageUrl?: string
  isUnlocked: boolean
  collection: { collectionId: number; name: string }
}

export interface StoryDetail extends Story {
  content: string
  unlockedAt?: string
}
