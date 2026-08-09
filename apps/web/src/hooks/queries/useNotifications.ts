import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

export function useNotificationsList(enabled = true) {
  return useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: async () => {
      try {
        const res = await fetchApiClient('/v1/shared/notification/list');
        return res?.data || res || [];
      } catch (e) {
        console.warn('Failed to fetch notifications from API:', e);
        return [];
      }
    },
    enabled,
    staleTime: 1000 * 30, // 30s
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return fetchApiClient(`/v1/shared/notification/update/read/${id}`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return fetchApiClient('/v1/shared/notification/update/read-all', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useNotificationSettings(enabled = true) {
  return useQuery({
    queryKey: ['notifications', 'settings'],
    queryFn: async () => {
      try {
        const res = await fetchApiClient('/v1/shared/notification/list/user-setting');
        return res?.data || res || null;
      } catch (e) {
        console.warn('Failed to fetch notification settings:', e);
        return null;
      }
    },
    enabled,
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return fetchApiClient('/v1/shared/notification/update/setting', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'settings'] });
    },
  });
}
