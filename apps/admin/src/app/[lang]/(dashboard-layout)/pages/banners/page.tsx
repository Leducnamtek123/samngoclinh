import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { BannersManager } from "./_components/banners-manager"

export const metadata: Metadata = {
  title: "Quản lý Banners | Sâm Ngọc Linh Admin",
  description: "Cấu hình hình ảnh, tiêu đề, và nội dung giới thiệu các trang trong hệ thống",
}

interface Banner {
  id: string
  pageKey: string
  title: string
  subtitle: string
  image: string
  order: number
}

export default async function BannersPage() {
  let banners: Banner[] = []
  let errorMsg = ""

  try {
    const res = await fetchApi("/admin/banners")
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Failed to load banners"
    } else {
      banners = payload.data || []
    }
  } catch (e) {
    console.error("Error fetching banners on server:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <BannersManager initialBanners={banners} errorMsg={errorMsg} />
    </div>
  )
}
