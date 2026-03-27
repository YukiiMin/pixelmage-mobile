export interface Account {
  customerId: number
  email: string
  name: string
  role: { roleId: number; roleName: string }
  guestReadingUsedAt: string | null
}
