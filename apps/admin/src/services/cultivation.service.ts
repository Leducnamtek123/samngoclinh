import { fetchApiJson } from "@/lib/api"
import type {
  ApiResponse,
  Bed,
  CareLog,
  Garden,
  QrCodeTraceability,
  Tree,
} from "@/types"

export interface CultivationPaginationParams {
  page?: number | string
  perPage?: number | string
  search?: string
  status?: string
  gardenId?: string
  bedId?: string
}

export const cultivationService = {
  // Gardens
  async getGardens(params?: CultivationPaginationParams): Promise<ApiResponse<Garden[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)
    if (params?.status && params.status !== "all") query.append("status", params.status)

    return fetchApiJson<Garden[]>(`/user/cultivation/gardens/paginated?${query.toString()}`)
  },

  async getGardenDetail(id: string): Promise<ApiResponse<Garden>> {
    return fetchApiJson<Garden>(`/user/cultivation/gardens/${id}`)
  },

  // Beds
  async getBeds(params?: CultivationPaginationParams): Promise<ApiResponse<Bed[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)
    if (params?.status && params.status !== "all") query.append("status", params.status)
    if (params?.gardenId && params.gardenId !== "all") query.append("gardenId", params.gardenId)

    return fetchApiJson<Bed[]>(`/user/cultivation/beds/paginated?${query.toString()}`)
  },

  // Trees
  async getTrees(params?: CultivationPaginationParams): Promise<ApiResponse<Tree[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)
    if (params?.status && params.status !== "all") query.append("status", params.status)
    if (params?.gardenId && params.gardenId !== "all") query.append("gardenId", params.gardenId)
    if (params?.bedId && params.bedId !== "all") query.append("bedId", params.bedId)

    try {
      const res = await fetchApiJson<Tree[]>(`/admin/cultivation/trees?${query.toString()}`)
      if (res?.data) return res
    } catch {}

    return fetchApiJson<Tree[]>(`/user/cultivation/trees/paginated?${query.toString()}`)
  },

  // Care Logs
  async getCareLogs(params?: CultivationPaginationParams): Promise<ApiResponse<CareLog[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)

    return fetchApiJson<CareLog[]>(`/user/cultivation/care-logs/paginated?${query.toString()}`)
  },

  // QR Code Traceability
  async getQrTraceability(code: string): Promise<ApiResponse<QrCodeTraceability>> {
    return fetchApiJson<QrCodeTraceability>(`/user/cultivation/trees/qr/${encodeURIComponent(code)}`)
  },
}
