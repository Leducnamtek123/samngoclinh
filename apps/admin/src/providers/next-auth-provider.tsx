"use client"

import { useEffect } from "react"
import { SessionProvider, signOut, useSession } from "next-auth/react"

import type { SessionProviderProps } from "next-auth/react"

function SessionErrorListener() {
  const { data: session } = useSession()

  useEffect(() => {
    if ((session as any)?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/sign-in" })
    }
  }, [session])

  return null
}

export const NextAuthProvider = ({
  children,
  ...props
}: SessionProviderProps) => {
  return (
    <SessionProvider
      refetchOnWindowFocus={true}
      refetchInterval={4 * 60}
      {...props}
    >
      <SessionErrorListener />
      {children}
    </SessionProvider>
  )
}
