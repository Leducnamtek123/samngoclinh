"use client"

import React from "react"
import Image from "next/image"
import { ShieldCheck, Check, Copy, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContractDetailVerificationCardProps {
  contract: any
  meta: any
  isOrderSource: boolean
  isSigned: boolean
  documentHash: string
  copiedHash: boolean
  onCopyHash: () => void
}

export function ContractDetailVerificationCard({
  contract,
  meta,
  isOrderSource,
  isSigned,
  documentHash,
  copiedHash,
  onCopyHash,
}: ContractDetailVerificationCardProps) {
  return (
    <>
      {/* Lifecycle Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Tiến trình hợp đồng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-slate-950 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">Khởi tạo hợp đồng</h5>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(contract.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} •{" "}
                  {isOrderSource ? "Tự động sau thanh toán đơn hàng" : "Phát hành thủ công bởi Admin"}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-slate-950 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">Thông báo đến khách hàng</h5>
                <p className="text-[11px] text-muted-foreground">
                  Đã gửi email và hiển thị tại trang cá nhân khách hàng.
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full ring-4 ring-white dark:ring-slate-950 flex items-center justify-center ${
                  isSigned ? "bg-emerald-600" : "bg-amber-500"
                }`}
              >
                {isSigned ? <Check className="w-2.5 h-2.5 text-white" /> : <Clock className="w-2.5 h-2.5 text-white" />}
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                  {isSigned ? "Khách hàng đã ký điện tử" : "Chờ khách hàng ký"}
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  {isSigned && contract.signedAt
                    ? `${new Date(contract.signedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} (IP: ${meta?.signedIp || "127.0.0.1"})`
                    : "Đang chờ khách hàng xác nhận chữ ký trên Web/App."}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-950" />
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">Hết hạn hiệu lực pháp lý</h5>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(contract.expiredAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digital Verification & Hash */}
      <Card className="bg-slate-50/60 dark:bg-slate-900/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Chứng thực số
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Mã băm (SHA-256):</span>
            <div className="flex items-center gap-2 mt-1">
              <code className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 p-1.5 rounded break-all flex-1">
                {documentHash}
              </code>
              <Button variant="ghost" size="icon" onClick={onCopyHash} className="h-7 w-7">
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>

          {contract.signatureUrl && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-muted-foreground font-semibold block mb-1">
                Chữ ký điện tử:
              </span>
              <Image
                src={contract.signatureUrl}
                alt="Chữ ký khách hàng"
                width={160}
                height={48}
                className="h-12 w-auto object-contain mx-auto"
                unoptimized
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
