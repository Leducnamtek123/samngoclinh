import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchApi } from "@/lib/api"
import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { ContractDetailView } from "./_components/contract-detail-view"

export const metadata: Metadata = {
  title: "Chi tiết hợp đồng điện tử | Sâm Ngọc Linh Admin",
  description: "Chi tiết và tiến trình pháp lý của hợp đồng điện tử.",
}

interface ContractDetailPageProps {
  params: Promise<{
    lang: string
    id: string
  }>
}

export default async function ContractDetailPage({
  params,
}: ContractDetailPageProps) {
  const { lang, id } = await params

  let contract: any = null
  let user: any = null
  let users: any[] = []
  let errorMsg = ""

  try {
    // 1. Fetch contracts to find the matching contract by id or code
    const res = await fetchApi("/admin/contracts?perPage=500")
    const payload = await res.json()
    const items = Array.isArray(payload.data?.items)
      ? payload.data.items
      : Array.isArray(payload.data)
      ? payload.data
      : []

    contract = items.find((c: any) => c.id === id || c.code === id)

    // 2. Fetch users to get customer details
    const usersRes = await fetchApi("/admin/user/list?page=1&perPage=500")
    const usersPayload = await usersRes.json()
    if (usersRes.status < 400) {
      users = Array.isArray(usersPayload.data) ? usersPayload.data : []
    }

    if (contract) {
      user = users.find((u: any) => u.id === contract.userId)
    } else {
      errorMsg = "Không tìm thấy hợp đồng với mã định danh này."
    }
  } catch (e) {
    console.error("Error loading contract detail:", e)
    errorMsg = "Không thể kết nối đến máy chủ API."
  }

  if (!contract && !errorMsg) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <Suspense fallback={<TableSkeleton cols={3} rows={8} />}>
        <ContractDetailView
          contract={contract}
          user={user}
          lang={lang}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
