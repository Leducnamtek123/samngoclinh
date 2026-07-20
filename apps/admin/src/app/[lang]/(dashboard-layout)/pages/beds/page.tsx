import { Suspense } from "react"
import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { BedsTable } from "./_components/beds-table"
import { BedsSkeleton } from "@/components/ui/loading-skeletons"

export const metadata: Metadata = {
  title: "Luống | Sâm Ngọc Linh Admin",
  description: "Quản lý danh sách các luống trồng sâm trong vườn",
}

interface Bed {
  id: string
  code: string
  gardenCode: string
  name: string
  status: string
  soilType?: string
  width?: number
  length?: number
  maxTrees?: number
  treeCount: number
  activeTrees?: number
  lastWateredAt?: string
  lastFertilizedAt?: string
  ageYear: number
  description?: string
  createdAt?: string
}

interface Garden {
  id: string
  code: string
  name: string
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
  const perPage = resolvedSearchParams.perPage || "20"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""
  const gardenCode = resolvedSearchParams.gardenCode || ""

  let beds: Bed[] = []
  let metadata: any = null
  let gardens: Garden[] = []
  let errorMsg = ""

  try {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page)
    queryParams.append("perPage", perPage)
    if (search) queryParams.append("search", search)
    if (status && status !== "all") queryParams.append("status", status)
    if (gardenCode && gardenCode !== "all") queryParams.append("gardenCode", gardenCode)

    const res = await fetchApi(`/user/cultivation/beds?${queryParams.toString()}`)
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Failed to load beds"
    } else {
      beds = Array.isArray(payload.data?.items) ? payload.data.items : (payload.data || [])
      metadata = payload.metadata || null
    }

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
      <Suspense fallback={<BedsSkeleton />}>
        <BedsTable 
          initialBeds={beds} 
          metadata={metadata}
          gardens={gardens}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
