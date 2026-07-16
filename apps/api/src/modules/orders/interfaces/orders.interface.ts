export interface IOrderSummaryItem {
    id: string;
    code: string;
    status: string;
    total: number;
    createdAt: Date;
}

export interface IOrderDetail {
    id: string;
    code: string;
    status: string;
    currency: string;
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
    paymentMethod: string | null;
    items: unknown;
    paidAt: Date | null;
    cancelledAt: Date | null;
    createdAt: Date;
}
