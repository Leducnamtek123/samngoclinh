import type { ApiResponse, Article, Banner } from "@/types"

import { fetchApiJson } from "@/lib/api"

export interface ContentQueryParams {
  page?: number | string
  perPage?: number | string
  search?: string
  status?: string
}

export const contentService = {
  // Banners
  async getBanners(
    params?: ContentQueryParams
  ): Promise<ApiResponse<Banner[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)

    return fetchApiJson<Banner[]>(
      `/admin/banners${query.toString() ? `?${query.toString()}` : ""}`
    )
  },

  async createBanner(data: Partial<Banner>): Promise<ApiResponse<Banner>> {
    return fetchApiJson<Banner>("/admin/banners", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateBanner(
    id: string,
    data: Partial<Banner>
  ): Promise<ApiResponse<Banner>> {
    return fetchApiJson<Banner>(`/admin/banners/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async deleteBanner(id: string): Promise<ApiResponse<Banner>> {
    return fetchApiJson<Banner>(`/admin/banners/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
  },

  // Articles / News
  async getArticles(
    params?: ContentQueryParams
  ): Promise<ApiResponse<Article[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)
    if (params?.status && params.status !== "all")
      query.append("category", params.status)

    return fetchApiJson<Article[]>(
      `/public/content/articles${query.toString() ? `?${query.toString()}` : ""}`
    )
  },

  async createArticle(data: Partial<Article>): Promise<ApiResponse<Article>> {
    return fetchApiJson<Article>("/admin/content/articles", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateArticle(
    id: string,
    data: Partial<Article>
  ): Promise<ApiResponse<Article>> {
    return fetchApiJson<Article>(
      `/admin/content/articles/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    )
  },

  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    return fetchApiJson<void>(
      `/admin/content/articles/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    )
  },
}
