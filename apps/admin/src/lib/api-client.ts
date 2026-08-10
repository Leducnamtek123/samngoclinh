import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { getSession } from "next-auth/react"

const isServer = typeof window === "undefined"
const apiBaseUrl = isServer
  ? process.env.INTERNAL_API_URL || "http://apis:3000/api"
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

const apiKey = process.env.NEXT_PUBLIC_API_KEY || ""

export interface ApiResponse<T = any> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: any;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  },
})

apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== "undefined") {
        const session = await getSession()
        const token = (session?.user as any)?.accessToken
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (error) {
      console.error("Error attaching authorization header to request:", error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      console.warn(
        "Unauthorized access detected, redirecting or refreshing session if needed."
      )
    }
    return Promise.reject(error)
  }
)

export async function fetchApiData<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<T>(url, config)
  return response.data
}

export async function postApiData<T = any, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config)
  return response.data
}

export async function putApiData<T = any, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(url, data, config)
  return response.data
}

export async function deleteApiData<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.delete<T>(url, config)
  return response.data
}
