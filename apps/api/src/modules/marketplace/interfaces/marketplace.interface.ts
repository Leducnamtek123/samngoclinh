export interface IMarketplaceListingItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    ownerType: 'provider' | 'customer';
}
