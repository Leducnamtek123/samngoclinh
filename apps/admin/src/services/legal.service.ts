import { fetchApiJson } from "@/lib/api"
import type {
  ApiResponse,
  ContactRequest,
  ContractTemplate,
  EContract,
  KycRequest,
} from "@/types"

export interface LegalPaginationParams {
  page?: number | string
  perPage?: number | string
  search?: string
  status?: string
}

export const legalService = {
  // eKYC
  async getKycList(params?: LegalPaginationParams): Promise<ApiResponse<KycRequest[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)
    if (params?.status && params.status !== "all") query.append("status", params.status)

    return fetchApiJson<KycRequest[]>(`/admin/user/kyc-list?${query.toString()}`)
  },

  async approveKyc(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return fetchApiJson<{ success: boolean }>(`/admin/user/kyc/${id}/approve`, {
      method: "POST",
    })
  },

  async rejectKyc(id: string, reason: string): Promise<ApiResponse<{ success: boolean }>> {
    return fetchApiJson<{ success: boolean }>(`/admin/user/kyc/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  },

  // e-Contracts
  async getContracts(params?: LegalPaginationParams): Promise<ApiResponse<EContract[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)
    if (params?.status && params.status !== "all") query.append("status", params.status)

    return fetchApiJson<EContract[]>(`/user/e-contract?${query.toString()}`)
  },

  async getContractTemplates(): Promise<ApiResponse<ContractTemplate[]>> {
    return fetchApiJson<ContractTemplate[]>("/user/e-contract/templates")
  },

  // Contacts
  async getContacts(params?: LegalPaginationParams): Promise<ApiResponse<ContactRequest[]>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", String(params.page))
    if (params?.perPage) query.append("perPage", String(params.perPage))
    if (params?.search) query.append("search", params.search)
    if (params?.status && params.status !== "all") query.append("status", params.status)

    return fetchApiJson<ContactRequest[]>(`/admin/contacts?${query.toString()}`)
  },
}
