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

    return fetchApiJson<EContract[]>(`/admin/contracts?${query.toString()}`)
  },

  async getContractDetail(id: string): Promise<ApiResponse<EContract>> {
    return fetchApiJson<EContract>(`/admin/contracts/${encodeURIComponent(id)}`)
  },

  async createContract(data: Partial<EContract>): Promise<ApiResponse<EContract>> {
    return fetchApiJson<EContract>("/admin/contracts", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateContract(id: string, data: Partial<EContract>): Promise<ApiResponse<EContract>> {
    return fetchApiJson<EContract>(`/admin/contracts/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async issueContract(id: string): Promise<ApiResponse<EContract>> {
    return fetchApiJson<EContract>(`/admin/contracts/${encodeURIComponent(id)}/issue`, {
      method: "POST",
    })
  },

  async deleteContract(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return fetchApiJson<{ success: boolean }>(`/admin/contracts/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
  },

  async getAmendments(id: string): Promise<ApiResponse<any[]>> {
    return fetchApiJson<any[]>(`/admin/contracts/${encodeURIComponent(id)}/amendments`)
  },

  async createAmendment(id: string, data: any): Promise<ApiResponse<any>> {
    return fetchApiJson<any>(`/admin/contracts/${encodeURIComponent(id)}/amendments`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Templates
  async getContractTemplates(): Promise<ApiResponse<ContractTemplate[]>> {
    return fetchApiJson<ContractTemplate[]>("/admin/contracts/templates")
  },

  async getTemplate(slug: string): Promise<ApiResponse<ContractTemplate>> {
    return fetchApiJson<ContractTemplate>(`/admin/contracts/templates/${encodeURIComponent(slug)}`)
  },

  async updateTemplate(slug: string, data: { title?: string; version?: string; description?: string; contentHtml: string }): Promise<ApiResponse<ContractTemplate>> {
    return fetchApiJson<ContractTemplate>(`/admin/contracts/templates/${encodeURIComponent(slug)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
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

  async deleteContact(id: string): Promise<ApiResponse<void>> {
    return fetchApiJson<void>(`/admin/contacts/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
  },
}
