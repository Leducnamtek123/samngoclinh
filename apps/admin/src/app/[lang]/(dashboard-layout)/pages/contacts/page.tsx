import { Suspense } from "react"

import type { Metadata } from "next"
import type { ContactRequest, PaginationMeta } from "@/types"

import { fetchApi } from "@/lib/api"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { ContactsTable } from "./_components/contacts-table"

export const metadata: Metadata = {
  title: "Quản lý Liên hệ | Sâm Ngọc Linh Admin",
  description:
    "Duyệt danh sách và chi tiết các yêu cầu liên hệ, tin nhắn từ khách hàng gửi về hệ thống.",
}

interface ContactsPageProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    page?: string
    perPage?: string
    search?: string
    isRead?: string
  }>
}

export default async function ContactsPage({
  searchParams,
}: ContactsPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const isRead = resolvedSearchParams.isRead || ""

  let contacts: ContactRequest[] = []
  let metadata: PaginationMeta | null = null
  let errorMsg = ""

  try {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page)
    queryParams.append("perPage", perPage)
    if (search) queryParams.append("search", search)
    if (isRead && isRead !== "all") queryParams.append("isRead", isRead)

    const res = await fetchApi(`/admin/contacts?${queryParams.toString()}`)
    const payload = await res.json()

    if (res.status >= 400) {
      errorMsg = payload?.message || "Không thể tải danh sách liên hệ."
    } else {
      contacts = Array.isArray(payload.data)
        ? payload.data
        : payload.data?.items || []
      metadata = payload.metadata || null
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Lỗi khi kết nối máy chủ"
    console.error("Error loading contacts page data:", e)
    errorMsg = message
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Suspense fallback={<TableSkeleton cols={5} rows={5} />}>
        <ContactsTable
          initialContacts={contacts}
          metadata={metadata}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
