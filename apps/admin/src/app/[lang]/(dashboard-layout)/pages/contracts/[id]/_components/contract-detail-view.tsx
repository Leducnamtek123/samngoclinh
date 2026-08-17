"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"

import type { AdminUser, EContract } from "@/types"

import { fetchApi } from "@/lib/api"

import { useTranslation } from "@/providers/i18n-provider"
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
import { Button } from "@/components/ui/button"
import { ContractDetailHeader } from "./contract-detail-header"
import { ContractDetailMetadata } from "./contract-detail-metadata"
import { ContractDetailViewer } from "./contract-detail-viewer"
import { ContractEditDialog } from "./contract-edit-dialog"
import { legalService } from "@/services/legal.service"
import { usersService } from "@/services/users.service"

interface ContractDetailViewProps {
  contract: EContract | null
  user: AdminUser | null
  lang?: string
  requestedId?: string
  errorMsg?: string
}

const formatVND = (val: number) =>
  Number(val || 0).toLocaleString("vi-VN") + " VNĐ"

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
  contract: initialContract,
  user: initialUser,
  lang,
  requestedId,
  errorMsg,
}: ContractDetailViewProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [contract, setContract] = useState<EContract | null>(initialContract)
  const [user, setUser] = useState<AdminUser | null>(initialUser)
  const [isLoading, setIsLoading] = useState<boolean>(
    !initialContract && Boolean(requestedId)
  )
  const [fetchError, setFetchError] = useState<string>(
    initialContract ? "" : requestedId ? "" : errorMsg || ""
  )
  const [copiedHash, setCopiedHash] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSendingReminder, setIsSendingReminder] = useState(false)
  const [isIssuing, setIsIssuing] = useState(false)
  const [templateHtml, setTemplateHtml] = useState<string>("")
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<boolean>(true)

  React.useEffect(() => {
    if (initialContract) {
      setContract(initialContract)
      setFetchError("")
      setIsLoading(false)
      return
    }

    if (requestedId) {
      let isMounted = true
      setIsLoading(true)

      legalService
        .getContractDetail(requestedId)
        .then(async (res) => {
          if (!isMounted) return
          if (res?.data) {
            setContract(res.data)
            setFetchError("")
            if (res.data.userId && !user) {
              const uRes = await usersService
                .getUserDetail(res.data.userId)
                .catch(() => null)
              if (isMounted && uRes?.data) {
                setUser(uRes.data)
              }
            }
          } else {
            const searchRes = await legalService
              .getContracts({ search: requestedId })
              .catch(() => null)
            if (!isMounted) return
            const rawData = searchRes?.data
            const rawItems = (rawData as { items?: EContract[] } | undefined)?.items
            const items: EContract[] = Array.isArray(rawData)
              ? rawData
              : Array.isArray(rawItems)
                ? rawItems
                : []
            const found = items.find(
              (c: EContract) =>
                c.id === requestedId ||
                c.code === requestedId ||
                c.contractCode === requestedId ||
                c.contractNumber === requestedId
            )
            if (found) {
              setContract(found)
              setFetchError("")
              if (found.userId && !user) {
                const uRes = await usersService
                  .getUserDetail(found.userId)
                  .catch(() => null)
                if (isMounted && uRes?.data) {
                  setUser(uRes.data)
                }
              }
            } else {
              setFetchError(t("common.table.noResults"))
            }
          }
        })
        .catch((err) => {
          if (!isMounted) return
          console.warn("Client fetch contract detail fallback:", err)
          setFetchError(err?.message || t("common.table.noResults"))
        })
        .finally(() => {
          if (isMounted) setIsLoading(false)
        })

      return () => {
        isMounted = false
      }
    }
  }, [initialContract, requestedId, t, user])

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
    let baseHtml = ""

    if (
      contractHtml &&
      (contractHtml.includes("<!DOCTYPE") ||
        contractHtml.includes("<html") ||
        contractHtml.length > 50)
    ) {
      baseHtml = contractHtml
    } else if (templateHtml) {
      baseHtml = templateHtml
    }

    if (!baseHtml) return ""

    const contractMeta = (contract.metadata || {}) as Record<string, unknown>
    const customerName =
      (contractMeta.customerName as string) ||
      user?.name ||
      contract.customerName ||
      (typeof contract.partyB === "string"
        ? contract.partyB
        : contract.partyB?.name) ||
      "Khách hàng"
    const cccd =
      (contractMeta.cccd as string) ||
      user?.identityNumber ||
      user?.cccd ||
      "Đã xác thực eKYC"
    const address =
      (contractMeta.address as string) ||
      user?.address ||
      "Hải Châu, TP. Đà Nẵng"
    const phone =
      (contractMeta.phone as string) ||
      (contractMeta.customerPhone as string) ||
      user?.mobileNumbers?.[0]?.number ||
      user?.phone ||
      "—"
    const email =
      (contractMeta.email as string) ||
      (contractMeta.customerEmail as string) ||
      user?.email ||
      "—"
    const contractCode =
      contract.code ||
      contract.contractCode ||
      contract.contractNumber ||
      "HĐ-SNL/2026/01"
    const treeCount = String(
      contract.items?.length || (contractMeta.totalPlants as number) || 1
    )
    const treeCountWords = `${treeCount} cây sâm`
    const totalVal = formatVND(
      contract.totalValue || contract.contractValue || 0
    )
    const careFee = contractMeta.careFee
      ? formatVND(contractMeta.careFee as number)
      : formatVND(
          Math.round((contract.totalValue || contract.contractValue || 0) * 0.1)
        )
    const signDate = contract.signedAt
      ? formatDateVi(contract.signedAt)
      : formatDateVi(contract.createdAt || "")
    const expireDate = formatDateVi(
      contract.expiresAt || contract.expiredAt || ""
    )

    let result = baseHtml
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

    const templateVars = (contractMeta.templateVariables || {}) as Record<
      string,
      string
    >
    for (const [key, val] of Object.entries(templateVars)) {
      if (val) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
        result = result.replace(regex, val)
      }
    }

    if (contract.signatureUrl) {
      result = result.replace(
        /Chờ khách hàng ký|Chờ ký/g,
        `<img src="${contract.signatureUrl}" alt="Chữ ký khách hàng" style="max-height: 48px; display: inline-block; object-fit: contain;" />`
      )
    }

    return result
  }, [contract, user, templateHtml])

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          {t("common.status.processing")}
        </p>
      </div>
    )
  }

  if (fetchError || !contract) {
    return (
      <div className="py-16 text-center space-y-4 max-w-lg mx-auto bg-card rounded-2xl border border-border/60 p-8 shadow-sm">
        <AlertCircle className="w-12 h-12 mx-auto text-amber-500" />
        <h2 className="text-xl font-bold text-foreground">
          {t("common.table.noResults")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {fetchError || t("common.table.noResults")}
        </p>
        {requestedId && (
          <div className="inline-block bg-muted/70 px-3 py-1.5 rounded-lg border border-border/80 font-mono text-xs text-muted-foreground break-all">
            {t("contracts.fields.code")}:{" "}
            <span className="font-semibold text-foreground">{requestedId}</span>
          </div>
        )}
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link href={`/${lang || "vi"}/pages/contracts`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t("common.actions.back")}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const meta = (contract.metadata || {}) as Record<string, unknown>
  const contractCode =
    contract.code || contract.contractCode || contract.contractNumber || ""
  const orderCode =
    (meta.orderCode as string) ||
    (contractCode.startsWith("CTR-")
      ? contractCode.replace("CTR-", "ORD-")
      : null)
  const isOrderSource = Boolean(
    meta.orderId ||
      meta.orderCode ||
      contract.contractType === "purchase_and_care"
  )
  const isSigned = contract.status === "signed"
  const isEkyc = Boolean(user?.isVerified || meta.ekycVerified)
  const documentHash =
    (meta.documentHash as string) ||
    contract.hash ||
    "SHA256:d8a9f4e2b1c78e39021fa4b75c829103e2"
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3002"
  const pdfDownloadUrl = `${apiUrl}/public/contracts/pdf?code=${encodeURIComponent(contractCode)}`
  const traceUrl = `${webUrl}/vi/trace/contract/${contractCode}`

  const handleCopyHash = () => {
    navigator.clipboard.writeText(documentHash)
    setCopiedHash(true)
    toast.success("Đã sao chép mã băm SHA-256!")
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const handleSendReminder = async () => {
    setIsSendingReminder(true)
    try {
      const res = await fetchApi("/admin/contracts/check-expiry", {
        method: "POST",
      })
      if (res.status < 400) {
        toast.success(
          `Đã gửi thông báo nhắc nhở ký hợp đồng đến ${user?.email || "khách hàng"}.`
        )
      } else {
        toast.error("Không thể gửi thông báo lúc này.")
      }
    } catch {
      toast.error("Có lỗi xảy ra khi kết nối máy chủ.")
    } finally {
      setIsSendingReminder(false)
    }
  }

  const handleIssue = async () => {
    if (!contract) return
    setIsIssuing(true)
    try {
      const res = await fetchApi(`/admin/contracts/${contract.id}/issue`, {
        method: "POST",
      })
      if (res.status < 400) {
        toast.success(
          "Phát hành hợp đồng và gửi thông báo cho khách hàng thành công!"
        )
        setContract({ ...contract, status: "pending" })
      } else {
        toast.error("Không thể phát hành hợp đồng.")
      }
    } catch {
      toast.error("Lỗi khi kết nối máy chủ.")
    } finally {
      setIsIssuing(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetchApi(`/admin/contracts/${contract.id}`, {
        method: "DELETE",
      })
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
        isIssuing={isIssuing}
        onEditClick={() => setIsEditDialogOpen(true)}
        onIssue={handleIssue}
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

      <ContractEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        contract={contract}
        user={user}
        onSuccess={(updated) => {
          setContract(updated)
          router.refresh()
        }}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hợp đồng này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn hợp đồng{" "}
              <strong>{contractCode}</strong> khỏi cơ sở dữ liệu. Thao tác này
              không thể hoàn tác.
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
