import { fetchApiClient } from "@/lib/ApiClient"

export interface WalletSummary {
  balance: number
  points: number
  frozenBalance: number
  totalDeposited: number
  totalWithdrawn: number
}

export const walletService = {
  async getSummary(): Promise<WalletSummary | null> {
    const res = await fetchApiClient("/user/wallet/summary")
    return res?.data !== undefined ? res.data : res || null
  },

  async getTransactions(): Promise<any[]> {
    const res = await fetchApiClient("/user/wallet/transactions")
    return res?.data?.items || res?.data || res || []
  },
}
