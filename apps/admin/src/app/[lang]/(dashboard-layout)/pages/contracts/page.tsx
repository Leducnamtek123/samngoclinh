import { Suspense } from "react"
import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
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
    status?: string
  }>
}

export default async function ContractsPage({ searchParams }: ContractsPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""

  let contracts: any[] = []
  let users: any[] = []
  let trees: any[] = []
  let metadata: any = null
  let errorMsg = ""

  try {
    // 1. Fetch paginated contracts
    const contractQueryParams = new URLSearchParams()
    contractQueryParams.append("page", page)
    contractQueryParams.append("perPage", perPage)
    if (search) contractQueryParams.append("search", search)
    if (status && status !== "all") contractQueryParams.append("status", status)

    const contractsRes = await fetchApi(`/admin/contracts?${contractQueryParams.toString()}`)
    const contractsPayload = await contractsRes.json()
    if (contractsRes.status >= 400) {
      errorMsg = contractsPayload?.message || "Không thể tải danh sách hợp đồng"
    } else {
      contracts = Array.isArray(contractsPayload.data) ? contractsPayload.data : []
      metadata = contractsPayload.metadata || null
    }

    // 2. Fetch users for dropdown (limit 100 to show complete selection list)
    const usersRes = await fetchApi("/admin/user/list?perPage=100")
    const usersPayload = await usersRes.json()
    if (usersRes.status < 400) {
      users = Array.isArray(usersPayload.data)
        ? usersPayload.data
        : usersPayload.data?.data || []
    }

    // 3. Fetch trees for dropdown
    const treesRes = await fetchApi("/user/cultivation/trees/admin-list")
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
      <Suspense fallback={<div className="text-center py-8">Đang tải danh sách hợp đồng...</div>}>
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
