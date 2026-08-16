import { useMutation } from "@tanstack/react-query"

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

export function useApiMutation<T = any, D = any>(
  options?: UseMutationOptions<ApiResponse<T>, Error, MutationVariables<D>>
): UseMutationResult<ApiResponse<T>, Error, MutationVariables<D>> {
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
  })
}
