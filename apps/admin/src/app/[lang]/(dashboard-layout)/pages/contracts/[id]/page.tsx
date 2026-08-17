import { Suspense } from "react"
import { notFound } from "next/navigation"

import type { AdminUser, EContract } from "@/types"
import type { Metadata } from "next"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { ContractDetailView } from "./_components/contract-detail-view"
import { legalService } from "@/services/legal.service"
import { usersService } from "@/services/users.service"

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
  const { id, lang } = await params

  let contract: EContract | null = null
  let user: AdminUser | null = null
  let errorMsg = ""

  try {
    // 1. Fetch contract by ID directly via legalService
    const res = await legalService.getContractDetail(id).catch(() => null)
    if (res?.data) {
      contract = res.data
    } else {
      // 2. Fallback search by code if ID was code or custom format
      const searchRes = await legalService
        .getContracts({ search: id })
        .catch(() => null)
      if (searchRes?.data) {
        const items: EContract[] = Array.isArray(searchRes.data)
          ? searchRes.data
          : Array.isArray((searchRes.data as { items?: EContract[] })?.items)
            ? (searchRes.data as { items?: EContract[] }).items || []
            : []
        contract =
          items.find(
            (c: EContract) =>
              c.id === id ||
              c.contractCode === id ||
              c.code === id ||
              c.contractNumber === id
          ) || null
      }
    }

    // 3. Fetch user details if contract has a customer
    if (contract?.userId) {
      const userRes = await usersService
        .getUserDetail(contract.userId)
        .catch(() => null)
      if (userRes?.data) {
        user = userRes.data
      }
    }

    if (!contract) {
      errorMsg = "Không tìm thấy hợp đồng với mã định danh này."
    }
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Không thể kết nối đến máy chủ API."
    console.error("Error loading contract detail:", e)
    errorMsg = message
  }

  if (!contract && !errorMsg) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <Suspense fallback={<TableSkeleton cols={4} rows={6} />}>
        <ContractDetailView
          contract={contract}
          user={user}
          lang={lang}
          requestedId={id}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
