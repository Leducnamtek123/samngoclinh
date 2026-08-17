import type { Metadata } from "next"

import { contentService } from "@/services/content.service"

import { BannersManager } from "./_components/banners-manager"

export const metadata: Metadata = {
  title: "Quản lý Banners | Sâm Ngọc Linh Admin",
  description:
    "Cấu hình hình ảnh, tiêu đề, và nội dung giới thiệu các trang trong hệ thống",
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
    const payload = await contentService.getBanners()
    banners = (payload.data as any)?.items || (Array.isArray(payload.data) ? payload.data : [])
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Không thể kết nối đến máy chủ API"
    console.error("Error fetching banners on server:", e)
    errorMsg = message
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <BannersManager initialBanners={banners} errorMsg={errorMsg} />
    </div>
  )
}
