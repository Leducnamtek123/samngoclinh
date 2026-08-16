import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ApiResponse } from "@/types/common.types"
import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query"

import { deleteApiData, postApiData, putApiData } from "@/lib/api-client"

export type MutationMethod = "POST" | "PUT" | "DELETE"

interface MutationVariables<D = unknown> {
  endpoint: string
  data?: D
  method?: MutationMethod
}

export interface ApiMutationOptions<T = unknown, D = unknown>
  extends UseMutationOptions<ApiResponse<T>, Error, MutationVariables<D>> {
  invalidateQueries?: (string | readonly unknown[])[]
}

export function useApiMutation<T = unknown, D = unknown>(
  options?: ApiMutationOptions<T, D>
): UseMutationResult<ApiResponse<T>, Error, MutationVariables<D>> {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<T>, Error, MutationVariables<D>>({
    mutationFn: async ({ endpoint, data, method = "POST" }) => {
      if (method === "PUT") {
        return await putApiData<ApiResponse<T>, D>(endpoint, data)
      }
      if (method === "DELETE") {
        return await deleteApiData<ApiResponse<T>>(endpoint)
      }
      return await postApiData<ApiResponse<T>, D>(endpoint, data)
    },
    ...options,
    onSuccess: (data, variables, context) => {
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((key) => {
          const queryKey = Array.isArray(key) ? key : [key]
          queryClient.invalidateQueries({ queryKey })
        })
      } else {
        queryClient.invalidateQueries()
      }
      if (options?.onSuccess) {
        // @ts-expect-error tanstack query v5 callback overload
        options.onSuccess(data, variables, context)
      }
    },
  })
}
