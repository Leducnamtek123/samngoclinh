"use client"

import { useState, useEffect } from "react"
import { Check, Loader2, Save, Coins, Info } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PointsSettingsManager() {
  const [pointRate, setPointRate] = useState<string>("10000")
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    let mounted = true
    async function loadSetting() {
      try {
        const res = await fetchApi("/settings/point_rate")
        if (res.ok) {
          const payload = await res.json()
          const val = payload.data?.value || payload.value
          if (mounted && val) {
            setPointRate(String(val))
          }
        }
      } catch {
        // Fall back gracefully
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
      const res = await fetchApi("/settings/point_rate", {
        method: "PUT",
        body: JSON.stringify({ value: String(pointRate || "10000") }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      // Handle gracefully
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Coins className="w-6 h-6 text-amber-500" />
          <span>Tỷ Lệ Quy Đổi Điểm Thưởng</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cấu hình giá trị VNĐ được khấu trừ khi người dùng sử dụng điểm tích lũy thanh toán đơn hàng.
        </p>
      </div>

      <Card className="border-border shadow-xs rounded-2xl">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Coins className="w-5 h-5 text-amber-500" />
            <span>Giá Trị Quy Đổi Điểm (Point Conversion Rate)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Số tiền VNĐ tương ứng với 1 điểm thưởng tích lũy trong ví thành viên.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-8 space-y-2">
              <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Giá trị 1 điểm (VNĐ)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  disabled={loading}
                  value={pointRate}
                  onChange={(e) => setPointRate(e.target.value)}
                  placeholder="10000"
                  className="rounded-xl font-bold text-amber-600 dark:text-amber-400 text-base"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                  VNĐ / Điểm
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
                    <span>Cập nhật tỷ lệ</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-300 font-medium">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Mỗi 1 điểm tích lũy khi đổi sẽ tương đương với <strong>{Number(pointRate || 0).toLocaleString("vi-VN")} đ</strong> giảm trừ trực tiếp vào tổng bill khi khách mua sắm.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
