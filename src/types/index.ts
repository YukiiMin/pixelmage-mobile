/**
 * Universal Response Envelope for Backend API
 */
export interface ResponseBase<T> {
  code: number
  message: string
  data: T
}

export * from './auth'
export * from './account'
export * from './inventory'
export * from './collection'
export * from './tarot'
export * from './story'
export * from './achievement'
export * from './marketplace'
export * from './order'
export * from './card'
export * from './unlink'
export * from './wallet'
