"use client"

import { useState } from "react"
import { Check, Loader2, Save, Settings as SettingsIcon, Truck, Coins } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export interface SystemSettingItem {
  id?: string
  key: string
  value: string
  description?: string
}

interface SettingsManagerProps {
  initialSettings: SystemSettingItem[]
  errorMsg?: string
}

export function SettingsManager({ initialSettings, errorMsg }: SettingsManagerProps) {
  const [settings, setSettings] = useState<SystemSettingItem[]>(initialSettings)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [successKey, setSuccessKey] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(errorMsg || null)

  // Get value helper
  const getVal = (key: string, defaultVal: string) => {
    const item = settings.find((s) => s.key === key)
    return item ? item.value : defaultVal
  }

  // Update local state value helper
  const setVal = (key: string, value: string) => {
    setSettings((prev) => {
      const idx = prev.findIndex((s) => s.key === key)
      if (idx > -1) {
        const next = [...prev]
        next[idx] = { ...next[idx], value }
        return next
      }
      return [...prev, { key, value }]
    })
  }

  const handleSaveSetting = async (key: string) => {
    const val = getVal(key, "")
    setSavingKey(key)
    setErr(null)
    setSuccessKey(null)

    try {
      const res = await fetchApi(`/settings/${key}`, {
        method: "PUT",
        body: JSON.stringify({ value: String(val) }),
      })
      const payload = await res.json()

      if (!res.ok) {
        throw new Error(payload?.message || "Không thể cập nhật cài đặt")
      }

      setSuccessKey(key)
      setTimeout(() => setSuccessKey(null), 3000)
    } catch (e: any) {
      setErr(e?.message || "Lỗi cập nhật cấu hình hệ thống")
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-600" />
          <span>Cài đặt & Cấu hình Hệ thống</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý các cấu hình phí vận chuyển, tỷ lệ điểm thưởng và các tham số vận hành sàn Sâm Ngọc Linh.
        </p>
      </div>

      {err && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}

      {/* 1. Shipping Fee Config */}
      <Card className="border-border shadow-xs rounded-2xl">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Phí Vận Chuyển Giao Hàng (Shipping Fee)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Mức phí vận chuyển mặc định áp dụng cho tất cả các đơn hàng mua bán trên Web khi người dùng chọn phương thức &quot;Giao hàng tận nơi&quot;.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-8 space-y-2">
              <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Phí giao hàng (VNĐ)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={getVal("shipping_fee", "30000")}
                  onChange={(e) => setVal("shipping_fee", e.target.value)}
                  placeholder="30000"
                  className="rounded-xl font-bold text-emerald-700 dark:text-emerald-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                  VNĐ
                </span>
              </div>
            </div>
            <div className="sm:col-span-4 flex items-center gap-2">
              <Button
                type="button"
                onClick={() => handleSaveSetting("shipping_fee")}
                disabled={savingKey === "shipping_fee"}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs w-full cursor-pointer flex items-center justify-center gap-1.5"
              >
                {savingKey === "shipping_fee" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : successKey === "shipping_fee" ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Đã lưu!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Cập nhật phí</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Points Rate Config */}
      <Card className="border-border shadow-xs rounded-2xl">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Coins className="w-5 h-5 text-amber-500" />
            <span>Tỷ Lệ Quy Đổi Điểm Thưởng (Point Conversion Rate)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Giá trị VNĐ tương ứng với 1 điểm thưởng khi người dùng đổi điểm tích lũy để thanh toán đơn hàng.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-8 space-y-2">
              <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Giá trị 1 điểm tích lũy (VNĐ)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={getVal("point_rate", "10000")}
                  onChange={(e) => setVal("point_rate", e.target.value)}
                  placeholder="10000"
                  className="rounded-xl font-bold text-amber-600 dark:text-amber-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                  VNĐ / Điểm
                </span>
              </div>
            </div>
            <div className="sm:col-span-4 flex items-center gap-2">
              <Button
                type="button"
                onClick={() => handleSaveSetting("point_rate")}
                disabled={savingKey === "point_rate"}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs w-full cursor-pointer flex items-center justify-center gap-1.5"
              >
                {savingKey === "point_rate" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : successKey === "point_rate" ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Đã lưu!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Cập nhật tỷ lệ</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
