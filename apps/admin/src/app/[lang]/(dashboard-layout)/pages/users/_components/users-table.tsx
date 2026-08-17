"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import type { ColumnDef } from "@/components/shared/data-table"
import type { AdminUser, PaginationMeta } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { useTranslation } from "@/providers/i18n-provider"
import { ToastCard } from "@/components/ui/feedback-components"
import { DataTable } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"

interface UsersTableProps {
  initialUsers: AdminUser[]
  metadata: PaginationMeta | null
  errorMsg?: string
}

export function UsersTable({
  initialUsers,
  metadata,
  errorMsg,
}: UsersTableProps) {
  const { t } = useTranslation()
  const [localError, setLocalError] = useState(errorMsg || "")

  useEffect(() => {
    if (errorMsg) {
      setLocalError(errorMsg)
    }
  }, [errorMsg])

  const {
    searchVal,
    setSearchVal,
    statusFilter,
    handlePageChange,
    handleStatusFilterChange,
    resetFilters,
  } = useDataTable()

  const columns: ColumnDef<AdminUser>[] = [
    {
      header: t("users.fields.fullName"),
      cell: (user) => (
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {user.name || "-"}
        </span>
      ),
    },
    {
      header: t("users.fields.username"),
      cell: (user) => (
        <span className="text-slate-650 dark:text-slate-400">
          {user.username}
        </span>
      ),
    },
    {
      header: t("users.fields.email"),
      cell: (user) => user.email,
    },
    {
      header: t("users.fields.verified"),
      cell: (user) => (
        <StatusBadge
          status={user.isVerified ? "verified" : "unverified"}
          label={
            user.isVerified
              ? t("users.status.verified")
              : t("users.status.unverified")
          }
        />
      ),
    },
    {
      header: t("users.fields.status"),
      cell: (user) => {
        const rawStatus = (user.status || "active").toLowerCase()
        const translated = t(`users.status.${rawStatus}`)
        const displayLabel =
          translated && !translated.startsWith("users.status.")
            ? translated
            : t(`common.status.${rawStatus}`) || rawStatus

        return <StatusBadge status={rawStatus} label={displayLabel} />
      },
    },
    {
      header: t("users.fields.createdAt"),
      headerClassName: "text-right",
      className: "text-right text-slate-500",
      cell: (user) =>
        user.signUpDate || user.createdAt
          ? new Date(user.signUpDate || user.createdAt!).toLocaleDateString(
              "vi-VN",
              { timeZone: "Asia/Ho_Chi_Minh" }
            )
          : "-",
    },
  ]

  const statusOptions = [
    { label: t("common.actions.filterAll"), value: "all" },
    { label: t("users.status.active"), value: "active" },
    { label: t("common.status.inactive"), value: "inactive" },
    { label: t("users.status.blocked"), value: "blocked" },
  ]

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={initialUsers}
        metadata={metadata}
        onPageChange={handlePageChange}
        emptyMessage={t("common.table.noResults")}
        toolbarProps={{
          searchPlaceholder: t("common.actions.search"),
          searchValue: searchVal,
          onSearchChange: setSearchVal,
          statusValue: statusFilter,
          onStatusChange: handleStatusFilterChange,
          statusOptions,
          statusPlaceholder: t("users.fields.status"),
          onReset: resetFilters,
        }}
        rowActionsHeader={t("common.actions.actions")}
        rowActions={(user) => (
          <Link
            href={`/pages/users/details?id=${user.id}`}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            {t("common.actions.view")}
          </Link>
        )}
      />

      {localError && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
          <ToastCard
            type="error"
            title={t("common.status.error")}
            description={localError}
            onClose={() => setLocalError("")}
          />
        </div>
      )}
    </div>
  )
}
