"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react"

import type { AdminUser, EContract, PaginationMeta, Tree } from "@/types"

import { fetchApi } from "@/lib/api"

import { useTranslation } from "@/providers/i18n-provider"
import { Pagination } from "@/components/ui/app-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ContractsFilterBar } from "./contracts-filter-bar"
import { ContractsList } from "./contracts-list"
import { ContractsStatsCards } from "./contracts-stats-cards"

interface ContractsManagerProps {
  initialContracts: EContract[]
  users: AdminUser[]
  trees: Tree[]
  metadata: PaginationMeta | null
  errorMsg?: string
}

export function ContractsManager({
  initialContracts,
  users,
  trees,
  metadata,
  errorMsg: initialError,
}: ContractsManagerProps) {
  const { t } = useTranslation()
  const params = useParams()
  const lang = (params?.lang as string) || "vi"
  const router = useRouter()
  const searchParams = useSearchParams()

  const [contracts, setContracts] = useState<EContract[]>(initialContracts)
  const [searchQuery, setSearchQuery] = useState<string>(
    () => searchParams.get("search") || ""
  )
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [isCheckingExpiry, setIsCheckingExpiry] = useState(false)

  React.useEffect(() => {
    setContracts(initialContracts)
  }, [initialContracts])

  // Real data statistics computation
  const stats = useMemo(() => {
    const total = metadata?.count || contracts.length
    const draft = contracts.filter(
      (c) => c.status === "draft" || c.status === "pending_issue"
    ).length
    const pending = contracts.filter(
      (c) => c.status === "pending" || c.status === "pending_signature"
    ).length
    const signed = contracts.filter((c) => c.status === "signed").length
    const now = new Date()
    const in30Days = new Date()
    in30Days.setDate(in30Days.getDate() + 30)

    const expiringSoon = contracts.filter((c) => {
      if (c.status !== "signed") return false
      const expDate = c.expiresAt || c.expiredAt
      if (!expDate) return false
      const exp = new Date(expDate)
      return exp >= now && exp <= in30Days
    }).length

    const expired = contracts.filter((c) => {
      const expDate = c.expiresAt || c.expiredAt
      const exp = expDate ? new Date(expDate) : null
      return c.status === "expired" || (exp ? exp < now : false)
    }).length

    return { total, draft, pending, signed, expiringSoon, expired }
  }, [contracts, metadata])

  // Filtered list on client
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      // Search
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        c.code?.toLowerCase().includes(query) ||
        c.contractCode?.toLowerCase().includes(query) ||
        c.title?.toLowerCase().includes(query) ||
        (typeof c.partyB === "string" &&
          c.partyB.toLowerCase().includes(query)) ||
        (typeof c.partyB === "object" &&
          c.partyB?.name?.toLowerCase().includes(query)) ||
        c.customerName?.toLowerCase().includes(query)

      // Status
      const matchesStatus =
        statusFilter === "all" ||
        c.status === statusFilter ||
        (statusFilter === "draft" &&
          (c.status === "draft" || c.status === "pending_issue")) ||
        (statusFilter === "pending" &&
          (c.status === "pending" || c.status === "pending_signature"))

      // Source (Order vs Manual)
      const meta = (c.metadata || {}) as Record<string, unknown>
      const isOrder = Boolean(
        meta.orderId || meta.orderCode || c.contractType === "purchase_and_care"
      )
      const matchesSource =
        sourceFilter === "all" ||
        (sourceFilter === "order" && isOrder) ||
        (sourceFilter === "manual" && !isOrder)

      // Payment
      const matchesPayment =
        paymentFilter === "all" || c.paymentStatus === paymentFilter

      return matchesSearch && matchesStatus && matchesSource && matchesPayment
    })
  }, [contracts, searchQuery, statusFilter, sourceFilter, paymentFilter])

  // Check Expiring Contracts Action
  const handleCheckExpiry = async () => {
    setIsCheckingExpiry(true)
    try {
      const res = await fetchApi("/admin/contracts/check-expiry", {
        method: "POST",
      })
      const payload = await res.json()
      if (res.status < 400 && payload.data) {
        toast.success(
          t("contracts.notifications.checkExpiredSuccess", {
            count: payload.data.count,
          })
        )
      } else {
        toast.error(t("contracts.notifications.checkExpiredError"))
      }
    } catch {
      toast.error(t("contracts.notifications.serverError"))
    } finally {
      setIsCheckingExpiry(false)
    }
  }

  const handleDeleteContract = async (id: string) => {
    try {
      const res = await fetchApi(`/admin/contracts/${id}`, { method: "DELETE" })
      if (res.status < 400) {
        toast.success(t("contracts.notifications.deleteSuccess"))
        setContracts((prev) => prev.filter((c) => c.id !== id))
      } else {
        toast.error(t("contracts.notifications.deleteError"))
      }
    } catch {
      toast.error(t("contracts.notifications.serverError"))
    }
  }

  const handleIssueContract = async (id: string) => {
    try {
      const res = await fetchApi(`/admin/contracts/${id}/issue`, {
        method: "POST",
      })
      if (res) {
        toast.success(t("contracts.notifications.publishSuccess"))
        setContracts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "pending" } : c))
        )
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("contracts.notifications.publishError")
      toast.error(msg)
    }
  }

  const handlePageChange = (newPage: number) => {
    const search = new URLSearchParams(searchParams.toString())
    search.set("page", newPage.toString())
    router.push(`/${lang}/pages/contracts?${search.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Quản lý hợp đồng
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Theo dõi và phát hành hợp đồng với khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCheckExpiry}
            disabled={isCheckingExpiry}
            className="gap-1.5"
          >
            <Bell className="w-4 h-4 text-amber-600" />
            {isCheckingExpiry ? "Đang quét..." : "Quét hạn hợp đồng"}
          </Button>

          {/* Explicit Manual Create Button */}
          <Link href={`/${lang}/pages/contracts/create`}>
            <Button
              size="sm"
              className="gap-1.5 bg-primary text-primary-foreground font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" /> Tạo hợp đồng thủ công
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <ContractsStatsCards stats={stats} />

      {/* Main Workspace Card with Filters & Table */}
      <Card className="border-slate-200 shadow-xs dark:border-slate-800">
        <CardHeader className="p-4 pb-3 border-b border-border/40">
          <ContractsFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sourceFilter={sourceFilter}
            onSourceChange={setSourceFilter}
            paymentFilter={paymentFilter}
            onPaymentChange={setPaymentFilter}
            onReset={() => {
              setSearchQuery("")
              setStatusFilter("all")
              setSourceFilter("all")
              setPaymentFilter("all")
            }}
          />
        </CardHeader>

        <CardContent className="p-0">
          <ContractsList
            contracts={filteredContracts}
            users={users}
            lang={lang}
            onDelete={handleDeleteContract}
            onIssue={handleIssueContract}
          />

          {metadata && metadata.totalPage > 1 && (
            <div className="p-4 border-t border-border">
              <Pagination metadata={metadata} onPageChange={handlePageChange} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
