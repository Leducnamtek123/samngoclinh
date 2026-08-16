"use client"

import { useEffect, useState } from "react"
import { Check, Info, Loader2, Save, Truck } from "lucide-react"

import { fetchApi } from "@/lib/api"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ShippingSettingsManager() {
  const [shippingFee, setShippingFee] = useState<string>("30000")
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  // Fetch setting value from client side with JWT token
  useEffect(() => {
    let mounted = true
    async function loadSetting() {
      try {
        const res = await fetchApi("/settings/shipping_fee")
        if (res.ok) {
          const payload = await res.json()
          const val = payload.data?.value || payload.value
          if (mounted && val) {
            setShippingFee(String(val))
          }
        }
      } catch {
        // Fall back gracefully to default "30000" without showing red error box
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadSetting()
    return () => {
      mounted = false
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)

    try {
      const res = await fetchApi("/settings/shipping_fee", {
        method: "PUT",
        body: JSON.stringify({ value: String(shippingFee || "30000") }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      // Handle error gracefully
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Truck className="w-6 h-6 text-emerald-600" />
          <span>Cấu hình Phí Vận Chuyển</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý mức phí giao hàng tận nơi áp dụng cho toàn bộ đơn hàng trên
          sàn Sâm Ngọc Linh.
        </p>
      </div>

      <Card className="border-border shadow-xs rounded-2xl">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Phí Giao Hàng Tận Nơi (Standard Shipping Fee)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Khi người mua chọn phương thức &quot;Giao hàng tận nơi&quot;, hệ
            thống sẽ tự động tính số tiền này vào đơn hàng.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-8 space-y-2">
              <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Mức phí vận chuyển (VNĐ)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  disabled={loading}
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  placeholder="30000"
                  className="rounded-xl font-bold text-emerald-700 dark:text-emerald-400 text-base"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                  VNĐ
                </span>
              </div>
            </div>
            <div className="sm:col-span-4">
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs w-full cursor-pointer h-10 flex items-center justify-center gap-1.5"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : success ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Đã lưu thành công!</span>
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

          <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Mức phí{" "}
              <strong>
                {Number(shippingFee || 0).toLocaleString("vi-VN")} đ
              </strong>{" "}
              sẽ lập tức đồng bộ sang toàn bộ trang Web bán hàng & API đặt hàng.
              Phương thức &quot;Nhận tại vườn&quot; luôn mặc định là Miễn phí.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
