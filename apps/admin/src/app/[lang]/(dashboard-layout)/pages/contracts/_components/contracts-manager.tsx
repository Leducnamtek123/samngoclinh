"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams, usePathname } from "next/navigation"
import {
  FileText,
  Plus,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  RefreshCw,
  Filter,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/app-pagination"
import { ContractsList } from "./contracts-list"
import { fetchApi } from "@/lib/api"

export interface EContract {
  id: string
  code?: string
  userId: string
  treeCode?: string
  title?: string
  content?: string
  status: string
  contractValue: number
  paymentStatus: string
  signedAt?: string
  expiredAt: string
  signatureUrl?: string
  isReminderSent?: boolean
  reminderSentAt?: string
  contractType?: string
  partyA?: string
  partyB?: string
  pdfUrl?: string
  terms?: string
  createdAt: string
  updatedAt?: string
  metadata?: any
}

export interface User {
  id: string
  name?: string
  username?: string
  email?: string
  isVerified?: boolean
  mobileNumbers?: Array<{ number: string }>
}

export interface Tree {
  id: string
  code: string
  name: string
}

interface ContractsManagerProps {
  initialContracts: EContract[]
  users: User[]
  trees: Tree[]
  metadata: {
    page: number
    perPage: number
    totalPage: number
    count: number
    hasNext: boolean
    hasPrevious: boolean
  } | null
  errorMsg?: string
}

export function ContractsManager({
  initialContracts,
  users,
  trees,
  metadata,
  errorMsg: initialError,
}: ContractsManagerProps) {
  const params = useParams()
  const lang = (params?.lang as string) || "vi"
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [contracts, setContracts] = useState<EContract[]>(initialContracts)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [isCheckingExpiry, setIsCheckingExpiry] = useState(false)

  // Real data statistics computation
  const stats = useMemo(() => {
    const total = metadata?.count || contracts.length
    const pending = contracts.filter((c) => c.status === "pending").length
    const signed = contracts.filter((c) => c.status === "signed").length
    const now = new Date()
    const in30Days = new Date()
    in30Days.setDate(in30Days.getDate() + 30)

    const expiringSoon = contracts.filter((c) => {
      if (c.status !== "signed") return false
      const exp = new Date(c.expiredAt)
      return exp >= now && exp <= in30Days
    }).length

    const expired = contracts.filter((c) => {
      const exp = new Date(c.expiredAt)
      return c.status === "expired" || exp < now
    }).length

    return { total, pending, signed, expiringSoon, expired }
  }, [contracts, metadata])

  // Filtered list on client
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      // Search
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        c.code?.toLowerCase().includes(query) ||
        c.title?.toLowerCase().includes(query) ||
        c.partyB?.toLowerCase().includes(query)

      // Status
      const matchesStatus = statusFilter === "all" || c.status === statusFilter

      // Source (Order vs Manual)
      const meta = (c.metadata || {}) as Record<string, any>
      const isOrder = Boolean(meta.orderId || meta.orderCode || c.contractType === "purchase_and_care")
      const matchesSource =
        sourceFilter === "all" ||
        (sourceFilter === "order" && isOrder) ||
        (sourceFilter === "manual" && !isOrder)

      // Payment
      const matchesPayment = paymentFilter === "all" || c.paymentStatus === paymentFilter

      return matchesSearch && matchesStatus && matchesSource && matchesPayment
    })
  }, [contracts, searchQuery, statusFilter, sourceFilter, paymentFilter])

  // Check Expiring Contracts Action
  const handleCheckExpiry = async () => {
    setIsCheckingExpiry(true)
    try {
      const res = await fetchApi("/admin/contracts/check-expiry", { method: "POST" })
      const payload = await res.json()
      if (res.status < 400 && payload.data) {
        toast.success(
          `Đã quét hệ thống: ${payload.data.count} hợp đồng sắp hết hạn được ghi nhận thông báo.`
        )
      } else {
        toast.error("Không thể kiểm tra hợp đồng hết hạn.")
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ.")
    } finally {
      setIsCheckingExpiry(false)
    }
  }

  const handleDeleteContract = async (id: string) => {
    try {
      const res = await fetchApi(`/admin/contracts/${id}`, { method: "DELETE" })
      if (res.status < 400) {
        toast.success("Đã xóa hợp đồng.")
        setContracts((prev) => prev.filter((c) => c.id !== id))
      } else {
        toast.error("Không thể xóa hợp đồng.")
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ.")
    }
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
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
            <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground font-semibold shadow-xs">
              <Plus className="w-4 h-4" /> Tạo hợp đồng thủ công
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Card className="p-4 bg-white dark:bg-slate-900 shadow-2xs border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Tổng hợp đồng</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</span>
            <span className="text-[10px] text-muted-foreground">văn bản</span>
          </div>
        </Card>

        <Card className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold">Chờ khách ký</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{stats.pending}</span>
            <span className="text-[10px] text-amber-700/70">hợp đồng</span>
          </div>
        </Card>

        <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Đã ký</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{stats.signed}</span>
            <span className="text-[10px] text-emerald-700/70">có hiệu lực</span>
          </div>
        </Card>

        <Card className="p-4 bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/80 dark:border-orange-900/40 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-orange-800 dark:text-orange-300 font-semibold">Sắp hết hạn (&le;30 ngày)</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-orange-700 dark:text-orange-400">{stats.expiringSoon}</span>
            <span className="text-[10px] text-orange-700/70">cần gia hạn</span>
          </div>
        </Card>

        <Card className="p-4 bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Đã hết hạn</span>
            <FileCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-700 dark:text-slate-300">{stats.expired}</span>
            <span className="text-[10px] text-muted-foreground">hết hiệu lực</span>
          </div>
        </Card>
      </div>

      {/* Main Workspace Card with Filters & Table */}
      <Card className="border-slate-200 shadow-xs dark:border-slate-800">
        <CardHeader className="p-4 pb-3 border-b border-border/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã HĐ, tiêu đề, khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Filter Group */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-xs w-[140px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ khách ký</SelectItem>
                  <SelectItem value="signed">Đã ký</SelectItem>
                  <SelectItem value="expired">Đã hết hạn</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>

              {/* Source Filter */}
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="h-9 text-xs w-[150px]">
                  <SelectValue placeholder="Nguồn phát sinh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả nguồn</SelectItem>
                  <SelectItem value="order">Tự động (Đơn hàng)</SelectItem>
                  <SelectItem value="manual">Tạo thủ công</SelectItem>
                </SelectContent>
              </Select>

              {/* Payment Filter */}
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="h-9 text-xs w-[140px]">
                  <SelectValue placeholder="Thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thanh toán</SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                  <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || statusFilter !== "all" || sourceFilter !== "all" || paymentFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setSourceFilter("all")
                    setPaymentFilter("all")
                  }}
                  className="h-9 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Đặt lại
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ContractsList
            contracts={filteredContracts}
            users={users}
            lang={lang}
            onDelete={handleDeleteContract}
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
