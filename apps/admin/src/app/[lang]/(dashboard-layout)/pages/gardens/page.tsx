import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { GardensTable } from "./_components/gardens-table"

export const metadata: Metadata = {
  title: "Quản lý khu vườn | Sâm Ngọc Linh Admin",
  description: "Quản lý danh sách các khu vườn trồng sâm",
}

interface Garden {
  id: string
  code: string
  name: string
  status: string
  totalBeds: number
  activeBeds: number
  totalTrees: number
  createdAt: string
  metadata?: any
}

export default async function GardensPage() {
  let gardens: Garden[] = []
  let errorMsg = ""

  try {
    const res = await fetchApi("/user/cultivation/gardens/list")
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Không thể tải danh sách vườn"
    } else {
      gardens = Array.isArray(payload.data) ? payload.data : []
    }
  } catch (e) {
    console.error("Error fetching gardens:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <GardensTable initialGardens={gardens} errorMsg={errorMsg} />
    </div>
  )
}
