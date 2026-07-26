import { Suspense } from "react"

import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { UsersTable } from "./_components/users-table"

export const metadata: Metadata = {
  title: "User Management | Admin",
  description: "User account list",
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
    errorMsg = "Unable to connect to server"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage system users, roles, and permissions.
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Account List
          </h2>
          <p className="text-xs text-muted-foreground">
            Display user name, email, status, and registration date.
          </p>
        </div>

        <Suspense fallback={<TableSkeleton cols={6} rows={5} />}>
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
