import { fetchApiJson } from "@/lib/api"
import type { AdminUser, ApiResponse, Role } from "@/types"

export interface UsersQueryParams {
  page?: number | string
  perPage?: number | string
  search?: string
  status?: string
  roleId?: string
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
}
