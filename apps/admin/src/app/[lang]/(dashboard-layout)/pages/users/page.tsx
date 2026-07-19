import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { UsersTable } from "./_components/users-table"

export const metadata: Metadata = {
  title: "Quản lý Người dùng | Sâm Ngọc Linh Admin",
  description: "Danh sách tài khoản người dùng trong hệ thống Sâm Ngọc Linh",
}

interface User {
  id: string
  name?: string
  username: string
  email: string
  status: string
  isVerified: boolean
  signUpDate?: string
  createdAt?: string
}

interface UsersPageProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    page?: string
    perPage?: string
    search?: string
    status?: string
  }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""

  let customers: User[] = []
  let metadata: any = null
  let errorMsg = ""

  try {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page)
    queryParams.append("perPage", perPage)
    if (search) queryParams.append("search", search)
    if (status && status !== "all") queryParams.append("status", status)

    const res = await fetchApi(`/admin/user/list?${queryParams.toString()}`)
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Failed to load users"
    } else {
      customers = Array.isArray(payload.data) ? payload.data : []
      metadata = payload.metadata || null
    }
  } catch (e) {
    console.error("Error fetching users:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Người dùng</h1>
        <p className="text-muted-foreground">
          Quản lý tất cả tài khoản người dùng, đối tác, nhân viên và quản trị viên trong hệ thống.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">Danh sách tài khoản</h2>
          <p className="text-xs text-muted-foreground">
            Hiển thị thông tin tên, email, trạng thái hoạt động và ngày đăng ký.
          </p>
        </div>
        
        <UsersTable 
          initialUsers={customers} 
          metadata={metadata} 
          errorMsg={errorMsg} 
        />
      </div>
    </div>
  )
}
