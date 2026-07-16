export interface ICatalogPlantItem {
    id: string;
    name: string;
    ageYear: number;
    price: number;
    stock: number;
    status: 'available' | 'sold_out' | 'coming_soon';
}

export interface ICatalogShopItem {
    id: string;
    name: string;
    price: number;
    unit: string;
    category: string;
}
