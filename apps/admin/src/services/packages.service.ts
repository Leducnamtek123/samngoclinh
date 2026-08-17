import { fetchApiJson } from "@/lib/api"
import type { ApiResponse, CarePackage, ProtectionPackage } from "@/types"

export interface PackageListResponse<T> {
  items: T[]
}

export const packagesService = {
  async getCarePackages(params?: Record<string, unknown>): Promise<ApiResponse<PackageListResponse<CarePackage> | CarePackage[]>> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""
    return fetchApiJson<PackageListResponse<CarePackage> | CarePackage[]>(`/admin/packages/care${query}`)
  },

  async getProtectionPackages(params?: Record<string, unknown>): Promise<ApiResponse<PackageListResponse<ProtectionPackage> | ProtectionPackage[]>> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""
    return fetchApiJson<PackageListResponse<ProtectionPackage> | ProtectionPackage[]>(`/admin/packages/protection${query}`)
  },

  async createCarePackage(data: Partial<CarePackage>): Promise<ApiResponse<CarePackage>> {
    return fetchApiJson<CarePackage>("/admin/packages/care", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateCarePackage(id: string, data: Partial<CarePackage>): Promise<ApiResponse<CarePackage>> {
    return fetchApiJson<CarePackage>(`/admin/packages/care/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async deleteCarePackage(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return fetchApiJson<{ success: boolean }>(`/admin/packages/care/${id}`, {
      method: "DELETE",
    })
  },

  async createProtectionPackage(data: Partial<ProtectionPackage>): Promise<ApiResponse<ProtectionPackage>> {
    return fetchApiJson<ProtectionPackage>("/admin/packages/protection", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateProtectionPackage(id: string, data: Partial<ProtectionPackage>): Promise<ApiResponse<ProtectionPackage>> {
    return fetchApiJson<ProtectionPackage>(`/admin/packages/protection/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async deleteProtectionPackage(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return fetchApiJson<{ success: boolean }>(`/admin/packages/protection/${id}`, {
      method: "DELETE",
    })
  },
}
