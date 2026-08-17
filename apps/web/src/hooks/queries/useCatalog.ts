import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalog.service';
import type { GinsengPlantItem, ProductItem } from '@/types';

export function useCatalogPlants(initialData?: GinsengPlantItem[]) {
  return useQuery<GinsengPlantItem[]>({
    queryKey: ['catalog', 'plants'],
    queryFn: async () => await catalogService.getPlants(),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCatalogPlant(id: string, initialData?: GinsengPlantItem | null) {
  return useQuery<GinsengPlantItem | null>({
    queryKey: ['catalog', 'plants', id],
    queryFn: async () => await catalogService.getPlant(id),
    initialData,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCatalogShopItems(initialData?: ProductItem[]) {
  return useQuery<ProductItem[]>({
    queryKey: ['catalog', 'shop-items'],
    queryFn: async () => await catalogService.getShopItems(),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCatalogShopItem(id: string, initialData?: ProductItem | null) {
  return useQuery<ProductItem | null>({
    queryKey: ['catalog', 'shop-items', id],
    queryFn: async () => await catalogService.getShopItem(id),
    initialData,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
