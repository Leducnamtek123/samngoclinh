"use client"

import * as React from "react"
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  CloudOff,
  Image as ImageIcon,
  Info,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  User,
  WifiOff,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { useTranslation } from "@/providers/i18n-provider"

// ==========================================
// 1. INLINE ALERT & BANNER
// ==========================================
interface InlineAlertProps {
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
    icon: (
      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    ),
    action: "text-emerald-700 hover:text-emerald-900 dark:text-emerald-300",
  },
  warning: {
    wrapper:
      "bg-amber-50 border-amber-200/80 text-amber-800 dark:bg-amber-950/20 dark:border-amber-850/30",
    icon: (
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
    ),
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
        "flex items-start gap-4 p-4 border rounded-xl shadow-sm transition-colors duration-300",
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
              aria-label="Đóng"
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

// ==========================================
// 2. TOAST NOTIFICATION CARD (Standalone)
// ==========================================
interface ToastCardProps {
  type: "success" | "error" | "info" | "warning"
  title: string
  description?: string
  timeString?: string
  onClose?: () => void
  className?: string
}

const TOAST_CARD_STYLES = {
  success: {
    bg: "bg-emerald-50/80 dark:bg-emerald-950/10",
    border: "border-emerald-200 dark:border-emerald-900/30",
    iconContainer:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  error: {
    bg: "bg-red-50/80 dark:bg-red-950/10",
    border: "border-red-200 dark:border-red-900/30",
    iconContainer:
      "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  warning: {
    bg: "bg-amber-50/80 dark:bg-amber-950/10",
    border: "border-amber-200 dark:border-amber-900/30",
    iconContainer:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  info: {
    bg: "bg-blue-50/80 dark:bg-blue-950/10",
    border: "border-blue-200 dark:border-blue-900/30",
    iconContainer:
      "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
    icon: <Info className="h-5 w-5" />,
  },
}

export function ToastCard({
  type,
  title,
  description,
  timeString,
  onClose,
  className,
}: ToastCardProps) {
  const { t } = useTranslation()
  const currentStyle = TOAST_CARD_STYLES[type]
  const rawJustNow = t("common.status.justNow")
  const displayTime =
    timeString ||
    (!rawJustNow || rawJustNow.includes(".") ? "Vừa xong" : rawJustNow)

  return (
    <div
      className={cn(
        "w-80 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 shadow-xl rounded-xl p-4 flex items-start gap-3 backdrop-blur-md transition-[transform,opacity,box-shadow] duration-300 hover:scale-[1.01]",
        currentStyle.bg,
        currentStyle.border,
        className
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
          currentStyle.iconContainer
        )}
      >
        {currentStyle.icon}
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
          {title}
        </p>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-normal">
            {description}
          </p>
        )}
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-none">
          {displayTime}
        </p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.actions.close")}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ==========================================
// 3. NOTIFICATION CENTER
// ==========================================
export interface NotificationItem {
  id: string
  title: string
  body: string
  type: "success" | "error" | "info" | "warning"
  isRead: boolean
  createdAt: string
}

interface NotificationCenterProps {
  notifications: NotificationItem[]
  onMarkAllAsRead?: () => void
  onClearAll?: () => void
  onNotificationClick?: (id: string) => void
  className?: string
}

export function NotificationCenter({
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  className,
}: NotificationCenterProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className="h-6 w-6 text-slate-600 dark:text-slate-350" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-[500px]">
          <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-850">
            <div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                {t("navigation.notifications.notifications")}
              </h3>
              <p className="text-xs text-slate-500">{unreadCount} unread</p>
            </div>
            <div className="flex gap-2">
              {onMarkAllAsRead && unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {t("common.actions.readAll") || "Read all"}
                </button>
              )}
              {onClearAll && notifications.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 hover:underline"
                >
                  {t("navigation.notifications.dismissAll")}
                </button>
              )}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
            {notifications.length === 0 ? (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center text-slate-400">
                <Bell className="h-12 w-12 mb-3 stroke-[1.5]" />
                <p className="text-sm font-medium">Không có thông báo nào</p>
                <p className="text-xs text-slate-500 mt-1">
                  Chúng tôi sẽ thông báo cho bạn khi có cập nhật mới.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const colors = {
                  success: "bg-emerald-500/10 text-emerald-600",
                  error: "bg-red-500/10 text-red-600",
                  warning: "bg-amber-500/10 text-amber-600",
                  info: "bg-blue-500/10 text-blue-600",
                }
                const icons = {
                  success: <CheckCircle className="h-4 w-4" />,
                  error: <AlertCircle className="h-4 w-4" />,
                  warning: <AlertTriangle className="h-4 w-4" />,
                  info: <Info className="h-4 w-4" />,
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onNotificationClick) onNotificationClick(item.id)
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        if (onNotificationClick) onNotificationClick(item.id)
                      }
                    }}
                    className={cn(
                      "p-4 flex gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors relative",
                      !item.isRead && "bg-emerald-50/20 dark:bg-emerald-950/5"
                    )}
                  >
                    {!item.isRead && (
                      <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    )}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        colors[item.type]
                      )}
                    >
                      {icons[item.type]}
                    </div>
                    <div className="flex-grow min-w-0 pr-4">
                      <p
                        className={cn(
                          "text-xs leading-snug text-slate-800 dark:text-slate-200",
                          !item.isRead ? "font-bold" : "font-medium"
                        )}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                        {item.body}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-none">
                        {item.createdAt}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 4. EMPTY STATE
// ==========================================
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center shadow-sm w-full max-w-lg mx-auto",
        className
      )}
    >
      <div className="w-20 h-20 mb-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
        {icon || <span className="text-4xl">📦</span>}
      </div>
      <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}

// ==========================================
// 5. EMPTY SEARCH RESULT
// ==========================================
interface EmptySearchResultProps {
  query?: string
  onClear?: () => void
  className?: string
}

export function EmptySearchResult({
  query,
  onClear,
  className,
}: EmptySearchResultProps) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center shadow-sm w-full max-w-lg mx-auto",
        className
      )}
    >
      <div className="w-20 h-20 mb-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
        <Search className="h-10 w-10 stroke-[1.5]" />
      </div>
      <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
        {t("search.noResults")}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm leading-relaxed">
        {query
          ? `No results found matching "${query}".`
          : t("common.table.noResults")}
      </p>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold text-sm"
        >
          {t("common.actions.reset")}
        </button>
      )}
    </div>
  )
}

interface ImagePlaceholderProps {
  className?: string
  showText?: boolean
}

export function ImagePlaceholder({
  className,
  showText = true,
}: ImagePlaceholderProps) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        "w-full h-full min-h-[120px] bg-slate-50 dark:bg-slate-850 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-350 dark:text-slate-500 p-4 gap-1.5",
        className
      )}
    >
      <ImageIcon className="h-6 w-6 stroke-[1.5] flex-shrink-0" />
      {showText && (
        <span className="text-[10px] uppercase font-bold tracking-widest leading-none text-center">
          {t("common.status.noImage") || "No image"}
        </span>
      )}
    </div>
  )
}

// ==========================================
// 7. AVATAR PLACEHOLDER
// ==========================================
interface AvatarPlaceholderProps {
  name?: string
  className?: string
}

export function AvatarPlaceholder({ name, className }: AvatarPlaceholderProps) {
  const initials = name ? getInitials(name) : ""

  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm tracking-wide shadow-sm flex-shrink-0",
        className
      )}
    >
      {initials ? initials : <User className="h-5 w-5" />}
    </div>
  )
}

// ==========================================
// 8. SKELETON LOADING
// ==========================================
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-100 dark:bg-slate-800",
        className
      )}
      {...props}
    />
  )
}

export function TableSkeleton({
  rows = 5,
  cols = 4,
}: {
  rows?: number
  cols?: number
}) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm">
      {/* Table Header */}
      <div
        className="bg-slate-50/80 dark:bg-slate-900/50 p-4 border-b border-slate-100 dark:border-slate-850 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4 w-3/4 bg-slate-200/80 dark:bg-slate-800"
          />
        ))}
      </div>
      {/* Table Rows */}
      <div className="p-4 flex flex-col gap-6">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid gap-4 items-center"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
              <Skeleton className="h-3 w-full" />
            </div>
            {Array.from({ length: cols - 1 }).map((_, c) => (
              <Skeleton
                key={c}
                className={cn("h-3", c === cols - 2 ? "w-1/2" : "w-3/4")}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
      <Skeleton className="w-full h-40 rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex gap-3 mt-2">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-full ml-auto" />
      </div>
    </div>
  )
}

// ==========================================
// 9. ERROR STATE
// ==========================================
interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title,
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  const { t } = useTranslation()
  const displayTitle = title || t("messages.errorOccurred")
  const displayDesc = description || t("messages.networkError")

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center shadow-sm w-full max-w-lg mx-auto",
        className
      )}
    >
      <div className="w-20 h-20 mb-6 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500">
        <CloudOff className="h-10 w-10 stroke-[1.5]" />
      </div>
      <h4 className="font-semibold text-lg text-red-600 dark:text-red-400 mb-2">
        {displayTitle}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm leading-relaxed">
        {displayDesc}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>{t("common.actions.refresh")}</span>
        </button>
      )}
    </div>
  )
}

// ==========================================
// 10. OFFLINE STATE
// ==========================================
interface OfflineStateProps {
  onReconnect?: () => void
  className?: string
}

export function OfflineState({ onReconnect, className }: OfflineStateProps) {
  const { t } = useTranslation()
  const [isOffline, setIsOffline] = React.useState(false)

  React.useEffect(() => {
    setIsOffline(!window.navigator.onLine)

    function handleOnline() {
      setIsOffline(false)
    }
    function handleOffline() {
      setIsOffline(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div
      className={cn(
        "bg-amber-50 border-y md:border border-amber-200/80 p-3.5 px-4 md:rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md text-amber-900 transition-colors duration-500 animate-slide-down",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0 animate-pulse">
          <WifiOff className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium leading-normal text-center sm:text-left">
          {t("messages.networkError")}
        </p>
      </div>
      {onReconnect && (
        <button
          type="button"
          onClick={onReconnect}
          className="text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-amber-950 dark:text-amber-400 hover:underline flex-shrink-0"
        >
          {t("common.actions.refresh")}
        </button>
      )}
    </div>
  )
}

// ==========================================
// 11. CONFIRMATION DIALOG (MODAL)
// ==========================================
interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  type?: "danger" | "primary"
  isLoading?: boolean
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  type = "primary",
  isLoading = false,
}: ConfirmationDialogProps) {
  const { t } = useTranslation()
  const displayConfirm = confirmLabel || t("common.actions.confirm")
  const displayCancel = cancelLabel || t("common.actions.cancel")

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        role="presentation"
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 z-10 animate-scale-up">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.actions.close")}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
              type === "danger"
                ? "bg-red-50 dark:bg-red-950/20 text-red-600"
                : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600"
            )}
          >
            {type === "danger" ? (
              <Trash2 className="h-6 w-6" />
            ) : (
              <AlertTriangle className="h-6 w-6" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 leading-snug">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2 rounded-lg font-semibold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 transition-colors disabled:opacity-50"
          >
            {displayCancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "px-5 py-2 rounded-lg font-semibold text-sm text-white transition-colors flex items-center gap-1.5 disabled:opacity-50",
              type === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-700 hover:bg-emerald-800"
            )}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{displayConfirm}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 12. PROGRESS INDICATORS
// ==========================================
interface ProgressIndicatorProps {
  progress?: number // 0 to 100
  label?: string
  isSyncing?: boolean
  className?: string
}

export function ProgressIndicator({
  progress,
  label,
  isSyncing = false,
  className,
}: ProgressIndicatorProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm w-full max-w-sm",
        className
      )}
    >
      {progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {label || "Đang tải tiến trình..."}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-[width] duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {isSyncing && (
        <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-xs font-semibold">
            {label || "Đang đồng bộ dữ liệu..."}
          </span>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 13. SUCCESS ANIMATION (SVG DRAWING)
// ==========================================
export function SuccessAnimation({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 gap-3",
        className
      )}
    >
      <div className="success-checkmark">
        <svg
          className="w-16 h-16 text-emerald-600 dark:text-emerald-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          viewBox="0 0 52 52"
        >
          <circle
            className="animate-success-circle"
            cx="26"
            cy="26"
            r="23"
            strokeDasharray="144"
            strokeDashoffset="144"
            fill="none"
          />
          <path
            className="animate-success-check"
            strokeDasharray="36"
            strokeDashoffset="36"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            fill="none"
          />
        </svg>
      </div>
      <style jsx global>{`
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
        .animate-success-circle {
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .animate-success-check {
          transform-origin: 50% 50%;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
        }
      `}</style>
    </div>
  )
}

const getInitials = (fullName: string) => {
  const parts = fullName.trim().split(" ")
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return fullName.substring(0, 2).toUpperCase()
}
