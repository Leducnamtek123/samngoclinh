"use client"

import React from "react"
import { ShieldCheck, UserCheck, CheckCircle2, ArrowLeft, Save, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CreateContractStep4Props {
  title: string
  selectedUser: any
  contractValue: number
  paymentStatus: string
  selectedTreeCode: string
  expiredAt: string
  formatDateViDisplay: (dateStr: string) => string
  onBackToStep3: () => void
  onSubmit: (status: "draft" | "pending") => void
  isSubmitting: boolean
}

export function CreateContractStep4Confirm({
  title,
  selectedUser,
  contractValue,
  paymentStatus,
  selectedTreeCode,
  expiredAt,
  formatDateViDisplay,
  onBackToStep3,
  onSubmit,
  isSubmitting,
}: CreateContractStep4Props) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-emerald-200 dark:border-emerald-950 shadow-md">
        <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40">
          <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> 4. Kiểm tra & Phát hành
          </CardTitle>
          <CardDescription>
            Vui lòng kiểm tra lại toàn bộ thông tin trước khi phát hành hợp đồng.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Tiêu đề hợp đồng:</span>
              <span className="font-bold text-slate-900 dark:text-white">{title}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Nguồn phát sinh:</span>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Tạo thủ công
              </Badge>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Khách hàng:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedUser?.name || selectedUser?.username} ({selectedUser?.email})
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Xác thực eKYC:</span>
              {selectedUser?.isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <UserCheck className="w-3.5 h-3.5" /> Đã xác thực eKYC
                </span>
              ) : (
                <span className="text-xs text-amber-600">Chưa xác thực eKYC</span>
              )}
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Tổng giá trị hợp đồng:</span>
              <span className="text-base font-extrabold text-primary">
                {contractValue.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Trạng thái thanh toán:</span>
              <Badge
                variant="outline"
                className={
                  paymentStatus === "paid"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-amber-100 text-amber-800 border-amber-300"
                }
              >
                {paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
              </Badge>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Mã cây sâm gắn kết:</span>
              <span className="font-mono text-xs">
                {selectedTreeCode !== "none" ? selectedTreeCode : "Quản lý theo số lượng"}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Thời hạn hiệu lực:</span>
              <span className="font-semibold">
                {formatDateViDisplay(expiredAt)}
              </span>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Điều kiện phát hành:
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Khách hàng chủ hợp đồng đã được xác định hợp lệ ({selectedUser?.email}).</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Giá trị hợp đồng ({contractValue.toLocaleString("vi-VN")} đ) và ngày hiệu lực hợp lệ.</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mẫu hợp đồng đã sẵn sàng điền tự động.</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" onClick={onBackToStep3}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Xem lại nội dung
          </Button>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onSubmit("draft")}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-1.5" /> Lưu bản nháp
            </Button>
            <Button
              onClick={() => onSubmit("pending")}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
            >
              <Send className="w-4 h-4 mr-1.5" /> Phát hành hợp đồng
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
