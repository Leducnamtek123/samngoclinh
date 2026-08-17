import type { ApiResponse, ShopCategory, ShopItem } from "@/types"

import { fetchApiJson } from "@/lib/api"

export interface CatalogQueryParams {
  page?: number | string
  perPage?: number | string
  search?: string
  status?: string
  categoryId?: string
}

export const catalogService = {
  async getShopItems(
    params?: CatalogQueryParams
  ): Promise<ApiResponse<ShopItem[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)
    if (params?.status && params.status !== "all")
      query.append("status", params.status)
    if (params?.categoryId && params.categoryId !== "all")
      query.append("categoryId", params.categoryId)

    return fetchApiJson<ShopItem[]>(
      `/public/catalog/shop-items?${query.toString()}`
    )
  },

  async getShopCategories(): Promise<ApiResponse<ShopCategory[]>> {
    return fetchApiJson<ShopCategory[]>("/public/catalog/categories")
  },

  async getShopItemDetail(id: string): Promise<ApiResponse<ShopItem>> {
    return fetchApiJson<ShopItem>(`/public/catalog/shop-items/${id}`)
  },
}
