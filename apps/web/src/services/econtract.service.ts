import { fetchApiClient } from "@/lib/ApiClient"
import type { EContractData } from "@/types"

export const econtractService = {
  async getMyContracts(): Promise<EContractData[]> {
    const res = await fetchApiClient("/user/contracts")
    return res?.data || res || []
  },

  async getContract(id: string): Promise<EContractData | null> {
    const res = await fetchApiClient(`/user/contracts/${id}`)
    return res?.data !== undefined ? res.data : res || null
  },

  async signContract(id: string, signatureData: string, otpCode?: string): Promise<any> {
    return fetchApiClient(`/user/contracts/${id}/sign`, {
      method: "POST",
      body: JSON.stringify({ signatureData, otpCode }),
    })
  },

  async renewContract(id: string, durationMonths: number): Promise<any> {
    return fetchApiClient(`/user/contracts/${id}/renew`, {
      method: "POST",
      body: JSON.stringify({ durationMonths }),
    })
  },

  async getTemplate(slug: string): Promise<string> {
    const res = await fetch(`/api/proxy/public/contracts/templates/${encodeURIComponent(slug)}`)
    if (!res.ok) {
      throw new Error(`Failed to load template ${slug}`)
    }
    const json = await res.json()
    return json?.data?.contentHtml || ""
  },

  async verifyContract(code: string): Promise<any> {
    const res = await fetchApiClient(`/public/contracts/verify/${encodeURIComponent(code)}`)
    return res?.data || res
  },
}
