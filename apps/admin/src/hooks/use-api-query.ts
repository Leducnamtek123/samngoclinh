import { useQuery } from "@tanstack/react-query"

import type { ApiResponse } from "@/types/common.types"
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query"

import { fetchApiData } from "@/lib/api"

export type { ApiResponse }

export function useApiQuery<T = unknown>(
  key: string | readonly unknown[],
  endpoint: string,
  options?: Omit<UseQueryOptions<ApiResponse<T>, Error>, "queryKey" | "queryFn">
): UseQueryResult<ApiResponse<T>, Error> {
  const queryKey = Array.isArray(key) ? key : [key]

  return useQuery<ApiResponse<T>, Error>({
    queryKey,
    queryFn: () => fetchApiData<ApiResponse<T>>(endpoint),
    ...options,
  })
}
