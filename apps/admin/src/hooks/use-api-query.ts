import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { fetchApiData } from '@/lib/api-client';

export interface ApiResponse<T = any> {
  statusCode?: number;
  message?: string;
  data: T;
  metadata?: {
    page?: number;
    perPage?: number;
    totalPage?: number;
    totalData?: number;
    [key: string]: any;
  };
}

export function useApiQuery<T = any>(
  key: string | readonly unknown[],
  endpoint: string,
  options?: Omit<UseQueryOptions<ApiResponse<T>, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<ApiResponse<T>, Error> {
  const queryKey = Array.isArray(key) ? key : [key];
  
  return useQuery<ApiResponse<T>, Error>({
    queryKey,
    queryFn: () => fetchApiData<ApiResponse<T>>(endpoint),
    ...options,
  });
}
