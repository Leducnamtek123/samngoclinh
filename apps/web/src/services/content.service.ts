import { fetchApiClient } from '@/lib/ApiClient';
import type { Article, Banner, ShippingSetting } from '@/types/content';

export const contentService = {
  async getArticles(params?: Record<string, string>): Promise<Article[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    const res = await fetchApiClient(`/public/content/articles${query}`);
    return (res?.data || res || []) as Article[];
  },

  async getBanner(pageKey: string): Promise<Banner[]> {
    const res = await fetchApiClient(`/public/banners/${pageKey}`);
    return (res?.data || res || []) as Banner[];
  },
};

export const paymentService = {
  async verifySepayOrder(
    orderCode: string,
  ): Promise<{ code: string; status: string; total: number }> {
    const res = await fetchApiClient(
      `/public/payment/sepay/verify/${encodeURIComponent(orderCode)}`,
    );
    return res?.data || res;
  },
};

export const settingsService = {
  async getShippingFee(): Promise<ShippingSetting | null> {
    const res = await fetchApiClient('/v1/public/settings/shipping_fee');
    return (res?.data || res || null) as ShippingSetting | null;
  },
};
