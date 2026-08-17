"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import type { LocaleType } from "@/types"

import { fetchApi } from "@/lib/api"
import { ensureLocalizedPathname } from "@/lib/i18n"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "@/providers/i18n-provider"

interface Garden {
  id: string
  code: string
  name: string
}

interface AddBedFormProps {
  gardens: Garden[]
  initialError?: string
}

export function AddBedForm({ gardens, initialError }: AddBedFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const locale = params.lang as LocaleType

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    gardenCode: gardens[0]?.code || "",
    ageYear: 1,
    treeCount: 50,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }))
  }

  const handleSelectGarden = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      gardenCode: code,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      setErrorMsg(t("validation.required"))
      return
    }
    if (!formData.gardenCode) {
      setErrorMsg(t("validation.required"))
      return
    }

    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi("/user/cultivation/beds", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          gardenCode: formData.gardenCode,
          ageYear: formData.ageYear,
          treeCount: formData.treeCount,
          metadata: {},
        }),
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(payload?.message || t("common.status.error"))
      } else {
        setSuccessMsg(t("common.status.success"))
        setTimeout(() => {
          router.push(ensureLocalizedPathname("/pages/beds", locale))
        }, 1500)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg(t("common.status.error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader>
          <CardTitle>{t("trees.gardens.addGarden")}</CardTitle>
          <CardDescription>
            {t("trees.gardens.dialogDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMsg && (
            <Alert className="mb-4 border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <AlertTitle>{t("common.status.success")}</AlertTitle>
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
          )}

          {errorMsg && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{t("common.status.error")}</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("trees.gardens.name")}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t("trees.gardens.name")}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gardenCode">{t("trees.gardens.location")}</Label>
              {gardens.length === 0 ? (
                <div className="text-sm text-red-500 font-semibold py-1">
                  {t("common.table.noResults")}
                </div>
              ) : (
                <Select
                  value={formData.gardenCode}
                  onValueChange={handleSelectGarden}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("trees.gardens.name")} />
                  </SelectTrigger>
                  <SelectContent>
                    {gardens.map((garden) => (
                      <SelectItem key={garden.code} value={garden.code}>
                        {garden.name} ({garden.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageYear">{t("trees.fields.ageYear")}</Label>
                <Input
                  id="ageYear"
                  name="ageYear"
                  type="number"
                  min={0}
                  value={formData.ageYear}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treeCount">{t("contracts.fields.tree")}</Label>
                <Input
                  id="treeCount"
                  name="treeCount"
                  type="number"
                  min={0}
                  value={formData.treeCount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(ensureLocalizedPathname("/pages/beds", locale))
                }
              >
                {t("common.actions.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={loading || gardens.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {loading ? t("common.table.loading") : t("common.actions.add")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
