"use client"

import { useEffect, useState } from "react"
import { Check, Info, Loader2, Save, Sliders } from "lucide-react"
import { useTranslation } from "@/providers/i18n-provider"

import { fetchApi } from "@/lib/api"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function GeneralSettingsManager() {
  const { t } = useTranslation()
  const [settingsList, setSettingsList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [successKey, setSuccessKey] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function loadSettings() {
      try {
        const res = await fetchApi("/admin/settings")
        if (res.ok) {
          const payload = await res.json()
          const items =
            payload.data?.items || payload.data || payload.items || []
          if (mounted) {
            setSettingsList(items)
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadSettings()
    return () => {
      mounted = false
    }
  }, [])

  const handleUpdate = async (key: string, value: string) => {
    setSavingKey(key)
    try {
      const res = await fetchApi(`/admin/settings/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      })
      if (res.ok) {
        setSuccessKey(key)
        setTimeout(() => setSuccessKey(null), 2500)
      }
    } catch {
      // Ignore
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Sliders className="w-6 h-6 text-emerald-600" />
          <span>{t("common.generalSettings.title")}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("common.generalSettings.subtitle")}
        </p>
      </div>

      <Card className="border-border shadow-xs rounded-2xl">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <span>{t("common.generalSettings.listTitle")}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("common.generalSettings.listDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {loading ? (
            <div className="py-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t("common.generalSettings.loadingParams")}</span>
            </div>
          ) : settingsList.length === 0 ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl text-xs text-muted-foreground font-medium text-center">
              {t("common.generalSettings.emptyParams")}
            </div>
          ) : (
            <div className="space-y-3">
              {settingsList.map((item) => (
                <div
                  key={item.key || item.id}
                  className="p-4 border border-border rounded-xl flex items-center justify-between gap-4 bg-card"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-foreground uppercase tracking-wider">
                      {item.key}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {item.description || t("common.generalSettings.defaultParamDesc")}
                    </p>
                    <p className="text-xs font-semibold text-emerald-600">
                      {t("common.generalSettings.currentValue", { value: item.value })}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleUpdate(item.key, item.value)}
                    disabled={savingKey === item.key}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer"
                  >
                    {savingKey === item.key ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : successKey === item.key ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t("common.generalSettings.infoNotice")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
