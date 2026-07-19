import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { PlantsTable } from "./_components/plants-table"

export const metadata: Metadata = {
  title: "Quản lý Sản phẩm | Sâm Ngọc Linh Admin",
  description: "Danh sách sản phẩm vườn sâm trong hệ thống Sâm Ngọc Linh",
}

interface Plant {
  id: string
  code?: string
  name: string
  ageYear: number
  price: number
  stock: number
  status: string
  images?: string[]
  description?: string
}

interface ProductsPageProps {
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

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""

  let plants: Plant[] = []
  let metadata: any = null
  let errorMsg = ""

  try {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page)
    queryParams.append("perPage", perPage)
    if (search) queryParams.append("search", search)
    if (status && status !== "all") queryParams.append("status", status)

    const res = await fetchApi(`/public/catalog/plants?${queryParams.toString()}`)
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Failed to load plants"
    } else {
      plants = Array.isArray(payload.data) ? payload.data : (payload.data?.items || [])
      metadata = payload.metadata || null
    }
  } catch (e) {
    console.error("Error fetching plants on server:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <PlantsTable 
        initialPlants={plants} 
        metadata={metadata}
        errorMsg={errorMsg} 
      />
    </div>
  )
}
