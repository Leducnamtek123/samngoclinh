import { useRef, useEffect, useLayoutEffect, useCallback } from "react"

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export function useEvent<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef<T>(fn)

  useIsomorphicLayoutEffect(() => {
    ref.current = fn
  }, [fn])

  return useCallback((...args: Parameters<T>) => {
    const fnCurrent = ref.current
    return fnCurrent(...args)
  }, []) as unknown as T
}
