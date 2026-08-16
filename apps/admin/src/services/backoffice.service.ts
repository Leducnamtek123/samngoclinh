import { fetchApiJson } from "@/lib/api"
import type { ApiResponse, BackofficeOverview } from "@/types"

export const backofficeService = {
  async getOverview(): Promise<ApiResponse<BackofficeOverview>> {
    return fetchApiJson<BackofficeOverview>("/admin/backoffice/overview", {
      cache: "no-store",
    })
  },
}
