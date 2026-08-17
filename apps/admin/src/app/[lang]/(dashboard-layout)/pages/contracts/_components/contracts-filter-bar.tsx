"use client"

import React from "react"
import { RefreshCw, Search } from "lucide-react"

import { useTranslation } from "@/providers/i18n-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const { t } = useTranslation()
  const isFiltered =
    searchQuery ||
    statusFilter !== "all" ||
    sourceFilter !== "all" ||
    paymentFilter !== "all"

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t("contracts.filters.search")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      {/* Filter Group */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="h-9 text-xs w-[185px]">
            <SelectValue placeholder={t("contracts.filters.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("contracts.filters.allStatus")}
            </SelectItem>
            <SelectItem value="draft">{t("contracts.status.DRAFT")}</SelectItem>
            <SelectItem value="pending">
              {t("contracts.status.PENDING_SIGN")}
            </SelectItem>
            <SelectItem value="signed">
              {t("contracts.status.SIGNED")}
            </SelectItem>
            <SelectItem value="expired">
              {t("contracts.status.EXPIRED")}
            </SelectItem>
            <SelectItem value="cancelled">
              {t("contracts.status.CANCELLED")}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Source Filter */}
        <Select value={sourceFilter} onValueChange={onSourceChange}>
          <SelectTrigger className="h-9 text-xs w-[150px]">
            <SelectValue placeholder={t("contracts.filters.source")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("contracts.filters.allSource")}
            </SelectItem>
            <SelectItem value="order">
              {t("contracts.types.TREE_PURCHASE")}
            </SelectItem>
            <SelectItem value="manual">
              {t("contracts.createManual")}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Filter */}
        <Select value={paymentFilter} onValueChange={onPaymentChange}>
          <SelectTrigger className="h-9 text-xs w-[140px]">
            <SelectValue placeholder={t("contracts.filters.payment")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("contracts.filters.allPayment")}
            </SelectItem>
            <SelectItem value="paid">{t("common.status.paid")}</SelectItem>
            <SelectItem value="unpaid">{t("common.status.pending")}</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />{" "}
            {t("common.actions.reset")}
          </Button>
        )}
      </div>
    </div>
  )
}
