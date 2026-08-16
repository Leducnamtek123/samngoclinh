import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';
import type { GinsengPlantItem, ProductItem } from '@/types';

export function useCatalogPlants(initialData?: GinsengPlantItem[]) {
  return useQuery<GinsengPlantItem[]>({
    queryKey: ['catalog', 'plants'],
    queryFn: () =>
      fetchApiClient('/public/catalog/plants')
        .then((res) => res?.data || [])
        .catch(() => []),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCatalogPlant(id: string, initialData?: GinsengPlantItem) {
  return useQuery<GinsengPlantItem | null>({
    queryKey: ['catalog', 'plants', id],
    queryFn: () =>
      fetchApiClient(`/public/catalog/plants/${id}`)
        .then((res) => (res?.data !== undefined ? res.data : null))
        .catch(() => null),
    initialData,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCatalogShopItems(initialData?: ProductItem[]) {
  return useQuery<ProductItem[]>({
    queryKey: ['catalog', 'shop-items'],
    queryFn: () =>
      fetchApiClient('/public/catalog/shop-items')
        .then((res) => res?.data || [])
        .catch(() => []),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCatalogShopItem(id: string, initialData?: ProductItem) {
  return useQuery<ProductItem | null>({
    queryKey: ['catalog', 'shop-items', id],
    queryFn: () =>
      fetchApiClient(`/public/catalog/shop-items/${id}`)
        .then((res) => (res?.data !== undefined ? res.data : null))
        .catch(() => null),
    initialData,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

