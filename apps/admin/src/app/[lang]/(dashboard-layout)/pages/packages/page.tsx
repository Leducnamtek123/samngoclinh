import { Suspense } from "react"

import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
              <div className="space-y-4 animate-pulse">
                <Card>
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-4 w-28" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="space-y-4 animate-pulse">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
              <Card>
                <CardHeader className="space-y-2">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </CardContent>
              </Card>
            </div>
          </div>
        }
      >
        <PackagesManager
          initialCarePackages={carePackages}
          initialProtectionPackages={protectionPackages}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
