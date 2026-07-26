import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export type CreateListingPayload = {
  treeId: string;
  title: string;
  price: number;
  payments?: string[];
  note?: string;
};

// Fetch user's own listings
export function useMyListings(enabled: boolean = true) {
  return useQuery({
    queryKey: ['marketplace', 'me'],
    queryFn: () => fetchApiClient('/user/marketplace/me').then((res) => res.data?.items || []),
    enabled,
    staleTime: 30 * 1000,
  });
}

// Create new sell listing
export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateListingPayload) => {
      const res = await fetchApiClient('/user/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(res.message || 'Đăng bán cây thất bại');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
      queryClient.invalidateQueries({ queryKey: ['cultivation', 'trees'] });
    },
  });
}

// Delete/Cancel user's own listing
export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchApiClient(`/user/marketplace/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(res.message || 'Hủy lệnh bán thất bại');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
    },
  });
}

// Buy listing mutation (create order for P2P listing)
export function useBuyListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: string) => {
      const res = await fetchApiClient('/user/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          type: 'MARKETPLACE_BUY',
        }),
      });
      if (!res.ok) {
        throw new Error(res.message || 'Chốt mua cây thất bại');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
}
