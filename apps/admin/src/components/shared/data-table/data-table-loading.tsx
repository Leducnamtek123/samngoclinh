"use client"

import React from "react"
import { TableSkeleton } from "@/components/ui/loading-skeletons"

interface DataTableLoadingProps {
  cols?: number
  rows?: number
}

export function DataTableLoading({ cols = 6, rows = 5 }: DataTableLoadingProps) {
  return <TableSkeleton cols={cols} rows={rows} />
}
