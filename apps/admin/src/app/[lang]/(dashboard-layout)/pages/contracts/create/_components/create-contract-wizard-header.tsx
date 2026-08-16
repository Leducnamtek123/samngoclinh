"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Save, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CreateContractWizardHeaderProps {
  lang: string
  currentStep: number
  isSubmitting: boolean
  isStep1Valid: boolean
  isStep2Valid: boolean
  onNext: () => void
  onSubmit: (publishStatus: "pending" | "draft") => void
}

export function CreateContractWizardHeader({
  lang,
  currentStep,
  isSubmitting,
  isStep1Valid,
  isStep2Valid,
  onNext,
  onSubmit,
}: CreateContractWizardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
      <div className="space-y-1">
        <Link
          href={`/${lang}/pages/contracts`}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách hợp đồng
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tạo hợp đồng thủ công
          </h1>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300">
            Tạo thủ công
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Tạo hợp đồng cho các giao dịch không phát sinh tự động từ đơn hàng.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onSubmit("draft")}
          disabled={isSubmitting || !isStep1Valid}
          className="gap-1.5"
        >
          <Save className="w-4 h-4" /> Lưu bản nháp
        </Button>
        {currentStep === 4 ? (
          <Button
            onClick={() => onSubmit("pending")}
            disabled={isSubmitting || !isStep1Valid || !isStep2Valid}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
          >
            <Send className="w-4 h-4" /> Phát hành hợp đồng
          </Button>
        ) : (
          <Button onClick={onNext} className="gap-1.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
            Tiếp tục <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
