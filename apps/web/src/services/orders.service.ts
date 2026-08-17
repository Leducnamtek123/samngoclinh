import { fetchApiClient } from "@/lib/ApiClient"

export interface CheckoutPayload {
  recipientName: string
  phoneNumber: string
  shippingAddress: string
  paymentMethod: "sepay" | "wallet" | "cod"
  items: Array<{
    productId: string
    quantity: number
  }>
  notes?: string
}

export const ordersService = {
  async checkout(payload: CheckoutPayload): Promise<any> {
    return fetchApiClient("/user/orders/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  async getMyOrders(params?: Record<string, string>): Promise<any> {
    const query = params && Object.keys(params).length > 0 ? `?${new URLSearchParams(params).toString()}` : ""
    return fetchApiClient(`/user/orders${query}`)
  },

  async getOrderDetail(orderId: string): Promise<any> {
    const res = await fetchApiClient(`/user/orders/${orderId}`)
    return res?.data || res
  },

  async cancelOrder(orderId: string, reason?: string): Promise<any> {
    return fetchApiClient(`/user/orders/${orderId}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    })
  },
}
