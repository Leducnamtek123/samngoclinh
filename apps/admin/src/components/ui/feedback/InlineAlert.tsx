"use client"

import * as React from "react"
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InlineAlertProps {
  type: "success" | "warning" | "error" | "info"
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  onClose?: () => void
  className?: string
}

const INLINE_ALERT_STYLES = {
  success: {
    wrapper:
      "bg-emerald-50 border-emerald-200/80 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-850/30",
    icon: <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    action: "text-emerald-700 hover:text-emerald-900 dark:text-emerald-300",
  },
  warning: {
    wrapper:
      "bg-amber-50 border-amber-200/80 text-amber-800 dark:bg-amber-950/20 dark:border-amber-850/30",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    action: "text-emerald-700 hover:text-emerald-900 dark:text-emerald-300",
  },
  error: {
    wrapper:
      "bg-red-50 border-red-200/80 text-red-800 dark:bg-red-950/20 dark:border-red-850/30",
    icon: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
    action: "text-red-700 hover:text-red-900 dark:text-red-300",
  },
  info: {
    wrapper:
      "bg-blue-50 border-blue-200/80 text-blue-800 dark:bg-blue-950/20 dark:border-blue-850/30",
    icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    action: "text-blue-700 hover:text-blue-900 dark:text-blue-300",
  },
}

export function InlineAlert({
  type,
  title,
  description,
  actionLabel,
  onAction,
  onClose,
  className,
}: InlineAlertProps) {
  const currentStyle = INLINE_ALERT_STYLES[type]

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 border rounded-xl shadow-sm transition-all duration-300",
        currentStyle.wrapper,
        className
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{currentStyle.icon}</div>
      <div className="flex-grow">
        <h4 className="font-semibold text-sm leading-snug">{title}</h4>
        {description && (
          <p className="mt-1 text-xs opacity-90 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {(actionLabel && onAction) || onClose ? (
        <div className="flex items-center gap-3 ml-auto flex-shrink-0">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className={cn(
                "text-xs font-bold uppercase tracking-wider hover:underline",
                currentStyle.action
              )}
            >
              {actionLabel}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="opacity-75 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
