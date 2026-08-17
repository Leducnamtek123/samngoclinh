import { fetchApi, fetchApiJson } from "@/lib/api"
import type { AdminUser, ApiResponse, Role } from "@/types"

export interface UsersQueryParams {
  page?: number | string
  perPage?: number | string
  search?: string
  status?: string
  roleId?: string
}

export interface SelfProfileUpdateInput {
  name?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  state?: string
  country?: string
  zipCode?: string
  language?: string
  timeZone?: string
  currency?: string
  organization?: string
}

export const usersService = {
  async getUsers(params?: UsersQueryParams): Promise<ApiResponse<AdminUser[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)
    if (params?.status && params.status !== "all") query.append("status", params.status)
    if (params?.roleId && params.roleId !== "all") query.append("roleId", params.roleId)

    return fetchApiJson<AdminUser[]>(`/admin/user/list?${query.toString()}`)
  },

  async getRoles(): Promise<ApiResponse<Role[]>> {
    return fetchApiJson<Role[]>("/admin/role/list")
  },

  async getUserDetail(id: string): Promise<ApiResponse<AdminUser>> {
    return fetchApiJson<AdminUser>(`/admin/user/get/${id}`)
  },

  async getSelfProfile(): Promise<ApiResponse<any>> {
    return fetchApiJson<any>("/v1/shared/user/profile").catch(() => {
      return fetchApiJson<any>("/user/profile")
    })
  },

  async updateSelfProfile(data: SelfProfileUpdateInput): Promise<ApiResponse<any>> {
    try {
      return await fetchApiJson<any>("/v1/shared/user/profile/update", {
        method: "PUT",
        body: JSON.stringify({
          name: data.name,
          gender: "unknown",
        }),
      })
    } catch {
      return await fetchApiJson<any>("/user/profile/update", {
        method: "PUT",
        body: JSON.stringify({
          name: data.name,
        }),
      })
    }
  },

  async uploadAvatar(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetchApi("/v1/shared/user/profile/upload/photo", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      throw new Error("Không thể tải lên ảnh đại diện.")
    }

    return res.json()
  },

  async changePassword(data: {
    currentPassword?: string
    oldPassword?: string
    newPassword?: string
  }): Promise<ApiResponse<any>> {
    return fetchApiJson<any>("/v1/shared/user/password/change", {
      method: "PUT",
      body: JSON.stringify({
        oldPassword: data.currentPassword || data.oldPassword,
        newPassword: data.newPassword,
      }),
    }).catch(() => {
      return fetchApiJson<any>("/user/password/change", {
        method: "PUT",
        body: JSON.stringify({
          oldPassword: data.currentPassword || data.oldPassword,
          newPassword: data.newPassword,
        }),
      })
    })
  },
}
