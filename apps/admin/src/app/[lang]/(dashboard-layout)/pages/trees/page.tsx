import { Suspense } from "react"
import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { TreesTable } from "./_components/trees-table"

export const metadata: Metadata = {
  title: "Quản lý cây trồng | Sâm Ngọc Linh Admin",
  description: "Theo dõi và quản lý các gốc cây sâm trồng thực tế trong vườn",
}

interface TreesPageProps {
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

export default async function TreesPage({ searchParams }: TreesPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""

  let trees: any[] = []
  let beds: any[] = []
  let metadata: any = null
  let errorMsg = ""

  try {
    // 1. Fetch paginated trees for admin
    const treeQueryParams = new URLSearchParams()
    treeQueryParams.append("page", page)
    treeQueryParams.append("perPage", perPage)
    if (search) treeQueryParams.append("search", search)
    if (status && status !== "all") treeQueryParams.append("status", status)

    const treesRes = await fetchApi(`/admin/cultivation/trees?${treeQueryParams.toString()}`)
    const treesPayload = await treesRes.json()
    if (treesRes.status >= 400) {
      errorMsg = treesPayload?.message || "Không thể tải danh sách cây trồng"
    } else {
      trees = Array.isArray(treesPayload.data) ? treesPayload.data : []
      metadata = treesPayload.metadata || null
    }

    // 2. Fetch all beds for dropdown selection (requesting a high perPage limit to get the full list)
    const bedsRes = await fetchApi("/user/cultivation/beds?perPage=100")
    const bedsPayload = await bedsRes.json()
    if (bedsRes.status < 400) {
      beds = Array.isArray(bedsPayload.data?.items)
        ? bedsPayload.data.items
        : bedsPayload.data || []
    }
  } catch (e) {
    console.error("Error fetching trees data on server:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Suspense fallback={<div className="text-center py-8">Đang tải danh sách cây trồng...</div>}>
        <TreesTable 
          initialTrees={trees} 
          beds={beds} 
          metadata={metadata} 
          errorMsg={errorMsg} 
        />
      </Suspense>
    </div>
  )
}
