import { API_KEY } from "./api-key"
import type { ApiResponse } from "@/types/common.types"

interface SessionUserWithToken {
  accessToken?: string
  [key: string]: unknown
}

export async function getSessionToken(): Promise<string | null> {
  try {
    if (typeof window === "undefined") {
      const { getServerSession } = await import("next-auth")
      const { authOptions } = await import("@/configs/next-auth")
      const session = await getServerSession(authOptions)
      const user = session?.user as SessionUserWithToken | undefined
      return user?.accessToken || null
    } else {
      const { getSession } = await import("next-auth/react")
      const session = await getSession()
      const user = session?.user as SessionUserWithToken | undefined
      return user?.accessToken || null
    }
  } catch (error) {
    console.error("Error getting session token:", error)
    return null
  }
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

export async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<Response> {
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
    throw new Error(payload?.message || `Request failed with status ${res.status}`)
  }
  return payload
}

export {
  apiClient,
  fetchApiData,
  postApiData,
  putApiData,
  deleteApiData,
  type ApiResponse,
} from "./api-client"
