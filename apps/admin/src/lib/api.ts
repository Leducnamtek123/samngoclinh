import type { ApiResponse } from "@/types/common.types"

import { API_KEY } from "./api-key"

interface SessionUserWithToken {
  accessToken?: string
  [key: string]: unknown
}

interface CachedToken {
  token: string | null
  expiresAt: number
}

let inMemoryTokenCache: CachedToken | null = null
let inFlightTokenPromise: Promise<string | null> | null = null

export async function getSessionToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    try {
      const { getServerSession } = await import("next-auth")
      const { authOptions } = await import("@/configs/next-auth")
      const session = await getServerSession(authOptions)
      const user = session?.user as SessionUserWithToken | undefined
      return user?.accessToken || null
    } catch (error) {
      console.error("Error getting server session token:", error)
      return null
    }
  }

  // Client-side cache check (valid for 60 seconds)
  const now = Date.now()
  if (inMemoryTokenCache && inMemoryTokenCache.expiresAt > now) {
    return inMemoryTokenCache.token
  }

  // In-flight deduplication: prevent concurrent requests from firing multiple /api/auth/session calls
  if (inFlightTokenPromise) {
    return inFlightTokenPromise
  }

  inFlightTokenPromise = (async () => {
    try {
      const { getSession } = await import("next-auth/react")
      const session = await getSession()
      const user = session?.user as SessionUserWithToken | undefined
      const token = user?.accessToken || null
      inMemoryTokenCache = {
        token,
        expiresAt: Date.now() + 60 * 1000,
      }
      return token
    } catch (error) {
      console.error("Error getting client session token:", error)
      return null
    } finally {
      inFlightTokenPromise = null
    }
  })()

  return inFlightTokenPromise
}

const NEUTRAL_PATHS = [
  "/catalog",
  "/orders",
  "/cultivation",
  "/banners",
  "/content",
  "/settings",
  "/packages",
  "/wallet",
  "/profile",
  "/promotion",
  "/notification",
  "/identity-verification",
  "/contracts",
  "/marketplace",
  "/contacts",
  "/backoffice",
]

export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getSessionToken()

  let isNeutral = endpoint.startsWith("/admin")
  if (!isNeutral) {
    for (const path of NEUTRAL_PATHS) {
      if (endpoint.includes(path)) {
        isNeutral = true
        break
      }
    }
  }

  const isServer = typeof window === "undefined"
  const apiBaseUrl = isServer
    ? process.env.INTERNAL_API_URL || "http://localhost:3000/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

  const baseUrl = isNeutral ? apiBaseUrl : `${apiBaseUrl}/v1`
  const apiKey = API_KEY

  const headersRecord: Record<string, string> = {
    "x-api-key": apiKey,
  }

  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((val, key) => {
        headersRecord[key] = val
      })
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, val]) => {
        headersRecord[key] = val
      })
    } else {
      Object.assign(headersRecord, options.headers)
    }
  }

  if (
    options.body &&
    typeof window !== "undefined" &&
    options.body instanceof FormData
  ) {
    // Let browser set boundaries automatically
  } else {
    headersRecord["Content-Type"] = "application/json"
  }

  if (token) {
    headersRecord["Authorization"] = `Bearer ${token}`
  }

  const url = `${baseUrl}${endpoint}`

  return fetch(url, {
    ...options,
    headers: headersRecord,
  })
}

export async function fetchApiJson<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetchApi(endpoint, options)
  const payload = (await res.json()) as ApiResponse<T>
  if (!res.ok) {
    throw new Error(
      payload?.message || `Request failed with status ${res.status}`
    )
  }
  return payload
}

export async function fetchApiData<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetchApi(url, {
    method: "GET",
    ...options,
  })
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok) {
    const errorMsg = json?.message || `Request failed with status ${res.status}`
    const error = new Error(errorMsg)
    ;(error as unknown as { status: number }).status = res.status
    throw error
  }
  return json as unknown as T
}

export async function postApiData<T = unknown, D = unknown>(
  url: string,
  data?: D,
  options?: RequestInit
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData
  const body = isFormData
    ? (data as FormData)
    : data !== undefined
      ? JSON.stringify(data)
      : undefined
  const res = await fetchApi(url, {
    method: "POST",
    body,
    ...options,
  })
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok) {
    const errorMsg = json?.message || `Request failed with status ${res.status}`
    const error = new Error(errorMsg)
    ;(error as unknown as { status: number }).status = res.status
    throw error
  }
  return json as unknown as T
}

export async function putApiData<T = unknown, D = unknown>(
  url: string,
  data?: D,
  options?: RequestInit
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData
  const body = isFormData
    ? (data as FormData)
    : data !== undefined
      ? JSON.stringify(data)
      : undefined
  const res = await fetchApi(url, {
    method: "PUT",
    body,
    ...options,
  })
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok) {
    const errorMsg = json?.message || `Request failed with status ${res.status}`
    const error = new Error(errorMsg)
    ;(error as unknown as { status: number }).status = res.status
    throw error
  }
  return json as unknown as T
}

export async function deleteApiData<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetchApi(url, {
    method: "DELETE",
    ...options,
  })
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok) {
    const errorMsg = json?.message || `Request failed with status ${res.status}`
    const error = new Error(errorMsg)
    ;(error as unknown as { status: number }).status = res.status
    throw error
  }
  return json as unknown as T
}
