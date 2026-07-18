export interface ICatalogPlantItem {
    id: string;
    code?: string;
    name: string;
    ageYear: number;
    price: number;
    stock: number;
    status: 'available' | 'sold_out' | 'coming_soon';
    images?: string[];
    description?: string;
}

export interface ICatalogShopItem {
    id: string;
    code?: string;
    name: string;
    price: number;
    unit: string;
    category: string;
    stock?: number;
    status?: string;
    images?: string[];
    description?: string;
}
