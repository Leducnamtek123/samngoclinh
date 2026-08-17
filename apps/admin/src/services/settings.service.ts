import { fetchApiJson } from "@/lib/api"
import type { ApiResponse, SystemSetting } from "@/types"

export const settingsService = {
  async getSettings(): Promise<ApiResponse<{ items: SystemSetting[] } | SystemSetting[]>> {
    return fetchApiJson<{ items: SystemSetting[] } | SystemSetting[]>("/admin/settings")
  },

  async getSetting(key: string): Promise<ApiResponse<SystemSetting>> {
    return fetchApiJson<SystemSetting>(`/admin/settings/${key}`)
  },

  async updateSetting(key: string, value: unknown): Promise<ApiResponse<SystemSetting>> {
    return fetchApiJson<SystemSetting>(`/admin/settings/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    })
  },

  async getShippingSettings(): Promise<ApiResponse<SystemSetting>> {
    return fetchApiJson<SystemSetting>("/admin/settings/shipping_fee")
  },

  async getPointsSettings(): Promise<ApiResponse<SystemSetting>> {
    return fetchApiJson<SystemSetting>("/admin/settings/point_rate")
  },

  async getGeneralSettings(): Promise<ApiResponse<{ items: SystemSetting[] } | SystemSetting[]>> {
    return fetchApiJson<{ items: SystemSetting[] } | SystemSetting[]>("/admin/settings")
  },
}
