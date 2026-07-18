import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { PlantsTable } from "./_components/plants-table"

export const metadata: Metadata = {
  title: "Quản lý Sản phẩm | Sâm Ngọc Linh Admin",
  description: "Danh sách sản phẩm vườn sâm trong hệ thống Sâm Ngọc Linh",
}

interface Plant {
  id: string
  name: string
  ageYear: number
  price: number
  stock: number
  status: string
}

export default async function ProductsPage() {
  let plants: Plant[] = []
  let errorMsg = ""

  try {
    const res = await fetchApi("/public/catalog/plants")
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Failed to load plants"
    } else {
      plants = payload.data?.items || []
    }
  } catch (e) {
    console.error("Error fetching plants on server:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <PlantsTable initialPlants={plants} errorMsg={errorMsg} />
    </div>
  )
}
