import type { ApiResponse, BackofficeOverview } from "@/types"

import { fetchApiJson } from "@/lib/api"

export const backofficeService = {
  async getOverview(): Promise<ApiResponse<BackofficeOverview>> {
    return fetchApiJson<BackofficeOverview>("/admin/backoffice/overview", {
      cache: "no-store",
    })
  },
}
