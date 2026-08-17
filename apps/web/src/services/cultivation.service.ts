import { fetchApiClient } from "@/lib/ApiClient"
import type { CultivationBed, CultivationTree } from "@/types"

export interface CarePackage {
  id: string
  name: string
  price: number
  description?: string
  durationMonths?: number
  [key: string]: unknown
}

export interface ProtectionPackage {
  id: string
  name: string
  price: number
  description?: string
  durationMonths?: number
  [key: string]: unknown
}

export const cultivationService = {
  async getMyTrees(): Promise<CultivationTree[]> {
    const res = await fetchApiClient("/user/cultivation/trees")
    return res?.data || res || []
  },

  async getPublicBeds(query?: string): Promise<CultivationBed[]> {
    const queryStr = query ? `?garden=${encodeURIComponent(query)}` : ""
    const res = await fetchApiClient(`/public/cultivation/beds${queryStr}`)
    return res?.data || res || []
  },

  async getCarePackages(): Promise<CarePackage[]> {
    const res = await fetchApiClient("/user/packages/care")
    const items = res?.data?.items || res?.data || res?.items || res || []
    return Array.isArray(items) ? items : []
  },

  async getProtectionPackages(): Promise<ProtectionPackage[]> {
    const res = await fetchApiClient("/user/packages/protection")
    const items = res?.data?.items || res?.data || res?.items || res || []
    return Array.isArray(items) ? items : []
  },

  async subscribePackage(payload: {
    treeId: string
    packageType: "care" | "protection"
    packageId: string
    months: number
  }): Promise<any> {
    return fetchApiClient("/user/packages/subscribe", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
}
