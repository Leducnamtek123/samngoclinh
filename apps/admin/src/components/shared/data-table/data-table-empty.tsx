"use client"

import React from "react"

interface DataTableEmptyProps {
  message?: string
  description?: string
  children?: React.ReactNode
}

export function DataTableEmpty({
  message = "No data available",
  description,
  children,
}: DataTableEmptyProps) {
  return (
    <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl bg-muted/10">
      <p className="text-sm font-medium">{message}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
