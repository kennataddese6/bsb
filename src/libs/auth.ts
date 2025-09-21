// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import type { DefaultSession, NextAuthOptions } from 'next-auth'

import type { ApiAuthResponse, ApiUserProfile, AuthJWT, BaseUser } from '@/types/apps/authTypes'

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
      avatar?: string | null
    } & DefaultSession['user']
    accessToken: string
    error?: string
  }

  // Extend the default User type
  interface User extends BaseUser {}
}

// Extend JWT type
declare module 'next-auth/jwt' {
  interface JWT extends AuthJWT {}
}

// Export types for use in the application
export type User = BaseUser
export type { AuthJWT as JWT }

/* async function refreshAccessToken(token: AuthJWT): Promise<AuthJWT> {
  try {
    // If you have a refresh token endpoint, implement the refresh logic here
    // Example implementation:

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: token.refreshToken })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken
    }

    // For now, we'll just return the existing token
    return token
  } catch (error) {
    console.error('Error refreshing access token', error)

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
} */

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password'
        }
      },
      async authorize(credentials: Record<'email' | 'password', string> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          const res = await fetch(`${process.env.BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))

            throw new Error(errorData.message || 'Login failed')
          }

          const data: ApiAuthResponse = await res.json()

          // Get user profile using the token
          const profileRes = await fetch(`${process.env.BASE_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${data.token}`,
              Accept: 'application/json'
            }
          })

          if (!profileRes.ok) {
            const errorData = await profileRes.json().catch(() => ({}))

            throw new Error(errorData.message || 'Failed to fetch user profile')
          }

          const userProfile: ApiUserProfile = await profileRes.json()

          // Return user data to be stored in the session
          return {
            id: userProfile.id,
            email: userProfile.email,
            name: `${userProfile.fname} ${userProfile.lname}`.trim(),
            role: userProfile.role,
            avatar: userProfile.avatar,
            accessToken: data.token
          }
        } catch (error: any) {
          console.error('Authentication error:', error)
          throw new Error(error.message || 'Failed to authenticate')
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (trigger === 'update' && session) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        const updatedSession = session as { name?: string; email?: string; role?: string; avatar?: string }

        if (updatedSession.name) token.user.name = updatedSession.name
        if (updatedSession.email) token.user.email = updatedSession.email
        if (updatedSession.role) token.user.role = updatedSession.role
        if (updatedSession.avatar !== undefined) token.user.avatar = updatedSession.avatar

        return token
      }

      // First time login, persist the backend token
      if (user) {
        token.accessToken = (user as any).accessToken
        token.user = {
          id: user.id || '',
          name: user.name || null,
          email: user.email || null,
          avatar: user.avatar || null,
          role: (user as any).role || 'user'
        }
      }

      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.user?.id || '',
        name: token.user?.name || null,
        email: token.user?.email || null,
        role: token.user?.role || 'user',
        avatar: token.user?.avatar || null,

        // For backward compatibility with NextAuth's default image property
        image: token.user?.avatar || null
      }

      // Expose backend token to client
      session.accessToken = token.accessToken as string

      return session
    }
  }
}
