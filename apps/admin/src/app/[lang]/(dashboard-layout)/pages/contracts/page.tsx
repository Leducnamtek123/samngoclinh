import { Suspense } from "react"

import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { ContractsManager } from "./_components/contracts-manager"

export const metadata: Metadata = {
  title: "Quản lý hợp đồng | Sâm Ngọc Linh Admin",
  description: "Quản lý hợp đồng điện tử ký gửi sâm Ngọc Linh",
}

interface Contract {
  id: string
  contractCode: string
  userId: string
  userEmail?: string
  treeId: string
  treeCode?: string
  contractValue: number
  paymentStatus: string
  status: string
  signedAt?: string
  expiredAt: string
  createdAt: string
}

import type { Tree, User } from "./_components/use-contracts-manager"

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

  let contracts: Contract[] = []
  let users: User[] = []
  let trees: Tree[] = []
  let metadata: any = null
  let errorMsg = ""

  try {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page)
    queryParams.append("perPage", perPage)
    if (search) queryParams.append("search", search)

    const res = await fetchApi(`/admin/contracts?${queryParams.toString()}`)
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Không thể tải danh sách hợp đồng"
    } else {
      contracts = Array.isArray(payload.data?.items)
        ? payload.data.items
        : payload.data || []
      metadata = payload.metadata || null
    }

    const usersRes = await fetchApi("/admin/user/list?page=1&perPage=500")
    const usersPayload = await usersRes.json()
    if (usersRes.status < 400) {
      users = Array.isArray(usersPayload.data) ? usersPayload.data : []
    }

    const treesRes = await fetchApi(
      "/admin/cultivation/trees?page=1&perPage=500"
    )
    const treesPayload = await treesRes.json()
    if (treesRes.status < 400) {
      trees = Array.isArray(treesPayload.data) ? treesPayload.data : []
    }
  } catch (e) {
    console.error("Error loading contracts page data:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Suspense fallback={<TableSkeleton cols={6} rows={5} />}>
        <ContractsManager
          initialContracts={contracts}
          users={users}
          trees={trees}
          metadata={metadata}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
