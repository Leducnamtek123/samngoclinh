import { fetchApiJson } from "@/lib/api"
import type {
  ApiResponse,
  GeneralSetting,
  PointsConversionSetting,
  ShippingFeeSetting,
} from "@/types"

export const settingsService = {
  async getShippingSettings(): Promise<ApiResponse<ShippingFeeSetting[]>> {
    return fetchApiJson<ShippingFeeSetting[]>("/admin/setting/shipping")
  },

  async getPointsSettings(): Promise<ApiResponse<PointsConversionSetting>> {
    return fetchApiJson<PointsConversionSetting>("/admin/setting/points")
  },

  async getGeneralSettings(): Promise<ApiResponse<GeneralSetting>> {
    return fetchApiJson<GeneralSetting>("/admin/setting/general")
  },
}
