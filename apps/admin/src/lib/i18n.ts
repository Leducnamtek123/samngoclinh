import type { LocaleType } from "@/types"
import type { NextRequest } from "next/server"

import { i18n } from "@/configs/i18n"
import { ensureWithPrefix } from "@/lib/utils"

export function isPathnameMissingLocale(pathname: string) {
  return !i18n.locales.some((locale) => pathname.startsWith(`/${locale}`))
}

export function getLocaleFromPathname(pathname: string) {
  return i18n.locales.find((locale) => pathname.startsWith(`/${locale}`))
}

export function ensureLocalizedPathname(pathname: string, locale: string) {
  // Ensure both pathname and locale are provided
  if (!pathname || !locale)
    throw new Error("Pathname or Locale cannot be empty")

  // Add the locale prefix to the pathname if it is missing, otherwise return the original pathname
  return isPathnameMissingLocale(pathname)
    ? `${ensureWithPrefix(locale, "/")}${ensureWithPrefix(pathname, "/")}`
    : pathname
}

export function relocalizePathname(pathname: string, locale: string) {
  // Ensure both pathname and locale are provided
  if (!pathname || !locale)
    throw new Error("Pathname or Locale cannot be empty")

  const segments = pathname.split("/")
  segments[1] = locale

  return segments.join("/")
}

export function getPreferredLocale(request: NextRequest) {
  const settingsCookie = request.cookies.get("settings")?.value
  try {
    const parsedSettingsCookie = settingsCookie && JSON.parse(settingsCookie)

    // Return locale from settings cookie if available
    if (parsedSettingsCookie?.locale) {
      return parsedSettingsCookie.locale as LocaleType
    }
  } catch (error) {
    console.error("Failed to parse settings cookie", error)
  }

  return i18n.defaultLocale as LocaleType
}

export function getNestedValue(
  obj: Record<string, unknown> | unknown,
  path: string
): unknown {
  if (!obj || !path) return undefined
  const keys = path.split(".")
  let current: unknown = obj
  for (const key of keys) {
    if (
      current &&
      typeof current === "object" &&
      key in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return current
}

const FALLBACK_TRANSLATIONS: Record<string, string> = {
  "common.status.justNow": "Vừa xong",
  "common.status.noImage": "Không có hình ảnh",
  "common.status.success": "Thành công",
  "common.status.error": "Lỗi",
  "common.status.pending": "Chờ thanh toán",
  "common.status.active": "Đang hoạt động",
  "common.status.completed": "Hoàn thành",
  "common.status.cancelled": "Đã hủy",
  "common.status.all": "Tất cả trạng thái",
  "common.actions.close": "Đóng",
  "common.actions.refresh": "Làm mới",
  "common.actions.confirm": "Xác nhận",
  "common.actions.cancel": "Hủy",
  "common.table.noResults": "Không tìm thấy dữ liệu.",
  "messages.errorOccurred": "Lỗi xảy ra",
  "messages.networkError": "Lỗi máy chủ nội bộ",
}

export function translate(
  dictionary: Record<string, unknown> | unknown,
  key: string,
  params?: Record<string, string | number>
): string {
  let val = getNestedValue(dictionary, key)
  if (typeof val !== "string" && dictionary && typeof dictionary === "object") {
    val = (dictionary as Record<string, unknown>)[key]
  }
  if (typeof val !== "string") {
    val = FALLBACK_TRANSLATIONS[key] || key
  }
  if (typeof val !== "string") return String(key)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      val = (val as string).replace(new RegExp(`\\{${k}\\}`, "g"), String(v))
    })
  }
  return val
}

export function createTranslator(
  dictionary: Record<string, unknown> | unknown
) {
  return (key: string, params?: Record<string, string | number>): string =>
    translate(dictionary, key, params)
}
