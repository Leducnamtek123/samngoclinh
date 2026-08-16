import { Suspense } from "react"
import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import type { AdminUser, Tree } from "@/types"
import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { CreateContractWizard } from "./_components/create-contract-wizard"

export const metadata: Metadata = {
  title: "Tạo hợp đồng thủ công | Sâm Ngọc Linh Admin",
  description: "Tạo hợp đồng cho các giao dịch không phát sinh tự động từ đơn hàng.",
}

interface CreateContractPageProps {
  params: Promise<{
    lang: string
  }>
}

export default async function CreateContractPage({
  params,
}: CreateContractPageProps) {
  const { lang } = await params

  let users: AdminUser[] = []
  let trees: Tree[] = []

  try {
    const usersRes = await fetchApi("/admin/user/list?page=1&perPage=500")
    const usersPayload = await usersRes.json()
    if (usersRes.status < 400) {
      users = Array.isArray(usersPayload.data) ? usersPayload.data : []
    }

    const treesRes = await fetchApi("/admin/cultivation/trees?page=1&perPage=500")
    const treesPayload = await treesRes.json()
    if (treesRes.status < 400) {
      trees = Array.isArray(treesPayload.data) ? treesPayload.data : []
    }
  } catch (e: unknown) {
    console.error("Error loading create contract page data:", e)
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <Suspense fallback={<TableSkeleton cols={4} rows={6} />}>
        <CreateContractWizard users={users} trees={trees} lang={lang} />
      </Suspense>
    </div>
  )
}
