export interface LoginRequestDTO {
  email: string
  password: string
}

export interface RegisterRequestDTO {
  email: string
  password: string
  name: string
  phoneNumber?: string
}

export interface GoogleAuthRequestDTO {
  token: string
}

export interface AuthResponseData {
  accessToken: string
  refreshToken: string
  account: {
    customerId: number
    email: string
    name: string
    role: {
      roleId: number
      roleName: string
    }
  }
}
