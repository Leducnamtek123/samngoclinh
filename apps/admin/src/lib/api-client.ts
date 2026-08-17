import type { ApiResponse } from "@/types/common.types"

import {
  deleteApiData,
  fetchApi,
  fetchApiData,
  fetchApiJson,
  postApiData,
  putApiData,
} from "./api"

export type { ApiResponse }

export {
  fetchApi,
  fetchApiJson,
  fetchApiData,
  postApiData,
  putApiData,
  deleteApiData,
}
