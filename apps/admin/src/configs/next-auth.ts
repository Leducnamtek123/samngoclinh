import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"

import { db } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"

// Extend NextAuth's Session and User interfaces to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      name: string
      avatar: string | null
      status: string
      accessToken?: string | null
    }
    error?: string
  }

  interface User {
    id: string
    email: string | null
    name: string
    avatar: string | null
    status: string
    accessToken?: string | null
    refreshToken?: string | null
    expiresIn?: number
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string | null
    name: string
    avatar: string | null
    status: string
    accessToken?: string | null
    refreshToken?: string | null
    accessTokenExpires?: number
    error?: string
  }
}

async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.INTERNAL_API_URL || "http://localhost:3000/api"}/v1/user/refresh`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP",
        "Authorization": `Bearer ${token.refreshToken}`,
      },
    })

    const refreshedTokens = await response.json()
    const tokenData = refreshedTokens.data?.tokens || refreshedTokens.data

    if (!response.ok || !tokenData?.accessToken) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + (tokenData.expiresIn || 3600) * 1000,
    }
  } catch (error) {
    console.error("Error refreshing access token", error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

// Configuration for NextAuth with custom adapters and providers
// NextAuth.js documentation: https://next-auth.js.org/getting-started/introduction
export const authOptions: NextAuthOptions = {
  // Use Prisma adapter for database interaction
  // More info: https://next-auth.js.org/getting-started/adapter
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "AccessToken", type: "text" },
        refreshToken: { label: "RefreshToken", type: "text" },
        expiresIn: { label: "ExpiresIn", type: "text" },
      },
      // Custom authorize function to validate user credentials
      async authorize(credentials) {
        if (!credentials) return null

        // If an accessToken is provided, we use it directly to fetch user details and validate session
        if (credentials.accessToken) {
          try {
            const res = await fetch(`${process.env.INTERNAL_API_URL || "http://localhost:3000/api"}/user/profile/me`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${credentials.accessToken}`,
                "x-api-key": "local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP",
              },
            })

            const payload = await res.json()

            if (res.status >= 400 || !payload.data) {
              return null
            }

            return {
              id: payload.data.id,
              name: payload.data.name || payload.data.username || "Admin",
              email: payload.data.email,
              avatar: "/images/avatars/male-01.svg",
              status: "ONLINE",
              accessToken: credentials.accessToken,
              refreshToken: credentials.refreshToken,
              expiresIn: Number(credentials.expiresIn) || 3600,
            }
          } catch (e) {
            console.error("Token verification failed:", e)
            return null
          }
        }

        try {
          const res = await fetch(`${process.env.INTERNAL_API_URL || "http://localhost:3000/api"}/v1/public/user/login/credential`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              from: "website",
              device: {
                fingerprint: "admin-fingerprint"
              }
            }),
          })

          const payload = await res.json()

          if (res.status >= 400 || !payload.data?.tokens?.accessToken) {
            throw new Error(payload?.message ?? "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
          }

          const accessToken = payload.data.tokens.accessToken
          const refreshToken = payload.data.tokens.refreshToken || ""
          const expiresIn = payload.data.tokens.expiresIn || 3600

          const profileRes = await fetch(`${process.env.INTERNAL_API_URL || "http://localhost:3000/api"}/user/profile/me`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "x-api-key": "local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP",
            },
          })

          const profilePayload = await profileRes.json()

          return {
            id: profilePayload.data?.id || "admin-id",
            name: profilePayload.data?.name || profilePayload.data?.username || "Admin",
            email: profilePayload.data?.email || credentials.email,
            avatar: "/images/avatars/male-01.svg",
            status: "ONLINE",
            accessToken,
            refreshToken,
            expiresIn,
          }
        } catch (e: unknown) {
          throw new Error(
            e instanceof Error ? e.message : "Đăng nhập thất bại. Không thể kết nối tới máy chủ."
          )
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
  session: {
    strategy: "jwt", // Use JWT strategy for sessions
    maxAge: 30 * 24 * 60 * 60, // Set session expiration to 30 days
    // More info on session strategies: https://next-auth.js.org/getting-started/options#session
  },
  callbacks: {
    // Callback to add custom user properties to JWT
    // Learn more: https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.avatar = user.avatar
        token.email = user.email
        token.status = user.status
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = Date.now() + (user.expiresIn || 3600) * 1000
      }

      // Check if access token has expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to update it using refresh token
      return refreshAccessToken(token)
    },
    // Callback to include JWT properties in the session object
    // Learn more: https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.avatar = token.avatar
        session.user.email = token.email
        session.user.status = token.status
        session.user.accessToken = token.accessToken
      }

      if (token.error) {
        (session as any).error = token.error
      }

      return session
    },
  },
}
