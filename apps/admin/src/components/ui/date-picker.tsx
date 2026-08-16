"use client"

import { useState } from "react"
import { format, isValid, parseISO } from "date-fns"
import { vi } from "date-fns/locale/vi"
import { enUS } from "date-fns/locale/en-US"
import { CalendarIcon, X } from "lucide-react"
import { useParams } from "next/navigation"

import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = Omit<
  ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect"
> & {
  value?: Date | string | null
  onValueChange?: (date?: Date) => void
  onChangeStr?: (dateStr: string) => void
  formatStr?: string
  popoverContentClassName?: string
  popoverContentOptions?: ComponentProps<typeof PopoverContent>
  buttonClassName?: string
  buttonOptions?: ComponentProps<typeof Button>
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
}

function parseDateValue(value?: Date | string | null): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) {
    return isValid(value) ? value : undefined
  }
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return undefined
    // Try ISO parse first
    const isoDate = parseISO(trimmed)
    if (isValid(isoDate)) return isoDate
    const nativeDate = new Date(trimmed)
    if (isValid(nativeDate)) return nativeDate
  }
  return undefined
}

export function DatePicker({
  value,
  onValueChange,
  onChangeStr,
  formatStr = "dd/MM/yyyy",
  popoverContentClassName,
  popoverContentOptions,
  buttonClassName,
  buttonOptions,
  placeholder,
  clearable = false,
  disabled = false,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const params = useParams()
  const lang = (params?.lang as string) || "vi"
  const activeLocale = lang === "en" ? enUS : vi
  const defaultPlaceholder = lang === "en" ? "Select date" : "Chọn ngày"

  const parsedDate = parseDateValue(value)

  const handleSelect = (date?: Date) => {
    onValueChange?.(date)
    if (onChangeStr) {
      onChangeStr(date && isValid(date) ? format(date, "yyyy-MM-dd") : "")
    }
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange?.(undefined)
    onChangeStr?.("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full px-3 text-start font-normal justify-between border-input bg-background hover:bg-accent/50",
            !parsedDate && "text-muted-foreground",
            buttonClassName
          )}
          {...buttonOptions}
        >
          <span className="truncate">
            {parsedDate
              ? format(parsedDate, formatStr, { locale: activeLocale })
              : placeholder || defaultPlaceholder}
          </span>
          <div className="flex items-center gap-1 shrink-0 ms-2">
            {clearable && parsedDate && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="hover:text-foreground text-muted-foreground p-0.5 rounded-sm"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-0 z-50", popoverContentClassName)}
        align="start"
        {...popoverContentOptions}
      >
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={handleSelect}
          locale={activeLocale}
          initialFocus
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}

