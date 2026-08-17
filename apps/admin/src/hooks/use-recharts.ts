import { useEffect, useState } from "react"

import type * as RechartsModule from "recharts"

let rechartsCache: typeof RechartsModule | null = null

export function useRecharts(): typeof RechartsModule | null {
  const [recharts, setRecharts] = useState<typeof RechartsModule | null>(
    rechartsCache
  )

  useEffect(() => {
    if (rechartsCache) {
      return
    }

    let isMounted = true
    import("recharts")
      .then((m) => {
        if (isMounted) {
          rechartsCache = m
          setRecharts(m)
        }
      })
      .catch((err: unknown) => {
        console.warn("Failed to load recharts:", err)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return recharts
}
