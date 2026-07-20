import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

export function TableSkeleton({ cols = 5, rows = 5 }: { cols?: number; rows?: number }) {
  return (
    <div className="space-y-4 w-full animate-pulse">
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/40" />
          <div className="w-full h-10 bg-muted/40 border border-border/60 rounded-lg" />
        </div>
        <div className="w-full sm:w-48 h-10 bg-muted/40 border border-border/60 rounded-lg" />
      </div>

      {/* Table grid wrapper */}
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-xs">
        {/* Header */}
        <div className="bg-muted/50 border-b border-border p-4 flex justify-between gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 max-w-[120px]" />
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="p-4 flex justify-between gap-4 items-center">
              <Skeleton className="h-4 flex-1 max-w-[150px] font-medium" />
              <Skeleton className="h-4 flex-1 max-w-[120px]" />
              <Skeleton className="h-4 flex-1 max-w-[80px]" />
              <Skeleton className="h-4 flex-1 max-w-[100px]" />
              <div className="flex justify-end gap-2 flex-1 max-w-[100px]">
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" disabled className="h-8 text-xs flex items-center gap-1 opacity-50">
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Trước</span>
            </Button>
            <Button variant="outline" size="sm" disabled className="h-8 text-xs flex items-center gap-1 opacity-50">
              <span>Kế tiếp</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BedsSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)] min-h-[700px] overflow-hidden bg-slate-50/50 dark:bg-slate-950 p-2 rounded-2xl">
      {/* Left Sidebar Skeleton */}
      <div className="w-full lg:w-72 bg-card border border-border rounded-2xl flex flex-col h-full overflow-hidden p-4 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-7 w-14 rounded-md" />
        </div>
        <div className="relative">
          <div className="w-full h-9 bg-muted/40 border border-border/60 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex-1 space-y-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border border-border/60 rounded-xl space-y-3 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Grid Area Skeleton */}
      <div className="flex-1 bg-card border border-border rounded-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>
        {/* Canvas body */}
        <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-950/20 flex items-center justify-center">
          <div className="p-12 bg-card border border-border/85 rounded-2xl grid grid-cols-8 gap-2 w-max">
            {Array.from({ length: 48 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DetailsSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto p-4 md:p-6 animate-pulse">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <Skeleton className="h-4 w-32 font-bold" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
