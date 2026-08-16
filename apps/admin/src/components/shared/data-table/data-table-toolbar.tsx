"use client"

import React from "react"
import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FilterOption {
  label: string
  value: string
}

interface DataTableToolbarProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  statusValue?: string
  onStatusChange?: (value: string) => void
  statusOptions?: FilterOption[]
  statusPlaceholder?: string
  onReset?: () => void
  actionsSlot?: React.ReactNode
  extraFiltersSlot?: React.ReactNode
}

export function DataTableToolbar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  statusOptions,
  statusPlaceholder = "Filter status",
  onReset,
  actionsSlot,
  extraFiltersSlot,
}: DataTableToolbarProps) {
  const hasFilters = Boolean(
    searchValue || (statusValue && statusValue !== "all")
  )

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto flex-1">
        {onSearchChange && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 text-sm pl-9 bg-background border border-input"
            />
          </div>
        )}

        {statusOptions && onStatusChange && (
          <div className="w-full sm:w-48">
            <Select value={statusValue || "all"} onValueChange={onStatusChange}>
              <SelectTrigger className="h-10 text-sm bg-background border border-input">
                <SelectValue placeholder={statusPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {extraFiltersSlot}

        {hasFilters && onReset && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-10 px-2 lg:px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      {actionsSlot && <div className="w-full sm:w-auto">{actionsSlot}</div>}
    </div>
  )
}
