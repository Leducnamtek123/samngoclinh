import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { BedsTable } from "./_components/beds-table"

export const metadata: Metadata = {
  title: "Luống của tôi | Sâm Ngọc Linh Admin",
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
}

export default async function BedsPage() {
  let beds: Bed[] = []
  let gardens: any[] = []
  let errorMsg = ""

  try {
    // Fetch beds
    const bedsRes = await fetchApi("/user/cultivation/beds")
    const bedsPayload = await bedsRes.json()
    if (bedsRes.status >= 400) {
      errorMsg = bedsPayload?.message || "Không thể tải danh sách luống sâm"
    } else {
      beds = Array.isArray(bedsPayload.data?.items) ? bedsPayload.data.items : (bedsPayload.data || [])
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
    <div className="container mx-auto p-4 md:p-6">
      <BedsTable initialBeds={beds} gardens={gardens} errorMsg={errorMsg} />
    </div>
  )
}
