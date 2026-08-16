"use client"

import React from "react"
import { ShieldCheck, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import type { ContractAmendment, EContract } from "@/types"

interface ContractDetailAmendmentsCardProps {
  contract: EContract
  apiUrl: string
  formatVND: (val: number) => string
  formatDateVi: (dateStr?: string | Date) => string
}

export function ContractDetailAmendmentsCard({
  contract,
  apiUrl,
  formatVND,
  formatDateVi,
}: ContractDetailAmendmentsCardProps) {
  const contractCode = contract.code || contract.contractCode || contract.contractNumber || contract.id

  return (
    <Card className="border-emerald-200/80 dark:border-emerald-900/60">
      <CardHeader className="pb-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-t-xl">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Phụ lục hợp đồng ({contract.amendments?.length || 0})
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          Lịch sử các lần gia hạn ủy quyền chăm sóc & bảo vệ cây sâm.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-3 space-y-3">
        {contract.amendments && contract.amendments.length > 0 ? (
          <div className="space-y-2.5">
            {contract.amendments.map((amd: ContractAmendment) => (
              <div
                key={amd.id || amd.amendmentNumber || "amd-entry"}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    {amd.amendmentNumber || amd.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      amd.status === "signed"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]"
                        : "bg-amber-100 text-amber-800 border-amber-300 text-[10px]"
                    }
                  >
                    {amd.status === "signed" ? "Đã ký số" : "Chờ ký"}
                  </Badge>
                </div>
                <div className="text-slate-600 dark:text-slate-400 space-y-0.5">
                  <p>
                    • Thời hạn:{" "}
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatDateVi(amd.previousExpiredAt)} &rarr;{" "}
                      {formatDateVi(amd.newExpiredAt)} {amd.extendedMonths ? `(+${amd.extendedMonths} tháng)` : ""}
                    </span>
                  </p>
                  <p>
                    • Phí dịch vụ chăm sóc:{" "}
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      {formatVND(amd.amendmentValue || 0)}
                    </span>
                  </p>
                  {amd.createdAt && (
                    <p className="text-[11px] text-muted-foreground">
                      • Ngày lập: {formatDateVi(amd.createdAt)}
                    </p>
                  )}
                  {amd.documentHash && (
                    <p className="text-[10px] font-mono text-slate-500 truncate" title={amd.documentHash}>
                      • SHA-256: {amd.documentHash.slice(0, 24)}...
                    </p>
                  )}
                </div>
                {amd.status === "signed" && (
                  <div className="pt-1 flex justify-end">
                    <a
                      href={`${apiUrl}/public/contracts/${contractCode}/amendments/${amd.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="h-6 text-[11px] px-2 text-emerald-700">
                        <FileDown className="w-3 h-3 mr-1" /> Tải PDF Phụ Lục
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
            Hợp đồng chưa có phụ lục gia hạn nào.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
