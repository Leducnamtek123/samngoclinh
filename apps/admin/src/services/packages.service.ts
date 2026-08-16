import { fetchApiJson } from "@/lib/api"
import type { ApiResponse, CarePackage, ProtectionPackage } from "@/types"

export const packagesService = {
  async getCarePackages(params?: Record<string, unknown>): Promise<ApiResponse<CarePackage[]>> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""
    return fetchApiJson<CarePackage[]>(`/admin/packages/care-packages${query}`)
  },

  async getProtectionPackages(params?: Record<string, unknown>): Promise<ApiResponse<ProtectionPackage[]>> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""
    return fetchApiJson<ProtectionPackage[]>(`/admin/packages/protection-packages${query}`)
  },

  async createCarePackage(data: Partial<CarePackage>): Promise<ApiResponse<CarePackage>> {
    return fetchApiJson<CarePackage>("/admin/packages/care-packages", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateCarePackage(id: string, data: Partial<CarePackage>): Promise<ApiResponse<CarePackage>> {
    return fetchApiJson<CarePackage>(`/admin/packages/care-packages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async deleteCarePackage(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return fetchApiJson<{ success: boolean }>(`/admin/packages/care-packages/${id}`, {
      method: "DELETE",
    })
  },

  async createProtectionPackage(data: Partial<ProtectionPackage>): Promise<ApiResponse<ProtectionPackage>> {
    return fetchApiJson<ProtectionPackage>("/admin/packages/protection-packages", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateProtectionPackage(id: string, data: Partial<ProtectionPackage>): Promise<ApiResponse<ProtectionPackage>> {
    return fetchApiJson<ProtectionPackage>(`/admin/packages/protection-packages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async deleteProtectionPackage(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return fetchApiJson<{ success: boolean }>(`/admin/packages/protection-packages/${id}`, {
      method: "DELETE",
    })
  },
}
