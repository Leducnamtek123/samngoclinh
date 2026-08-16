import { Suspense } from "react"
import type { Metadata } from "next"

import type { AdminUser, LocaleType, PaginationMeta } from "@/types"

import { usersService } from "@/services/users.service"
import { getDictionary } from "@/lib/get-dictionary"
import { createTranslator } from "@/lib/i18n"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { UsersTable } from "./_components/users-table"

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

export const metadata: Metadata = {
  title: "Quản lý người dùng | Sâm Ngọc Linh Admin",
  description: "Quản trị danh sách người dùng, khách hàng và đối tác trong hệ thống",
}

export default async function UsersPage({
  params,
  searchParams,
}: UsersPageProps) {
  const resolvedParams = await params
  const lang = (resolvedParams?.lang || "vi") as LocaleType
  const dictionary = await getDictionary(lang)
  const t = createTranslator(dictionary)

  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""

  let customers: AdminUser[] = []
  let metadata: PaginationMeta | null = null
  let errorMsg = ""

  try {
    const res = await usersService.getUsers({ page, perPage, search, status })
    if (res.data && Array.isArray(res.data)) {
      customers = res.data
      metadata = res.metadata || null
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Không thể kết nối đến máy chủ API"
    console.error("Error fetching users:", e)
    errorMsg = message
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t("navigation.users")}
        </h1>
        <p className="text-sm text-muted-foreground">
          Quản lý tài khoản người dùng, phân quyền và trạng thái hoạt động trong hệ thống
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 sm:p-6 shadow-xs">
        <Suspense fallback={<TableSkeleton cols={5} rows={5} />}>
          <UsersTable
            initialUsers={customers}
            metadata={metadata}
            errorMsg={errorMsg}
          />
        </Suspense>
      </div>
    </div>
  )
}
