import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { BedsTable } from "./_components/beds-table"

export const metadata: Metadata = {
  title: "Luống | Sâm Ngọc Linh Admin",
  description: "Quản lý danh sách các luống trồng sâm trong vườn",
}

interface Bed {
  id: string
  code: string
  gardenCode: string
  name: string
  ageYear: number
  treeCount: number
  status: string
  createdAt: string
  maxTrees?: number
  width?: number
  length?: number
  soilType?: string
  lastFertilizedAt?: string
  lastWateredAt?: string
  description?: string
}

interface BedsPageProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    page?: string
    perPage?: string
    search?: string
    status?: string
    gardenCode?: string
  }>
}

export default async function BedsPage({ searchParams }: BedsPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""
  const gardenCode = resolvedSearchParams.gardenCode || ""

  let beds: Bed[] = []
  let metadata: any = null
  let gardens: any[] = []
  let errorMsg = ""

  try {
    // Build query params
    const queryParams = new URLSearchParams()
    queryParams.append("page", page)
    queryParams.append("perPage", perPage)
    if (search) queryParams.append("search", search)
    if (status && status !== "all") queryParams.append("status", status)
    if (gardenCode && gardenCode !== "all") queryParams.append("gardenCode", gardenCode)

    // Fetch beds
    const bedsRes = await fetchApi(`/user/cultivation/beds?${queryParams.toString()}`)
    const bedsPayload = await bedsRes.json()
    if (bedsRes.status >= 400) {
      errorMsg = bedsPayload?.message || "Không thể tải danh sách luống sâm"
    } else {
      beds = Array.isArray(bedsPayload.data) ? bedsPayload.data : []
      metadata = bedsPayload.metadata || null
    }

    // Fetch gardens
    const gardensRes = await fetchApi("/user/cultivation/gardens/list")
    const gardensPayload = await gardensRes.json()
    if (gardensRes.status < 400) {
      gardens = Array.isArray(gardensPayload.data) ? gardensPayload.data : []
    }
  } catch (e) {
    console.error("Error fetching cultivation data:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="w-full p-4 md:p-6">
      <BedsTable 
        initialBeds={beds} 
        metadata={metadata}
        gardens={gardens} 
        errorMsg={errorMsg} 
      />
    </div>
  )
}
