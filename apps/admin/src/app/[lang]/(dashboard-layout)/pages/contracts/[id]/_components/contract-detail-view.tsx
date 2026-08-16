"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  FileDown,
  QrCode,
  Bell,
  Trash2,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  Clock,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { fetchApi } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface ContractDetailViewProps {
  contract: any
  user: any
  lang: string
  errorMsg?: string
}

export function ContractDetailView({
  contract,
  user,
  lang,
  errorMsg,
}: ContractDetailViewProps) {
  const router = useRouter()
  const [copiedHash, setCopiedHash] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isSendingReminder, setIsSendingReminder] = useState(false)
  const [templateHtml, setTemplateHtml] = useState<string>("")
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<boolean>(true)

  React.useEffect(() => {
    async function loadDynamicTemplate() {
      try {
        const targetSlug = "hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
        const res = await fetchApi(`/public/contracts/templates/${targetSlug}`)
        const payload = await res.json()
        if (res.status < 400 && payload.data?.contentHtml) {
          setTemplateHtml(payload.data.contentHtml)
        }
      } catch (e) {
        console.warn("Could not load dynamic template:", e)
      } finally {
        setIsLoadingTemplate(false)
      }
    }
    loadDynamicTemplate()
  }, [])

  if (errorMsg || !contract) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Không tìm thấy hợp đồng</h2>
        <p className="text-muted-foreground">{errorMsg || "Hợp đồng không tồn tại hoặc đã bị xóa."}</p>
        <Link href={`/${lang}/pages/contracts`}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách hợp đồng
          </Button>
        </Link>
      </div>
    )
  }

  const meta = (contract.metadata || {}) as Record<string, any>
  const orderCode = meta.orderCode || (contract.code?.startsWith("CTR-") ? contract.code.replace("CTR-", "ORD-") : null)
  const isOrderSource = Boolean(meta.orderId || meta.orderCode || contract.contractType === "purchase_and_care")
  const isSigned = contract.status === "signed"
  const isEkyc = Boolean(user?.isVerified || meta.ekycVerified)
  const documentHash = meta.documentHash || "SHA256:d8a9f4e2b1c78e39021fa4b75c829103e2"
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  const pdfDownloadUrl = `${apiUrl}/public/contracts/${contract.code}/pdf`
  const traceUrl = `http://localhost:3002/trace/contract/${contract.code}`
  const formatVND = (val: number) => Number(val || 0).toLocaleString("vi-VN") + " VNĐ"

  const handleCopyHash = () => {
    navigator.clipboard.writeText(documentHash)
    setCopiedHash(true)
    toast.success("Đã sao chép mã băm SHA-256!")
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const handleSendReminder = async () => {
    setIsSendingReminder(true)
    try {
      const res = await fetchApi("/admin/contracts/check-expiry", { method: "POST" })
      if (res.status < 400) {
        toast.success(`Đã gửi thông báo nhắc nhở ký hợp đồng đến ${user?.email || "khách hàng"}.`)
      } else {
        toast.error("Không thể gửi thông báo lúc này.")
      }
    } catch {
      toast.error("Có lỗi xảy ra khi kết nối máy chủ.")
    } finally {
      setIsSendingReminder(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetchApi(`/admin/contracts/${contract.id}`, { method: "DELETE" })
      if (res.status < 400) {
        toast.success("Đã xóa hợp đồng thành công.")
        router.push(`/${lang}/pages/contracts`)
      } else {
        toast.error("Không thể xóa hợp đồng.")
      }
    } catch {
      toast.error("Lỗi khi kết nối máy chủ.")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const renderedContractHtml = React.useMemo(() => {
    // If contract.content is already a complete HTML document
    if (contract.content && (contract.content.includes("<!DOCTYPE") || contract.content.includes("<html"))) {
      return contract.content
    }

    if (!templateHtml) return ""

    const customerName = user?.name || contract.partyB || "Khách hàng"
    const cccd = user?.identityNumber || user?.cccd || meta.cccd || "Đã xác thực eKYC"
    const address = user?.address || meta.address || "Hải Châu, TP. Đà Nẵng"
    const phone = user?.mobileNumbers?.[0]?.number || user?.phone || meta.phone || "—"
    const email = user?.email || meta.email || "—"
    const contractCode = contract.code || "HĐ-SNL/2026/01"
    const treeCount = String(contract.items?.length || meta.totalPlants || 1)
    const treeCountWords = `${treeCount} cây sâm`
    const totalVal = formatVND(contract.contractValue || 0)
    const careFee = formatVND(Math.round((contract.contractValue || 0) * 0.1))
    const signDate = contract.signedAt
      ? new Date(contract.signedAt).toLocaleDateString("vi-VN")
      : new Date(contract.createdAt).toLocaleDateString("vi-VN")
    const expireDate = new Date(contract.expiredAt).toLocaleDateString("vi-VN")

    let result = templateHtml
      .replace(/\{\{TEN_KHACH_HANG\}\}/g, customerName)
      .replace(/\{\{CCCD_MST\}\}/g, cccd)
      .replace(/\{\{DIA_CHI\}\}/g, address)
      .replace(/\{\{SO_DIEN_THOAI\}\}/g, phone)
      .replace(/\{\{EMAIL\}\}/g, email)
      .replace(/\{\{MA_HOP_DONG\}\}/g, contractCode)
      .replace(/\{\{SO_LUONG_CAY\}\}/g, treeCount)
      .replace(/\{\{SO_LUONG_CAY_CHU\}\}/g, treeCountWords)
      .replace(/\{\{TONG_GIA_TRI\}\}/g, totalVal)
      .replace(/\{\{TONG_GIA_TRI_CHU\}\}/g, totalVal)
      .replace(/\{\{PHI_CHAM_SOC\}\}/g, careFee)
      .replace(/\{\{PHI_CHAM_SOC_CHU\}\}/g, careFee)
      .replace(/\{\{NGAY_KY\}\}/g, signDate)
      .replace(/\{\{NGAY_HET_HAN\}\}/g, expireDate)

    // Inject signature if available
    if (contract.signatureUrl) {
      result = result.replace(
        /Chờ khách hàng ký|Chờ ký/g,
        `<img src="${contract.signatureUrl}" alt="Chữ ký khách hàng" style="max-height: 48px; display: inline-block; object-fit: contain;" />`
      )
    }

    return result
  }, [contract, user, meta, templateHtml])

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <Link
            href={`/${lang}/pages/contracts`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Danh sách hợp đồng
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {contract.code}
            </h1>
            {isSigned ? (
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 font-semibold px-2.5 py-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã ký
              </Badge>
            ) : contract.status === "pending" ? (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 font-semibold px-2.5 py-0.5">
                <Clock className="w-3.5 h-3.5" /> Chờ khách ký
              </Badge>
            ) : contract.status === "expired" ? (
              <Badge variant="destructive">Đã hết hạn</Badge>
            ) : (
              <Badge variant="secondary">{contract.status}</Badge>
            )}

            {isOrderSource ? (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300">
                Đơn hàng {orderCode ? `#${orderCode}` : ""}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300">
                Tạo thủ công
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{contract.title}</p>
        </div>

        {/* Action Buttons based on status */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Public Verification */}
          <a
            href={traceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button variant="outline" size="sm" className="gap-1.5">
              <QrCode className="w-4 h-4 text-emerald-600" /> Tra cứu QR <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </Button>
          </a>

          {/* Download Signed PDF */}
          <a href={pdfDownloadUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900">
              <FileDown className="w-4 h-4" /> Tải bản PDF
            </Button>
          </a>

          {/* Send Reminder (Pending status only) */}
          {!isSigned && contract.status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendReminder}
              disabled={isSendingReminder}
              className="gap-1.5 text-amber-700 border-amber-300 hover:bg-amber-50"
            >
              <Bell className="w-4 h-4 text-amber-600" /> Gửi nhắc ký
            </Button>
          )}

          {/* Delete Button (Allowed for non-signed contracts only) */}
          {!isSigned && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata & Governance */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Parties */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Các bên tham gia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Bên A:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {contract.partyA || "Công ty Cổ phần Sâm Ngọc Linh"}
                </span>
                <p className="text-xs text-muted-foreground">Vùng trồng sâm: Nam Trà My, Kon Tum</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Bên B:
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {user?.name || contract.partyB || "Khách hàng"}
                  </span>
                  {isEkyc ? (
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 gap-1 text-[10px]">
                      <UserCheck className="w-3 h-3" /> Đã xác thực eKYC
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">
                      Chưa xác thực eKYC
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{user?.email || "Chưa có email"}</p>
                {user?.mobileNumbers?.[0]?.number && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    SĐT: <span className="font-semibold">{user.mobileNumbers[0].number}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Commercial Terms */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Thông tin hợp đồng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Giá trị hợp đồng:</span>
                <span className="font-extrabold text-primary text-base">
                  {formatVND(contract.contractValue)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Thanh toán:</span>
                <Badge
                  variant="outline"
                  className={
                    contract.paymentStatus === "paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
                      : "bg-amber-50 text-amber-700 border-amber-300 font-semibold"
                  }
                >
                  {contract.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Mã cây sâm:</span>
                <span className="font-mono font-semibold">
                  {contract.treeCode || (meta.totalPlants ? `${meta.totalPlants} cây sâm (Lô)` : "—")}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Ngày lập:</span>
                <span className="font-medium">
                  {new Date(contract.createdAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Thời hạn ban đầu:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {new Date(contract.expiredAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Hiệu lực hiện tại:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {new Date(contract.effectiveExpiredAt || contract.expiredAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2.5: Contract Amendments */}
          <Card className="border-emerald-200/80 dark:border-emerald-900/60">
            <CardHeader className="pb-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-t-xl">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Phụ lục hợp đồng ({contract.amendments?.length || 0})
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                Lịch sử các lần gia hạn ủy quyền chăm sóc & bảo vệ cây sâm.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3 space-y-3">
              {contract.amendments && contract.amendments.length > 0 ? (
                <div className="space-y-2.5">
                  {contract.amendments.map((amd: any, idx: number) => (
                    <div
                      key={amd.id || idx}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                          {amd.code}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            amd.status === "signed"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]"
                              : "bg-amber-100 text-amber-800 border-amber-300 text-[10px]"
                          }
                        >
                          {amd.status === "signed" ? "Đã ký số" : "Chờ ký"}
                        </Badge>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 space-y-0.5">
                        <p>
                          • Thời hạn:{" "}
                          <span className="font-medium text-slate-900 dark:text-white">
                            {new Date(amd.previousExpiredAt).toLocaleDateString("vi-VN")} &rarr;{" "}
                            {new Date(amd.newExpiredAt).toLocaleDateString("vi-VN")} (+{amd.extendedMonths} tháng)
                          </span>
                        </p>
                        <p>
                          • Phí dịch vụ chăm sóc:{" "}
                          <span className="font-semibold text-amber-700 dark:text-amber-400">
                            {formatVND(amd.amendmentValue || 0)}
                          </span>
                        </p>
                        {amd.signedAt && (
                          <p className="text-[11px] text-muted-foreground">
                            • Ký lúc: {new Date(amd.signedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                          </p>
                        )}
                        {amd.documentHash && (
                          <p className="text-[10px] font-mono text-slate-500 truncate" title={amd.documentHash}>
                            • SHA-256: {amd.documentHash.slice(0, 24)}...
                          </p>
                        )}
                      </div>
                      {amd.status === "signed" && (
                        <div className="pt-1 flex justify-end">
                          <a
                            href={`${apiUrl}/public/contracts/${contract.code}/amendments/${amd.code}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm" className="h-6 text-[11px] px-2 text-emerald-700">
                              <FileDown className="w-3 h-3 mr-1" /> Tải PDF Phụ Lục
                            </Button>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                  Hợp đồng chưa có phụ lục gia hạn nào.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Lifecycle Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Tiến trình hợp đồng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
                {/* Event 1: Created */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-slate-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Khởi tạo hợp đồng</h5>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(contract.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} •{" "}
                      {isOrderSource ? "Tự động sau thanh toán đơn hàng" : "Phát hành thủ công bởi Admin"}
                    </p>
                  </div>
                </div>

                {/* Event 2: Sent */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-slate-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Thông báo đến khách hàng</h5>
                    <p className="text-[11px] text-muted-foreground">
                      Đã gửi email và hiển thị tại trang cá nhân khách hàng.
                    </p>
                  </div>
                </div>

                {/* Event 3: Signed */}
                <div className="relative">
                  <div
                    className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full ring-4 ring-white dark:ring-slate-950 flex items-center justify-center ${
                      isSigned ? "bg-emerald-600" : "bg-amber-500"
                    }`}
                  >
                    {isSigned ? <Check className="w-2.5 h-2.5 text-white" /> : <Clock className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {isSigned ? "Khách hàng đã ký điện tử" : "Chờ khách hàng ký"}
                    </h5>
                    <p className="text-[11px] text-muted-foreground">
                      {isSigned && contract.signedAt
                        ? `${new Date(contract.signedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} (IP: ${meta.signedIp || "127.0.0.1"})`
                        : "Đang chờ khách hàng xác nhận chữ ký trên Web/App."}
                    </p>
                  </div>
                </div>

                {/* Event 4: Legal Expiry */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-950" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Hết hạn hiệu lực pháp lý</h5>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(contract.expiredAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Digital Verification & Hash */}
          <Card className="bg-slate-50/60 dark:bg-slate-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Chứng thực số
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Mã băm (SHA-256):</span>
                <div className="flex items-center gap-2 mt-1">
                  <code className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 p-1.5 rounded break-all flex-1">
                    {documentHash}
                  </code>
                  <Button variant="ghost" size="icon" onClick={handleCopyHash} className="h-7 w-7">
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>

              {contract.signatureUrl && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-white dark:bg-slate-900">
                  <span className="text-[10px] text-muted-foreground font-semibold block mb-1">
                    Chữ ký điện tử:
                  </span>
                  <img
                    src={contract.signatureUrl}
                    alt="Chữ ký khách hàng"
                    className="h-12 object-contain mx-auto"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Dynamic A4 Document Viewer */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Nội dung hợp đồng
            </span>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900/60 p-2 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
            {isLoadingTemplate && !renderedContractHtml ? (
              <div className="h-[750px] bg-white rounded-xl flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                <span>Đang tải nội dung văn bản hợp đồng...</span>
              </div>
            ) : (
              <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <iframe
                  title="Văn bản hợp đồng"
                  srcDoc={renderedContractHtml}
                  className="w-full h-[850px] min-h-[600px] border-0 bg-white"
                  sandbox="allow-same-origin"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hợp đồng này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn hợp đồng <strong>{contract.code}</strong> khỏi cơ sở dữ liệu. Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
