import { fetchApiClient } from '@/lib/ApiClient';

export type RawNotification = {
  id?: string;
  _id?: string;
  type?: string;
  title?: string;
  titleKey?: string;
  message?: string;
  body?: string;
  bodyKey?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  timestamp?: string;
  data?: Record<string, unknown>;
  orderPayload?: Record<string, unknown>;
  details?: Record<string, unknown>;
  [key: string]: unknown;
};

export type NotificationUserSetting = {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  orderUpdates?: boolean;
  promotions?: boolean;
  [key: string]: unknown;
};

export const notificationService = {
  async getList(): Promise<RawNotification[]> {
    const res = await fetchApiClient('/v1/shared/notification/list');
    return (res?.data || res || []) as RawNotification[];
  },

  async markAsRead(id: string): Promise<{ success: boolean; [key: string]: unknown }> {
    return await fetchApiClient(`/v1/shared/notification/update/read/${id}`, {
      method: 'PATCH',
    });
  },

  async markAllAsRead(): Promise<{ success: boolean; [key: string]: unknown }> {
    return await fetchApiClient('/v1/shared/notification/update/read-all', {
      method: 'POST',
    });
  },

  async getUserSetting(): Promise<NotificationUserSetting | null> {
    const res = await fetchApiClient('/v1/shared/notification/list/user-setting');
    return (res?.data || res || null) as NotificationUserSetting | null;
  },

  async updateUserSetting(
    payload: Partial<NotificationUserSetting>,
  ): Promise<{ success: boolean; [key: string]: unknown }> {
    return await fetchApiClient('/v1/shared/notification/update/setting', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
