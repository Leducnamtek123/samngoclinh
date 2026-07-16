export interface ICartItemDetail {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    totalPrice: number;
    imageUrl?: string;
}

export interface ICartSummary {
    itemsCount: number;
    total: number;
    empty: boolean;
    items: ICartItemDetail[];
}
