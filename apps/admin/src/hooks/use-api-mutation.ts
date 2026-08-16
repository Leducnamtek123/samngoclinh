import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ApiResponse } from "@/lib/api-client"
import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query"

import { deleteApiData, postApiData, putApiData } from "@/lib/api-client"

export type MutationMethod = "POST" | "PUT" | "DELETE"

interface MutationVariables<D = any> {
  endpoint: string
  data?: D
  method?: MutationMethod
}

export interface ApiMutationOptions<T = any, D = any>
  extends UseMutationOptions<ApiResponse<T>, Error, MutationVariables<D>> {
  invalidateQueries?: string[]
}

export function useApiMutation<T = any, D = any>(
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
        queryClient.invalidateQueries({ queryKey: options.invalidateQueries })
      } else {
        queryClient.invalidateQueries()
      }
      if (options?.onSuccess) {
        ;(options.onSuccess as any)(data, variables, context)
      }
    },
  })
}
