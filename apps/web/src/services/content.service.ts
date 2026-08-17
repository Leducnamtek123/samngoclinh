import { fetchApiClient } from "@/lib/ApiClient"

export const contentService = {
  async getArticles(params?: Record<string, string>): Promise<any> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : ""
    const res = await fetchApiClient(`/public/content/articles${query}`)
    return res?.data || res || []
  },

  async getBanner(pageKey: string): Promise<any> {
    const res = await fetchApiClient(`/public/banners/${pageKey}`)
    return res?.data || res || []
  },
}

export const paymentService = {
  async verifySepayOrder(orderCode: string): Promise<{ code: string; status: string; total: number }> {
    const res = await fetchApiClient(`/public/payment/sepay/verify/${encodeURIComponent(orderCode)}`)
    return res?.data || res
  },
}

export const settingsService = {
  async getShippingFee(): Promise<any> {
    const res = await fetchApiClient("/v1/public/settings/shipping_fee")
    return res?.data || res || null
  },
}
