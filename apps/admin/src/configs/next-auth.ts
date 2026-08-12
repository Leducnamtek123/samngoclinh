import { PrismaAdapter } from "@auth/prisma-adapter"

import type { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"

import { API_KEY } from "@/lib/api-key"
import { db } from "@/lib/prisma"

import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      name: string
      avatar: string | null
      status: string
      role?: string | null
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
    role?: string | null
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
    role?: string | null
    accessToken?: string | null
    refreshToken?: string | null
    accessTokenExpires?: number
    error?: string
  }
}

async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.INTERNAL_API_URL || "http://localhost:3000/api"}/v1/shared/user/refresh`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        Authorization: `Bearer ${token.refreshToken}`,
      },
    })

    const refreshedTokens = await response.json()
    const tokenData = refreshedTokens.data?.tokens || refreshedTokens.data

    if (!response.ok || !tokenData?.accessToken) {
      throw refreshedTokens
    }

    const expiresInSeconds = Number(tokenData.expiresIn) || 3600

    return {
      ...token,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + (expiresInSeconds - 60) * 1000,
      error: undefined,
    }
  } catch (error) {
    console.error("Error refreshing access token", error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "RememberMe", type: "text" },
        accessToken: { label: "AccessToken", type: "text" },
        refreshToken: { label: "RefreshToken", type: "text" },
        expiresIn: { label: "ExpiresIn", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        if (credentials.accessToken) {
          try {
            const res = await fetch(
              `${process.env.INTERNAL_API_URL || "http://localhost:3000/api"}/v1/shared/user/profile`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${credentials.accessToken}`,
                  "x-api-key": API_KEY,
                },
              }
            )

            const payload = await res.json()

            if (res.status >= 400 || !payload.data) {
              return null
            }

            const userRole =
              payload.data.role?.name ||
              payload.data.role ||
              (payload.data.email?.includes("superadmin")
                ? "SUPER_ADMIN"
                : payload.data.email?.includes("admin")
                  ? "ADMIN"
                  : "USER")

            return {
              id: payload.data.id,
              name:
                payload.data.fullName ||
                payload.data.name ||
                payload.data.username ||
                "Admin",
              email: payload.data.email,
              avatar: payload.data.avatarUrl || null,
              status: "ONLINE",
              role: userRole,
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
          const res = await fetch(
            `${process.env.INTERNAL_API_URL || "http://localhost:3000/api"}/v1/public/user/login/credential`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                from: "website",
                device: {
                  fingerprint: "admin-fingerprint",
                },
              }),
            }
          )

          const payload = await res.json()

          if (res.status >= 400 || !payload.data?.tokens?.accessToken) {
            throw new Error(
              payload?.message ??
                "Invalid login credentials. Please check your information."
            )
          }

          const accessToken = payload.data.tokens.accessToken
          const refreshToken = payload.data.tokens.refreshToken || ""
          const tokenExpiresIn = Number(payload.data.tokens.expiresIn) || 3600

          const profileRes = await fetch(
            `${process.env.INTERNAL_API_URL || "http://localhost:3000/api"}/v1/shared/user/profile`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": API_KEY,
              },
            }
          )

          const profilePayload = await profileRes.json()

          const userEmail = profilePayload.data?.email || credentials.email
          const userRole =
            profilePayload.data?.role?.name ||
            profilePayload.data?.role ||
            (userEmail?.includes("superadmin")
              ? "SUPER_ADMIN"
              : userEmail?.includes("admin")
                ? "ADMIN"
                : "USER")

          return {
            id: profilePayload.data?.id || "admin-id",
            name:
              profilePayload.data?.fullName ||
              profilePayload.data?.name ||
              profilePayload.data?.username ||
              "Admin",
            email: userEmail,
            avatar: profilePayload.data?.avatarUrl || null,
            status: "ONLINE",
            role: userRole,
            accessToken,
            refreshToken,
            expiresIn: tokenExpiresIn,
          }
        } catch (e: unknown) {
          throw new Error(
            e instanceof Error
              ? e.message
              : "Login failed. Unable to connect to server."
          )
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.avatar = user.avatar
        token.email = user.email
        token.status = user.status
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        const expiresInSeconds = Number(user.expiresIn) || 3600
        token.accessTokenExpires = Date.now() + (expiresInSeconds - 60) * 1000
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.avatar = token.avatar
        session.user.email = token.email
        session.user.status = token.status
        session.user.role = token.role
        session.user.accessToken = token.accessToken
      }

      if (token.error) {
        ;(session as any).error = token.error
      }

      return session
    },
  },
}

if (typeof window === "undefined") {
  ;(globalThis as any).getServerSessionToken = async () => {
    const { getServerSession } = require("next-auth")
    const session = await getServerSession(authOptions)
    return (session?.user as any)?.accessToken || null
  }
}
