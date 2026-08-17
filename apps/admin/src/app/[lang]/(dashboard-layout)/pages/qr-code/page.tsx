"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import {
  Calendar,
  Download,
  MapPin,
  QrCode,
  RefreshCw,
  Search,
  ShieldCheck,
  Sprout,
} from "lucide-react"

import { useApiQuery } from "@/hooks/use-api-query"
import { useTranslation } from "@/providers/i18n-provider"
import { Pagination } from "@/components/ui/app-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RoleGuard } from "@/components/guards/rbac-guard"
import { QRCodeSVG } from "qrcode.react"

interface TreeItem {
  id: string
  code: string
  name?: string
  age?: number | string
  gardenName?: string
  bedName?: string
  plantedAt?: string
  status?: string
  healthStatus?: string
  ageYears?: number
  garden?: { id: string; name: string }
  bed?: { id: string; code: string; name: string }
  owner?: { id: string; name: string; username: string }
  createdAt?: string
}

const getQrUrl = (tree: TreeItem) => {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://samngoclinh.vn"
  return `${baseUrl}/trace/${tree.code || tree.id}`
}

const formatDateVi = (dateStr?: string) => {
  if (!dateStr) return "-"
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return "-"
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return "-"
  }
}

export default function QrCodeTraceabilityPage() {
  const { t } = useTranslation()
  const [searchCode, setSearchCode] = useState("")
  const [selectedTree, setSelectedTree] = useState<TreeItem | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 10

  const { data: response, isLoading, refetch } = useApiQuery<
    TreeItem[] | { items?: TreeItem[]; data?: TreeItem[] }
  >(
    ["trees-traceability", page],
    `/admin/cultivation/trees?page=${page}&perPage=${perPage}`
  )

  const rawData = response?.data
  const treesList: TreeItem[] = Array.isArray(rawData)
    ? rawData
    : (rawData as { items?: TreeItem[]; data?: TreeItem[] })?.items ||
      (rawData as { items?: TreeItem[]; data?: TreeItem[] })?.data ||
      []
  const metadata = response?.metadata || null

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchCode) return
    const found = treesList.find(
      (t) =>
        t.code?.toLowerCase().includes(searchCode.toLowerCase()) ||
        t.id === searchCode
    )
    if (found) {
      setSelectedTree(found)
    } else {
      setSelectedTree(null)
      toast.error(t("common.notFound") || "Không tìm thấy cây sâm với mã này")
    }
  }

  const activeTree =
    selectedTree || (treesList.length > 0 ? treesList[0] : null)

  const downloadQr = () => {
    const svgElement = document.getElementById("qr-code-svg")
    if (!svgElement) return

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const URL = window.URL || window.webkitURL || window
    const blobURL = URL.createObjectURL(svgBlob)

    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 400
      canvas.height = 400
      const context = canvas.getContext("2d")
      if (context) {
        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, 400, 400)
        context.drawImage(image, 0, 0, 400, 400)
        const png = canvas.toDataURL("image/png")

        const downloadLink = document.createElement("a")
        downloadLink.href = png
        downloadLink.download = `QR-${activeTree?.code || "SAM"}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
    }
    image.src = blobURL
  }

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <QrCode className="w-6 h-6 text-emerald-600" />
              {t("qrCode.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("qrCode.subtitle")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />{" "}
            {t("common.actions.refresh")}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {t("qrCode.scanPrompt")}
            </CardTitle>
            <CardDescription>{t("common.actions.search")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
              <Input
                placeholder={t("common.actions.search")}
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <Search className="w-4 h-4" /> {t("common.actions.search")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {activeTree ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 flex flex-col items-center justify-center p-6 text-center bg-muted/20">
              <div className="p-4 bg-white rounded-xl shadow-md border mb-4">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={getQrUrl(activeTree)}
                  size={200}
                  level="H"
                  includeMargin={true}
                  fgColor="#047857"
                />
              </div>
              <Badge
                variant="outline"
                className="text-emerald-700 border-emerald-300 font-mono text-sm mb-2"
              >
                {activeTree.code || activeTree.id}
              </Badge>
              <p className="text-xs text-muted-foreground mb-4">
                {t("qrCode.scanPrompt")}
              </p>
              <Button
                variant="outline"
                className="gap-2 w-full"
                onClick={downloadQr}
              >
                <Download className="w-4 h-4" /> {t("common.actions.export")}{" "}
                PNG
              </Button>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  {t("qrCode.qrDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg bg-card">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />{" "}
                      {t("trees.fields.name")}
                    </span>
                    <p className="font-semibold mt-1 text-sm">
                      {activeTree.name || activeTree.code}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg bg-card">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />{" "}
                      {t("trees.fields.age")}
                    </span>
                    <p className="font-semibold mt-1 text-sm">
                      {activeTree.age ? `${activeTree.age} y` : "-"}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg bg-card sm:col-span-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />{" "}
                      {t("trees.fields.garden")} &amp; {t("trees.fields.bed")}
                    </span>
                    <p className="font-semibold mt-1 text-sm">
                      {activeTree.gardenName || "—"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <h4 className="font-semibold text-sm">
                    {t("qrCode.qrDetails")}
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center justify-between border-b pb-2">
                      <span>ID:</span>
                      <span className="font-mono text-foreground text-xs">
                        {activeTree.id}
                      </span>
                    </li>
                    <li className="flex items-center justify-between border-b pb-2">
                      <span>{t("trees.fields.plantedDate")}:</span>
                      <span className="font-medium text-foreground">
                        {formatDateVi(
                          activeTree.plantedAt || activeTree.createdAt
                        )}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>{t("users.fields.status")}:</span>
                      <Badge className="bg-emerald-600 text-white">
                        {activeTree.status || t("common.status.active")}
                      </Badge>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              {t("common.table.noResults")}
            </CardContent>
          </Card>
        )}

        {treesList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                {t("trees.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("trees.fields.code")}</TableHead>
                    <TableHead>{t("trees.fields.name")}</TableHead>
                    <TableHead>{t("users.fields.status")}</TableHead>
                    <TableHead className="text-right">
                      {t("common.actions.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treesList.map((tree) => (
                    <TableRow key={tree.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {tree.code || tree.id}
                      </TableCell>
                      <TableCell>{tree.name || tree.code || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-300"
                        >
                          {tree.status || t("common.status.active")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-700 hover:text-emerald-800"
                          onClick={() => setSelectedTree(tree)}
                        >
                          {t("common.actions.view")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                metadata={metadata}
                onPageChange={(p) => setPage(p)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </RoleGuard>
  )
}
