import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { ShopItemsTable } from "./_components/shop-items-table"

export const metadata: Metadata = {
  title: "Sản phẩm Thương mại | Sâm Ngọc Linh Admin",
  description: "Quản lý sản phẩm chế biến và vật tư trong hệ thống Sâm Ngọc Linh",
}

interface ShopItem {
  id: string
  code: string
  name: string
  price: number
  unit: string
  category: string
  stock?: number
  status?: string
  images?: string[]
  description?: string
}

export default async function CategoryPage() {
  let shopItems: ShopItem[] = []
  let errorMsg = ""

  try {
    const res = await fetchApi("/public/catalog/shop-items")
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Failed to load shop items"
    } else {
      shopItems = payload.data?.items || []
    }
  } catch (e) {
    console.error("Error fetching shop items:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <ShopItemsTable initialItems={shopItems} errorMsg={errorMsg} />
    </div>
  )
}
