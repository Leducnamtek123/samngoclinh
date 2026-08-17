import { fetchApiClient } from "@/lib/ApiClient"

export const notificationService = {
  async getList(): Promise<any[]> {
    const res = await fetchApiClient("/v1/shared/notification/list")
    return res?.data || res || []
  },

  async markAsRead(id: string): Promise<any> {
    return fetchApiClient(`/v1/shared/notification/update/read/${id}`, {
      method: "PATCH",
    })
  },

  async markAllAsRead(): Promise<any> {
    return fetchApiClient("/v1/shared/notification/update/read-all", {
      method: "POST",
    })
  },

  async getUserSetting(): Promise<any> {
    const res = await fetchApiClient("/v1/shared/notification/list/user-setting")
    return res?.data || res || null
  },

  async updateUserSetting(payload: any): Promise<any> {
    return fetchApiClient("/v1/shared/notification/update/setting", {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  },
}
