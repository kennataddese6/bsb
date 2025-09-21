import type { DefaultJWT as BaseJWT } from 'next-auth/jwt'

export interface ApiAuthResponse {
  token: string
  userId: string
  role: string
  avatar: string
}

export interface ApiUserProfile {
  id: string
  fname: string
  lname: string
  email: string
  role: string
  avatar: string
  accountStatus: string
  emailVerified: boolean
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
}

// Define base user type without extending NextAuth's User to avoid circular references
export interface BaseUser {
  id: string
  role: string
  accessToken: string
  name?: string | null
  email?: string | null
  avatar?: string | null
}

// Define JWT type by extending the base JWT type
export type AuthJWT = BaseJWT & {
  accessToken: string
  accessTokenExpires: number
  refreshToken?: string
  user: {
    id: string
    name: string | null
    email: string | null
    role: string
    avatar: string | null
  }
  error?: string
}
