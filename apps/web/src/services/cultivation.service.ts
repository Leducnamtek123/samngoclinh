import { fetchApiClient } from '@/lib/ApiClient';
import type { CultivationBed, CultivationTree } from '@/types';

export type CarePackage = {
  id: string;
  name: string;
  price: number;
  description?: string;
  durationMonths?: number;
  [key: string]: unknown;
};

export type ProtectionPackage = {
  id: string;
  name: string;
  price: number;
  description?: string;
  durationMonths?: number;
  [key: string]: unknown;
};

export const cultivationService = {
  async getMyTrees(): Promise<CultivationTree[]> {
    const res = await fetchApiClient('/user/cultivation/trees');
    return (res?.data || res || []) as CultivationTree[];
  },

  async getPublicBeds(query?: string): Promise<CultivationBed[]> {
    const queryStr = query ? `?garden=${encodeURIComponent(query)}` : '';
    const res = await fetchApiClient(`/public/cultivation/beds${queryStr}`);
    return (res?.data || res || []) as CultivationBed[];
  },

  async getCarePackages(): Promise<CarePackage[]> {
    const res = await fetchApiClient('/user/packages/care');
    const items = res?.data?.items || res?.data || res?.items || res || [];
    return Array.isArray(items) ? (items as CarePackage[]) : [];
  },

  async getProtectionPackages(): Promise<ProtectionPackage[]> {
    const res = await fetchApiClient('/user/packages/protection');
    const items = res?.data?.items || res?.data || res?.items || res || [];
    return Array.isArray(items) ? (items as ProtectionPackage[]) : [];
  },

  async subscribePackage(payload: {
    treeId: string;
    packageType: 'care' | 'protection';
    packageId: string;
    months: number;
  }): Promise<{ success: boolean; [key: string]: unknown }> {
    return await fetchApiClient('/user/packages/subscribe', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
