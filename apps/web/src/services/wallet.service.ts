import { fetchApiClient } from '@/lib/ApiClient';

export type WalletSummary = {
  balance: number;
  points: number;
  frozenBalance: number;
  totalDeposited: number;
  totalWithdrawn: number;
};

export type WalletTransaction = {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | string;
  status: 'pending' | 'completed' | 'failed' | string;
  description?: string;
  createdAt: string;
  [key: string]: unknown;
};

export const walletService = {
  async getSummary(): Promise<WalletSummary | null> {
    const res = await fetchApiClient('/user/wallet/summary');
    return res?.data === undefined ? res || null : res.data;
  },

  async getTransactions(): Promise<WalletTransaction[]> {
    const res = await fetchApiClient('/user/wallet/transactions');
    const list = res?.data?.items || res?.data || res || [];
    return Array.isArray(list) ? (list as WalletTransaction[]) : [];
  },
};
