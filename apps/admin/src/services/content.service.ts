import { fetchApiJson } from "@/lib/api"
import type { ApiResponse, Article, Banner } from "@/types"

export interface ContentQueryParams {
  page?: number | string
  perPage?: number | string
  search?: string
  status?: string
}

export const contentService = {
  // Banners
  async getBanners(params?: ContentQueryParams): Promise<ApiResponse<Banner[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)

    return fetchApiJson<Banner[]>(`/admin/banner?${query.toString()}`)
  },

  // Articles / News
  async getArticles(params?: ContentQueryParams): Promise<ApiResponse<Article[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)

    return fetchApiJson<Article[]>(`/admin/content/articles?${query.toString()}`)
  },
}
