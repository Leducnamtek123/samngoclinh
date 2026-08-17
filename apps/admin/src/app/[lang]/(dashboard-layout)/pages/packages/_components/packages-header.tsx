"use client"

import React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface PackagesHeaderProps {
  onOpenCreate: () => void
}

export function PackagesHeader({ onOpenCreate }: PackagesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý Gói dịch vụ
        </h1>
        <p className="text-muted-foreground">
          Cấu hình các gói chăm sóc định kỳ và bảo hiểm/bảo vệ cây giống sâm.
        </p>
      </div>
      <Button
        onClick={onOpenCreate}
        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
      >
        <Plus className="h-4 w-4" /> Thêm gói mới
      </Button>
    </div>
  )
}
