import axios from "axios"
import { getSession } from "next-auth/react"

import type { AxiosInstance, AxiosRequestConfig } from "axios"
import type { ApiResponse } from "@/types/common.types"

const isServer = typeof window === "undefined"
const apiBaseUrl = isServer
  ? process.env.INTERNAL_API_URL || "http://localhost:3000/api"
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

const apiKey = process.env.API_KEY || ""

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
  (error: { response?: { status?: number } }) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      console.warn(
        "Unauthorized access detected, redirecting or refreshing session if needed."
      )
    }
    return Promise.reject(error)
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
