import type { ApiResponse, Order } from "@/types"

import { fetchApiJson } from "@/lib/api"

export interface OrdersQueryParams {
  page?: number | string
  perPage?: number | string
  search?: string
  status?: string
  productType?: string
}

export const ordersService = {
  async getOrders(params?: OrdersQueryParams): Promise<ApiResponse<Order[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)
    if (params?.status && params.status !== "all")
      query.append("status", params.status)
    if (params?.productType && params.productType !== "all")
      query.append("productType", params.productType)

    return fetchApiJson<Order[]>(`/admin/orders?${query.toString()}`)
  },

  async getOrderDetail(id: string): Promise<ApiResponse<Order>> {
    return fetchApiJson<Order>(`/admin/orders/${id}`)
  },

  async updateOrderStatus(
    id: string,
    status: string
  ): Promise<ApiResponse<Order>> {
    return fetchApiJson<Order>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  },
}
