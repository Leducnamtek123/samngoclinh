import { useQuery } from '@tanstack/react-query';
import { cultivationService } from '@/services/cultivation.service';
import type { CultivationBed, CultivationTree } from '@/types';

export function useCultivationTrees(initialData?: CultivationTree[], enabled: boolean = true) {
  return useQuery<CultivationTree[]>({
    queryKey: ['cultivation', 'trees'],
    queryFn: () => cultivationService.getMyTrees(),
    initialData,
    enabled,
    retry: false,
  });
}

export function usePublicCultivationBeds(ageYear?: number | string, initialData?: CultivationBed[]) {
  return useQuery<CultivationBed[]>({
    queryKey: ['public-cultivation-beds', ageYear],
    queryFn: () => cultivationService.getPublicBeds(ageYear !== undefined && ageYear !== null ? String(ageYear) : undefined),
    initialData,
  });
}


