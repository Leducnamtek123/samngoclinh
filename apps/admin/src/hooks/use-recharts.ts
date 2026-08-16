import { useEffect, useState } from "react"

let rechartsCache: any = null

export function useRecharts() {
  const [recharts, setRecharts] = useState<any>(rechartsCache)

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
      .catch((err) => {
        console.warn("Failed to load recharts:", err)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return recharts
}
