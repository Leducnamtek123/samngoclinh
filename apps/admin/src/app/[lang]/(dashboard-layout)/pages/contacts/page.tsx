import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { ContactsTable } from "./_components/contacts-table"

export const metadata: Metadata = {
  title: "Quản lý Liên hệ | Sâm Ngọc Linh Admin",
  description: "Duyệt danh sách và chi tiết các yêu cầu liên hệ, tin nhắn từ khách hàng gửi về hệ thống.",
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

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const isRead = resolvedSearchParams.isRead || ""

  let contacts: any[] = []
  let metadata: any = null
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
      contacts = Array.isArray(payload.data) ? payload.data : (payload.data?.items || [])
      metadata = payload.metadata || null
    }
  } catch (e) {
    console.error("Error loading contacts page data:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Liên hệ</h1>
        <p className="text-muted-foreground">
          Duyệt danh sách và chi tiết các yêu cầu liên hệ, tin nhắn từ khách hàng gửi về hệ thống.
        </p>
      </div>

      <ContactsTable 
        initialContacts={contacts} 
        metadata={metadata} 
        errorMsg={errorMsg} 
      />
    </div>
  )
}
