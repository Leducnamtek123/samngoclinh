export interface IWalletSummary {
    balancePoint: number;
    treesOwned: number;
    transactions: number;
}

export interface IWalletTransactionItem {
    id: string;
    code: string;
    type: string;
    title: string;
    amount: number;
    balanceAfter: number | null;
    status: string;
    occurredAt: Date;
}
