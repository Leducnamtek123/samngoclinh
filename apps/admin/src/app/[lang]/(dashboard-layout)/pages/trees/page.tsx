import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { TreesTable } from "./_components/trees-table"

export const metadata: Metadata = {
  title: "Quản lý cây trồng | Sâm Ngọc Linh Admin",
  description: "Theo dõi và quản lý các gốc cây sâm trồng thực tế trong vườn",
}

export default async function TreesPage() {
  let trees: any[] = []
  let beds: any[] = []
  let errorMsg = ""

  try {
    // 1. Fetch all trees for admin
    const treesRes = await fetchApi("/user/cultivation/trees/admin-list")
    const treesPayload = await treesRes.json()
    if (treesRes.status >= 400) {
      errorMsg = treesPayload?.message || "Không thể tải danh sách cây trồng"
    } else {
      trees = Array.isArray(treesPayload.data) ? treesPayload.data : []
    }

    // 2. Fetch all beds for dropdown selection
    const bedsRes = await fetchApi("/user/cultivation/beds")
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
      <TreesTable initialTrees={trees} beds={beds} errorMsg={errorMsg} />
    </div>
  )
}
