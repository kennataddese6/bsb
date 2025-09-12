// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import type { DefaultSession, NextAuthOptions } from 'next-auth'
import type { DefaultJWT as BaseJWT } from 'next-auth/jwt'

// Type definitions for the external API responses
interface ApiAuthResponse {
  token: string
  userId: string
  role: string
  avatar: string
}

interface ApiUserProfile {
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
interface BaseUser {
  id: string
  role: string
  accessToken: string
  name?: string | null
  email?: string | null
}

// Define JWT type by extending the base JWT type
type AuthJWT = BaseJWT & {
  accessToken: string
  accessTokenExpires: number
  refreshToken?: string
  user: {
    id: string
    name?: string | null
    email?: string | null
    role: string
    avatar: string
  }
  error?: string
}

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
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
  // ** Configure one or more authentication providers
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
          // Call the external login API
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

    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (trigger === 'update' && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.user.name = session.name
        token.user.email = session.email
        token.user.role = session.role
        token.user.avatar = session.avatar

        return token
      }

      // First time login, persist the backend token
      if (user) {
        token.accessToken = (user as any).accessToken
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: (user as any).role || 'user'
        }
      }

      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.user?.id,
        name: token.user?.name || null,
        email: token.user?.email || null,
        role: token.user?.role || 'user',
        avatar: token.user?.avatar
      }

      // Expose backend token to client
      session.accessToken = token.accessToken as string

      return session
    }
  }
}
