"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export type StatusDomain =
  | "user"
  | "order"
  | "tree"
  | "garden"
  | "bed"
  | "general"

interface StatusConfig {
  labelKey?: string
  defaultLabel: string
  className: string
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const STATUS_MAP: Record<string, StatusConfig> = {
  // User statuses
  active: {
    defaultLabel: "Active",
    className: "bg-emerald-500/10 text-emerald-600 border-transparent font-semibold",
    variant: "outline",
  },
  inactive: {
    defaultLabel: "Inactive",
    className: "bg-slate-500/10 text-slate-600 border-transparent font-semibold",
    variant: "outline",
  },
  blocked: {
    defaultLabel: "Blocked",
    className: "bg-red-500/10 text-red-600 border-transparent font-semibold",
    variant: "outline",
  },
  verified: {
    defaultLabel: "Verified",
    className: "bg-emerald-500/10 text-emerald-600 border-transparent",
    variant: "default",
  },
  unverified: {
    defaultLabel: "Unverified",
    className: "text-slate-500",
    variant: "outline",
  },

  // Order statuses
  pending: {
    defaultLabel: "Pending",
    className: "bg-amber-500/10 text-amber-700 border-amber-300 font-semibold",
    variant: "outline",
  },
  processing: {
    defaultLabel: "Processing",
    className: "bg-amber-500/10 text-amber-700 border-amber-300 font-semibold",
    variant: "outline",
  },
  paid: {
    defaultLabel: "Paid",
    className: "bg-blue-500/10 text-blue-700 border-blue-300 font-semibold",
    variant: "outline",
  },
  shipping: {
    defaultLabel: "Shipping",
    className: "bg-blue-500/10 text-blue-700 border-blue-300 font-semibold",
    variant: "outline",
  },
  completed: {
    defaultLabel: "Completed",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-300 font-semibold",
    variant: "outline",
  },
  cancelled: {
    defaultLabel: "Cancelled",
    className: "bg-red-500/10 text-red-700 border-red-300 font-semibold",
    variant: "outline",
  },

  // Tree & Plant statuses
  planted: {
    defaultLabel: "Planted",
    className: "bg-blue-500/10 text-blue-600 border-transparent font-semibold",
    variant: "outline",
  },
  growing: {
    defaultLabel: "Growing",
    className: "bg-emerald-500/10 text-emerald-600 border-transparent font-semibold",
    variant: "outline",
  },
  available: {
    defaultLabel: "Available",
    className: "bg-emerald-500/10 text-emerald-600 border-transparent font-semibold",
    variant: "outline",
  },
  harvested: {
    defaultLabel: "Harvested",
    className: "bg-purple-500/10 text-purple-600 border-transparent font-semibold",
    variant: "outline",
  },
  sold: {
    defaultLabel: "Sold",
    className: "bg-slate-500/10 text-slate-600 border-transparent font-semibold",
    variant: "outline",
  },

  // Health statuses
  healthy: {
    defaultLabel: "Healthy",
    className: "bg-emerald-500/10 text-emerald-600 border-transparent font-semibold",
    variant: "outline",
  },
  warning: {
    defaultLabel: "Warning",
    className: "bg-amber-500/10 text-amber-600 border-transparent font-semibold",
    variant: "outline",
  },
  sick: {
    defaultLabel: "Sick",
    className: "bg-red-500/10 text-red-600 border-transparent font-semibold",
    variant: "outline",
  },
  recovering: {
    defaultLabel: "Recovering",
    className: "bg-blue-500/10 text-blue-600 border-transparent font-semibold",
    variant: "outline",
  },

  // Bed/Garden statuses
  empty: {
    defaultLabel: "Empty",
    className: "bg-slate-500/10 text-slate-600 border-transparent font-semibold",
    variant: "outline",
  },
  full: {
    defaultLabel: "Full",
    className: "bg-emerald-500/10 text-emerald-600 border-transparent font-semibold",
    variant: "outline",
  },
  maintenance: {
    defaultLabel: "Maintenance",
    className: "bg-amber-500/10 text-amber-600 border-transparent font-semibold",
    variant: "outline",
  },
}

interface StatusBadgeProps {
  status: string
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const normalizedKey = (status || "").toLowerCase().trim()
  const config = STATUS_MAP[normalizedKey] || {
    defaultLabel: status || "Unknown",
    className: "bg-slate-500/10 text-slate-600 border-transparent font-semibold",
    variant: "outline" as const,
  }

  const displayLabel = label || config.defaultLabel

  return (
    <Badge
      variant={config.variant || "outline"}
      className={`${config.className} ${className}`.trim()}
    >
      {displayLabel}
    </Badge>
  )
}
