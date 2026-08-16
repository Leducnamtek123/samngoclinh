"use client"

import React from "react"
import { Search, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContractsFilterBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  sourceFilter: string
  onSourceChange: (value: string) => void
  paymentFilter: string
  onPaymentChange: (value: string) => void
  onReset: () => void
}

export function ContractsFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  paymentFilter,
  onPaymentChange,
  onReset,
}: ContractsFilterBarProps) {
  const isFiltered = searchQuery || statusFilter !== "all" || sourceFilter !== "all" || paymentFilter !== "all"

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo mã HĐ, tiêu đề, khách hàng..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      {/* Filter Group */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
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
        <Select value={sourceFilter} onValueChange={onSourceChange}>
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
        <Select value={paymentFilter} onValueChange={onPaymentChange}>
          <SelectTrigger className="h-9 text-xs w-[140px]">
            <SelectValue placeholder="Thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thanh toán</SelectItem>
            <SelectItem value="paid">Đã thanh toán</SelectItem>
            <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Đặt lại
          </Button>
        )}
      </div>
    </div>
  )
}
