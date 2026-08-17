import axios from "axios"
import { getSession } from "next-auth/react"

import { API_KEY } from "./api-key"
import type { AxiosInstance, AxiosRequestConfig } from "axios"
import type { ApiResponse } from "@/types/common.types"

const isServer = typeof window === "undefined"
const apiBaseUrl = isServer
  ? process.env.INTERNAL_API_URL || "http://localhost:3000/api"
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

const apiKey = API_KEY

export type { ApiResponse }

export const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  },
})

interface SessionUserWithToken {
  accessToken?: string
  [key: string]: unknown
}

apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== "undefined") {
        const session = await getSession()
        const user = session?.user as SessionUserWithToken | undefined
        const token = user?.accessToken
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } else {
        const { getServerSession } = await import("next-auth")
        const { authOptions } = await import("@/configs/next-auth")
        const session = await getServerSession(authOptions)
        const user = session?.user as SessionUserWithToken | undefined
        const token = user?.accessToken
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (error) {
      console.error("Error attaching authorization header to request:", error)
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error: any) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Đã có lỗi xảy ra khi kết nối máy chủ"
    if (error.response?.status === 401 && typeof window !== "undefined") {
      console.warn("Unauthorized access detected (401)")
    }
    const customError = new Error(errorMsg)
    ;(customError as any).status = error.response?.status
    ;(customError as any).response = error.response
    return Promise.reject(customError)
  }
)

export async function fetchApiData<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<T>(url, config)
  return response.data
}

export async function postApiData<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config)
  return response.data
}

export async function putApiData<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(url, data, config)
  return response.data
}

export async function deleteApiData<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.delete<T>(url, config)
  return response.data
}
