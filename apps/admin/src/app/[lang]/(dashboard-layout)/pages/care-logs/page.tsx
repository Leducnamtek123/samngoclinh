"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Droplets, Plus, RefreshCw, Sprout, Thermometer } from "lucide-react"

import { useApiMutation } from "@/hooks/use-api-mutation"
import { useApiQuery } from "@/hooks/use-api-query"
import { Pagination } from "@/components/ui/app-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { RoleGuard } from "@/components/guards/rbac-guard"
import { useTranslation } from "@/providers/i18n-provider"
import type { PaginationMeta } from "@/types"

interface CareLog {
  id: string
  gardenId?: string
  gardenName?: string
  bedCode?: string
  treeCode?: string
  activityType?: string
  action?: string
  description?: string
  notes?: string
  temperature?: number
  humidity?: number
  createdAt: string
  performedBy?: string
}

const formatDateTimeVi = (dateStr?: string) => {
  if (!dateStr) return "—"
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return "—"
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, "0")
    const minutes = String(d.getMinutes()).padStart(2, "0")
    return `${hours}:${minutes} ${day}/${month}/${year}`
  } catch {
    return "—"
  }
}

export default function CareLogsPage() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    treeCode: "",
    bedCode: "",
    action: "",
    description: "",
    temperature: "22",
    humidity: "85",
  })

  const [page, setPage] = useState(1)
  const perPage = 10

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useApiQuery<CareLog[] | { items: CareLog[]; metadata?: PaginationMeta }>(
    ["care-logs", page],
    `/user/cultivation/logs?page=${page}&perPage=${perPage}`
  )

  const mutation = useApiMutation()

  const rawData = response?.data
  const careLogs: CareLog[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray((rawData as { items?: CareLog[] })?.items)
      ? (rawData as { items: CareLog[] }).items
      : []
  const metadata = response?.metadata || (rawData as { metadata?: PaginationMeta })?.metadata || null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mutation.isPending) return
    try {
      await mutation.mutateAsync({
        endpoint: "/user/cultivation/logs",
        data: {
          ...formData,
          action: formData.action || t("trees.careLogs.activity"),
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
        },
        method: "POST",
      })
      toast.success(t("trees.careLogs.submitSuccess"))
      setIsOpen(false)
      refetch()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("trees.careLogs.submitError")
      toast.error(message)
    }
  }

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sprout className="w-6 h-6 text-emerald-600" />
              {t("trees.careLogs.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("trees.careLogs.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" /> {t("common.actions.refresh")}
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Plus className="w-4 h-4" /> {t("trees.careLogs.newLog")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t("trees.careLogs.newLog")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t("trees.careLogs.treeCode")}</Label>
                      <Input
                        placeholder="VD: TREE-001"
                        value={formData.treeCode}
                        onChange={(e) =>
                          setFormData({ ...formData, treeCode: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>{t("trees.careLogs.bedCode")}</Label>
                      <Input
                        placeholder="VD: BED-01"
                        value={formData.bedCode}
                        onChange={(e) =>
                          setFormData({ ...formData, bedCode: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>{t("trees.careLogs.action")}</Label>
                    <Input
                      placeholder={t("trees.careLogs.action")}
                      value={formData.action}
                      onChange={(e) =>
                        setFormData({ ...formData, action: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t("trees.careLogs.temperature")}</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            temperature: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>{t("trees.careLogs.humidity")}</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.humidity}
                        onChange={(e) =>
                          setFormData({ ...formData, humidity: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>{t("trees.careLogs.description")}</Label>
                    <Textarea
                      placeholder={t("trees.careLogs.description")}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("common.actions.cancel")}
                    </Button>
                    <Button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? t("common.status.processing") : t("common.actions.save")}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {t("trees.careLogs.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {t("common.table.loading")}
              </div>
            ) : isError ? (
              <div className="py-8 text-center text-sm text-destructive">
                {t("common.status.error")}
              </div>
            ) : careLogs.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {t("common.table.noResults")}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("trees.careLogs.treeCode")} / {t("trees.careLogs.bedCode")}</TableHead>
                      <TableHead>{t("trees.careLogs.activity")}</TableHead>
                      <TableHead>{t("trees.careLogs.temperature")} & {t("trees.careLogs.humidity")}</TableHead>
                      <TableHead>{t("trees.careLogs.description")}</TableHead>
                      <TableHead>{t("trees.careLogs.date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {careLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.treeCode ||
                            log.bedCode ||
                            log.gardenName ||
                            log.id}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-800 border-emerald-200"
                          >
                            {log.action ||
                              log.activityType ||
                              "Chăm sóc"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {log.temperature && (
                              <span className="flex items-center gap-1">
                                <Thermometer className="w-3.5 h-3.5 text-amber-500" />{" "}
                                {log.temperature}°C
                              </span>
                            )}
                            {log.humidity && (
                              <span className="flex items-center gap-1">
                                <Droplets className="w-3.5 h-3.5 text-blue-500" />{" "}
                                {log.humidity}%
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md text-sm">
                          {log.description || log.notes || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDateTimeVi(log.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  metadata={metadata}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
