import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export function useCatalogPlants(initialData?: any) {
  return useQuery({
    queryKey: ['catalog', 'plants'],
    queryFn: () => fetchApiClient('/public/catalog/plants').then((res) => res.data),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCatalogShopItems(initialData?: any) {
  return useQuery({
    queryKey: ['catalog', 'shop-items'],
    queryFn: () => fetchApiClient('/public/catalog/shop-items').then((res) => res.data),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}
