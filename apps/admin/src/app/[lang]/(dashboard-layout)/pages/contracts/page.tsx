import { Suspense } from "react"

import type { Metadata } from "next"
import type { AdminUser, EContract, PaginationMeta, Tree } from "@/types"

import { fetchApi } from "@/lib/api"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { ContractsManager } from "./_components/contracts-manager"

export const metadata: Metadata = {
  title: "Quản lý hợp đồng | Sâm Ngọc Linh Admin",
  description: "Quản lý hợp đồng điện tử ký gửi sâm Ngọc Linh",
}

interface ContractsPageProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    page?: string
    perPage?: string
    search?: string
  }>
}

export default async function ContractsPage({
  searchParams,
}: ContractsPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""

  let contracts: EContract[] = []
  let users: AdminUser[] = []
  let trees: Tree[] = []
  let metadata: PaginationMeta | null = null
  let errorMsg = ""

  try {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page)
    queryParams.append("perPage", perPage)
    if (search) queryParams.append("search", search)

    const res = await fetchApi(`/user/e-contract?${queryParams.toString()}`)
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Không thể tải danh sách hợp đồng"
    } else {
      contracts = Array.isArray(payload.data) ? payload.data : []
      metadata = payload.metadata || null
    }

    const usersRes = await fetchApi("/admin/user?perPage=100")
    const usersPayload = await usersRes.json()
    if (usersRes.status < 400) {
      users = Array.isArray(usersPayload.data)
        ? usersPayload.data
        : usersPayload.data?.items || []
    }

    const treesRes = await fetchApi("/admin/cultivation/trees?perPage=100")
    const treesPayload = await treesRes.json()
    if (treesRes.status < 400) {
      trees = Array.isArray(treesPayload.data) ? treesPayload.data : []
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Không thể kết nối đến máy chủ API"
    console.error("Error fetching contracts page data:", e)
    errorMsg = message
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Suspense fallback={<TableSkeleton cols={5} rows={5} />}>
        <ContractsManager
          initialContracts={contracts as unknown as EContract[]}
          metadata={metadata}
          users={users}
          trees={trees}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
