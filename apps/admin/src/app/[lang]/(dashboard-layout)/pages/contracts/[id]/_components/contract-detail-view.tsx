"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
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
import { ContractDetailHeader } from "./contract-detail-header"
import { ContractDetailMetadata } from "./contract-detail-metadata"
import { ContractDetailViewer } from "./contract-detail-viewer"

import type { AdminUser, EContract } from "@/types"

interface ContractDetailViewProps {
  contract: EContract | null
  user: AdminUser | null
  lang?: string
  errorMsg?: string
}

const formatVND = (val: number) => Number(val || 0).toLocaleString("vi-VN") + " VNĐ"

const formatDateVi = (dateStr?: string | Date) => {
  if (!dateStr) return "—"
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return "—"
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return "—"
  }
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

  const renderedContractHtml = React.useMemo(() => {
    if (!contract) return ""

    const contractHtml = contract.contentHtml || contract.content
    if (
      contractHtml &&
      (contractHtml.includes("<!DOCTYPE") ||
        contractHtml.includes("<html") ||
        contractHtml.length > 100)
    ) {
      let content = contractHtml
      if (contract.signatureUrl) {
        content = content.replace(
          /Chờ khách hàng ký|Chờ ký/g,
          `<img src="${contract.signatureUrl}" alt="Chữ ký khách hàng" style="max-height: 48px; display: inline-block; object-fit: contain;" />`
        )
      }
      return content
    }

    if (!templateHtml) return ""

    const contractMeta = (contract.metadata || {}) as Record<string, unknown>
    const customerName = user?.name || contract.customerName || contract.userName || "Khách hàng"
    const cccd = user?.identityNumber || user?.cccd || (contractMeta.cccd as string) || "Đã xác thực eKYC"
    const address = user?.address || (contractMeta.address as string) || "Hải Châu, TP. Đà Nẵng"
    const phone = user?.mobileNumbers?.[0]?.number || user?.phone || user?.phoneNumber || (contractMeta.phone as string) || "—"
    const email = user?.email || (contractMeta.email as string) || "—"
    const contractCode = contract.code || contract.contractCode || contract.contractNumber || "HĐ-SNL/2026/01"
    const treeCount = String(contract.items?.length || (contractMeta.totalPlants as number) || 1)
    const treeCountWords = `${treeCount} cây sâm`
    const totalVal = formatVND(contract.totalValue || contract.contractValue || 0)
    const careFee = contractMeta.careFee
      ? formatVND(contractMeta.careFee as number)
      : formatVND(Math.round((contract.totalValue || contract.contractValue || 0) * 0.1))
    const signDate = contract.signedAt
      ? formatDateVi(contract.signedAt)
      : formatDateVi(contract.createdAt || "")
    const expireDate = formatDateVi(contract.expiresAt || contract.expiredAt || "")

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

    if (contract.signatureUrl) {
      result = result.replace(
        /Chờ khách hàng ký|Chờ ký/g,
        `<img src="${contract.signatureUrl}" alt="Chữ ký khách hàng" style="max-height: 48px; display: inline-block; object-fit: contain;" />`
      )
    }

    return result
  }, [contract, user, templateHtml])

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

  const meta = (contract.metadata || {}) as Record<string, unknown>
  const contractCode = contract.code || contract.contractCode || contract.contractNumber || ""
  const orderCode =
    (meta.orderCode as string) ||
    (contractCode.startsWith("CTR-") ? contractCode.replace("CTR-", "ORD-") : null)
  const isOrderSource = Boolean(
    meta.orderId || meta.orderCode || contract.contractType === "purchase_and_care"
  )
  const isSigned = contract.status === "signed"
  const isEkyc = Boolean(user?.isVerified || meta.ekycVerified)
  const documentHash =
    (meta.documentHash as string) ||
    contract.hash ||
    "SHA256:d8a9f4e2b1c78e39021fa4b75c829103e2"
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3002"
  const pdfDownloadUrl = `${apiUrl}/public/contracts/${contractCode}/pdf`
  const traceUrl = `${webUrl}/trace/contract/${contractCode}`

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

  return (
    <div className="space-y-6 pb-12">
      <ContractDetailHeader
        contract={contract}
        lang={lang || "vi"}
        isSigned={isSigned}
        isOrderSource={isOrderSource}
        orderCode={orderCode || undefined}
        traceUrl={traceUrl}
        pdfDownloadUrl={pdfDownloadUrl}
        isSendingReminder={isSendingReminder}
        onSendReminder={handleSendReminder}
        onDeleteClick={() => setShowDeleteConfirm(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <ContractDetailMetadata
            contract={contract}
            user={user}
            meta={meta}
            isEkyc={isEkyc}
            isSigned={isSigned}
            isOrderSource={isOrderSource}
            apiUrl={apiUrl}
            documentHash={documentHash}
            copiedHash={copiedHash}
            onCopyHash={handleCopyHash}
            formatVND={formatVND}
            formatDateVi={formatDateVi}
          />
        </div>

        <div className="lg:col-span-7">
          <ContractDetailViewer
            isLoadingTemplate={isLoadingTemplate}
            renderedContractHtml={renderedContractHtml}
          />
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hợp đồng này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn hợp đồng <strong>{contractCode}</strong> khỏi cơ sở dữ liệu. Thao tác này không thể hoàn tác.
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
