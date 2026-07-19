import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { PackagesManager } from "./_components/packages-manager"

export const metadata: Metadata = {
  title: "Cấu hình gói dịch vụ | Sâm Ngọc Linh Admin",
  description: "Quản lý gói chăm sóc định kỳ và bảo vệ cây sâm giống",
}

export default async function PackagesPage() {
  let carePackages: any[] = []
  let protectionPackages: any[] = []
  let errorMsg = ""

  try {
    // 1. Fetch Care Packages
    const careRes = await fetchApi("/admin/packages/care")
    const carePayload = await careRes.json()
    if (careRes.status >= 400) {
      errorMsg = carePayload?.message || "Không thể tải danh sách gói chăm sóc"
    } else {
      carePackages = carePayload.data?.items || []
    }

    // 2. Fetch Protection Packages
    const protRes = await fetchApi("/admin/packages/protection")
    const protPayload = await protRes.json()
    if (protRes.status < 400) {
      protectionPackages = protPayload.data?.items || []
    }
  } catch (e) {
    console.error("Error fetching packages:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PackagesManager
        initialCarePackages={carePackages}
        initialProtectionPackages={protectionPackages}
        errorMsg={errorMsg}
      />
    </div>
  )
}
