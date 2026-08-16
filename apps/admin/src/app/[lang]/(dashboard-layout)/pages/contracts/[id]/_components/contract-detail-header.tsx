"use client"

import React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  QrCode,
  ExternalLink,
  FileDown,
  Bell,
  Trash2,
  Send,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import type { EContract } from "@/types"

interface ContractDetailHeaderProps {
  contract: EContract
  lang: string
  isSigned: boolean
  isOrderSource: boolean
  orderCode?: string
  traceUrl: string
  pdfDownloadUrl: string
  isSendingReminder: boolean
  isIssuing?: boolean
  onEditClick?: () => void
  onIssue?: () => void
  onSendReminder: () => void
  onDeleteClick: () => void
}

export function ContractDetailHeader({
  contract,
  lang,
  isSigned,
  isOrderSource,
  orderCode,
  traceUrl,
  pdfDownloadUrl,
  isSendingReminder,
  isIssuing,
  onEditClick,
  onIssue,
  onSendReminder,
  onDeleteClick,
}: ContractDetailHeaderProps) {
  const isDraft = contract.status === "draft" || contract.status === "pending_issue"

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
      <div className="space-y-1">
        <Link
          href={`/${lang}/pages/contracts`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Danh sách hợp đồng
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {contract.code}
          </h1>
          {isSigned ? (
            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 font-semibold px-2.5 py-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã ký
            </Badge>
          ) : isDraft ? (
            <Badge className="bg-purple-600 hover:bg-purple-700 text-white gap-1 font-semibold px-2.5 py-0.5">
              <FileText className="w-3.5 h-3.5" /> Chờ BQL phát hành
            </Badge>
          ) : contract.status === "pending" ? (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 font-semibold px-2.5 py-0.5">
              <Clock className="w-3.5 h-3.5" /> Chờ khách ký
            </Badge>
          ) : contract.status === "expired" ? (
            <Badge variant="destructive">Đã hết hạn</Badge>
          ) : (
            <Badge variant="secondary">{contract.status}</Badge>
          )}

          {isOrderSource ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300">
              Đơn hàng {orderCode ? `#${orderCode}` : ""}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300">
              Tạo thủ công
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{contract.title}</p>
      </div>

      {/* Action Buttons based on status */}
      <div className="flex flex-wrap items-center gap-2">
        {!isSigned && onEditClick && (
          <Button
            size="sm"
            variant="outline"
            onClick={onEditClick}
            className="gap-1.5 text-foreground border-border hover:bg-muted font-semibold cursor-pointer shadow-2xs"
          >
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Chỉnh sửa thông tin & HĐ
          </Button>
        )}

        {isDraft && onIssue && (
          <Button
            size="sm"
            onClick={onIssue}
            disabled={isIssuing}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" /> {isIssuing ? "Đang phát hành..." : "Phát hành & Gửi khách ký"}
          </Button>
        )}

        <a
          href={traceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <Button variant="outline" size="sm" className="gap-1.5">
            <QrCode className="w-4 h-4 text-emerald-600" /> Tra cứu QR <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </Button>
        </a>

        <a href={pdfDownloadUrl} target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="gap-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900">
            <FileDown className="w-4 h-4" /> Tải bản PDF
          </Button>
        </a>

        {!isSigned && contract.status === "pending" && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSendReminder}
            disabled={isSendingReminder}
            className="gap-1.5 text-amber-700 border-amber-300 hover:bg-amber-50"
          >
            <Bell className="w-4 h-4 text-amber-600" /> Gửi nhắc ký
          </Button>
        )}

        {!isSigned && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteClick}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
