import { Suspense } from "react"

import type { AdminUser, EContract, PaginationMeta, Tree } from "@/types"
import type { Metadata } from "next"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { ContractsManager } from "./_components/contracts-manager"
import { cultivationService } from "@/services/cultivation.service"
import { legalService } from "@/services/legal.service"
import { usersService } from "@/services/users.service"

export const metadata: Metadata = {
  title: "Quản lý Hợp đồng Điện tử | Sâm Ngọc Linh Admin",
  description:
    "Quản lý, tạo mới và theo dõi tính pháp lý của hợp đồng mua bán cây sâm điện tử.",
}

interface ContractsPageProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    page?: string
    perPage?: string
    search?: string
  }>
}

export default async function ContractsPage({
  searchParams,
}: ContractsPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""

  let contracts: EContract[] = []
  let users: AdminUser[] = []
  let trees: Tree[] = []
  let metadata: PaginationMeta | null = null
  let errorMsg = ""

  try {
    const [contractRes, usersRes, treesRes] = await Promise.all([
      legalService.getContracts({ page, perPage, search }).catch(() => null),
      usersService.getUsers({ perPage: 100 }).catch(() => null),
      cultivationService.getTrees({ perPage: 100 }).catch(() => null),
    ])

    if (contractRes) {
      contracts = Array.isArray(contractRes.data)
        ? contractRes.data
        : Array.isArray((contractRes.data as { items?: EContract[] })?.items)
          ? (contractRes.data as { items?: EContract[] }).items || []
          : []
      metadata =
        contractRes.metadata || (contractRes.data as { metadata?: typeof metadata })?.metadata || null
    }

    if (usersRes?.data) {
      users = Array.isArray(usersRes.data)
        ? usersRes.data
        : (usersRes.data as { items?: typeof users })?.items || []
    }

    if (treesRes?.data) {
      trees = Array.isArray(treesRes.data)
        ? treesRes.data
        : (treesRes.data as { items?: typeof trees })?.items || []
    }
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Không thể kết nối đến máy chủ API"
    console.error("Error fetching contracts data:", e)
    errorMsg = message
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Suspense fallback={<TableSkeleton cols={5} rows={5} />}>
        <ContractsManager
          initialContracts={contracts}
          metadata={metadata}
          users={users}
          trees={trees}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
