import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export function useCatalogPlants() {
  return useQuery({
    queryKey: ['catalog', 'plants'],
    queryFn: () => fetchApiClient('/public/catalog/plants').then((res) => res.data?.items || []),
  });
}

export function useCatalogShopItems() {
  return useQuery({
    queryKey: ['catalog', 'shop-items'],
    queryFn: () => fetchApiClient('/public/catalog/shop-items').then((res) => res.data?.items || []),
  });
}
