import { fetchApiClient } from '@/lib/ApiClient';
import type { GinsengPlantItem, ProductItem } from '@/types';

export const catalogService = {
  async getPlants(): Promise<GinsengPlantItem[]> {
    const res = await fetchApiClient('/public/catalog/plants');
    return res?.data || res || [];
  },

  async getPlant(id: string): Promise<GinsengPlantItem | null> {
    const res = await fetchApiClient(`/public/catalog/plants/${id}`);
    return res?.data === undefined ? res || null : res.data;
  },

  async getShopItems(): Promise<ProductItem[]> {
    const res = await fetchApiClient('/public/catalog/shop-items');
    return res?.data || res || [];
  },

  async getShopItem(id: string): Promise<ProductItem | null> {
    const res = await fetchApiClient(`/public/catalog/shop-items/${id}`);
    return res?.data === undefined ? res || null : res.data;
  },
};
