export interface Account {
  customerId: number
  email: string
  name: string
  phoneNumber?: string | null
  avatarUrl?: string | null
  emailVerified: boolean
  authProvider: 'LOCAL' | 'GOOGLE'
  isActive: boolean
  role: {
    roleId: number
    roleName: string
  }
  createdAt: string
  updatedAt: string
  guestReadingUsedAt: string | null
}

export interface UpdateProfileRequestDTO {
  name: string
}

export interface ChangePasswordRequestDTO {
  oldPass: string
  newPass: string
}
