"use client"

import React from "react"
import { Building2, UserCheck } from "lucide-react"

import type { AdminUser, EContract } from "@/types"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContractDetailPartiesCardProps {
  contract: EContract
  user: AdminUser | null
  isEkyc: boolean
}

export function ContractDetailPartiesCard({
  contract,
  user,
  isEkyc,
}: ContractDetailPartiesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" /> Các bên tham gia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Bên A:
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {contract.partyA || "Công ty Cổ phần Sâm Ngọc Linh"}
          </span>
          <p className="text-xs text-muted-foreground">
            Vùng trồng sâm: Nam Trà My, Kon Tum
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Bên B:
          </span>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white">
              {user?.name ||
                (typeof contract.partyB === "object"
                  ? contract.partyB?.name
                  : contract.partyB) ||
                contract.customerName ||
                "Khách hàng"}
            </span>
            {isEkyc ? (
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 gap-1 text-[10px]">
                <UserCheck className="w-3 h-3" /> Đã xác thực eKYC
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-300 text-[10px]"
              >
                Chưa xác thực eKYC
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {user?.email || "Chưa có email"}
          </p>
          {user?.mobileNumbers?.[0]?.number && (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              SĐT:{" "}
              <span className="font-semibold">
                {user.mobileNumbers[0].number}
              </span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
