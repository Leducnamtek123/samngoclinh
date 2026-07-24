export interface IPaymentQrInfo {
    qrUrl: string;
    accountNumber?: string;
    accountName?: string;
    bankBrand?: string;
    amount: number;
    orderCode: string;
    redirectUrl?: string;
}

export interface IPaymentGatewayProvider {
    readonly name: string;
    getPaymentInfo(orderCode: string, amount: number): Promise<IPaymentQrInfo>;
    verifyWebhookAuth?(authHeader?: string, payload?: unknown): boolean;
}
