import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';

export function useNotificationsList(enabled = true) {
  return useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: async () => await notificationService.getList(),
    enabled,
    staleTime: 1000 * 30, // 30s
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => await notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useNotificationSettings(enabled = true) {
  return useQuery({
    queryKey: ['notifications', 'settings'],
    queryFn: async () => await notificationService.getUserSetting(),
    enabled,
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Parameters<typeof notificationService.updateUserSetting>[0]) =>
      await notificationService.updateUserSetting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'settings'] });
    },
  });
}
