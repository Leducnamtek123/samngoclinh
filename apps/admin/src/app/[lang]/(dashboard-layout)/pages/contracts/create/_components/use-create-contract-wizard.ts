"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { AdminUser, Tree } from "@/types"

import { fetchApi } from "@/lib/api"

import { useApiQuery } from "@/hooks/use-api-query"
import { useTranslation } from "@/providers/i18n-provider"
import {
  docSoLuongCay,
  docTienBangChu,
  extractCustomPlaceholders,
  formatLocalDate,
  parseLocalDate,
} from "./create-contract-wizard-helpers"

interface UseCreateContractWizardProps {
  users: AdminUser[]
  trees: Tree[]
  lang: string
}

export function useCreateContractWizard({
  users,
  lang,
}: UseCreateContractWizardProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1: Info & Customer details
  const initialUser = users[0]
  const [selectedUserId, setSelectedUserId] = useState<string>(
    initialUser?.id || ""
  )
  const [contractType, setContractType] = useState<string>("purchase_and_care")
  const [selectedTreeCode, setSelectedTreeCode] = useState<string>("none")
  const [title, setTitle] = useState<string>(
    "Hợp đồng Mua bán, Ký gửi & Chăm sóc Cây Sâm Ngọc Linh"
  )

  const [customerName, setCustomerName] = useState<string>(
    initialUser?.name || initialUser?.username || ""
  )
  const [customerPhone, setCustomerPhone] = useState<string>(
    initialUser?.mobileNumbers?.[0]?.number || ""
  )
  const [customerCccd, setCustomerCccd] = useState<string>("")
  const [customerAddress, setCustomerAddress] = useState<string>("")
  const [customerEmail, setCustomerEmail] = useState<string>(
    initialUser?.email || ""
  )
  const [treeQuantity, setTreeQuantity] = useState<number>(1)

  // Sync with selected user info
  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId]
  )

  useEffect(() => {
    if (selectedUser) {
      setCustomerName(selectedUser.name || selectedUser.username || "")
      setCustomerPhone(selectedUser.mobileNumbers?.[0]?.number || "")
      setCustomerEmail(selectedUser.email || "")
    }
  }, [selectedUser])

  // Step 2: Commercial Terms
  const [contractValue, setContractValue] = useState<number>(50000000)
  const [careFee, setCareFee] = useState<number>(3000000)
  const [paymentStatus] = useState<string>("unpaid")
  const [partyA, setPartyA] = useState<string>("CÔNG TY CỔ PHẦN SÂM NGỌC LINH")
  const [partyB, setPartyB] = useState<string>("")
  const [contractCode] = useState<string>(
    () =>
      `HĐ-SNL-${new Date().getFullYear()}/${String(Math.floor(Math.random() * 900) + 100)}`
  )
  const [expiredAt, setExpiredAt] = useState<string>(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 2)
    return formatLocalDate(d)
  })
  const [customTerms, setCustomTerms] = useState<string>("")

  // Dynamic Custom Placeholders (Auto-detected from Template HTML)
  const [customPlaceholders, setCustomPlaceholders] = useState<
    Record<string, string>
  >({})

  // Step 3: Templates & Direct Content Editor
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string>(
    "hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
  )
  const [renderedPreviewHtml, setRenderedPreviewHtml] = useState<string>("")
  const [isCustomEdited, setIsCustomEdited] = useState<boolean>(false)
  const [step3ViewMode, setStep3ViewMode] = useState<"preview" | "editor">(
    "preview"
  )

  // Fetch Template HTML via React Query
  const { data: templateResponse } = useApiQuery<{ contentHtml?: string }>(
    ["contract-template", selectedTemplateSlug],
    `/public/contracts/templates/${selectedTemplateSlug}`,
    { enabled: Boolean(selectedTemplateSlug) }
  )
  const rawTemplateHtml =
    (templateResponse?.data as { contentHtml?: string })?.contentHtml ||
    templateResponse?.data?.contentHtml ||
    ""

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
  }

  const handleContractValueChange = (val: number) => {
    setContractValue(val)
    setCareFee(Math.round(val * 0.1))
  }

  // Auto-detect any extra custom placeholders in template HTML
  const detectedKeys = useMemo(() => {
    return rawTemplateHtml ? extractCustomPlaceholders(rawTemplateHtml) : []
  }, [rawTemplateHtml])

  const allPlaceholders = useMemo(() => {
    const map: Record<string, string> = {}
    for (const k of detectedKeys) {
      map[k] = ""
    }
    for (const [k, v] of Object.entries(customPlaceholders)) {
      map[k] = v
    }
    return map
  }, [detectedKeys, customPlaceholders])

  // Helper to re-generate rendered HTML from raw template & current state
  const buildRenderedHtml = useCallback(
    (template: string) => {
      if (!template)
        return `<p class='p-6 text-slate-500'>${t("contracts.notifications.loadingTemplate")}</p>`

      const cName =
        customerName.trim() ||
        selectedUser?.name ||
        selectedUser?.username ||
        "Quý Khách Hàng"
      const cPhone =
        customerPhone.trim() ||
        selectedUser?.mobileNumbers?.[0]?.number ||
        "090xxxxxxx"
      const cCccd = customerCccd.trim() || "079090001234"
      const cAddress =
        customerAddress.trim() ||
        "Xã Trà Linh, Huyện Nam Trà My, Tỉnh Quảng Nam"
      const cEmail =
        customerEmail.trim() || selectedUser?.email || "contact@khachhang.vn"

      const today = new Date()
      const todayStr = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`
      const expDate = parseLocalDate(expiredAt)
      const expDateStr = expDate
        ? `${expDate.getDate().toString().padStart(2, "0")}/${(expDate.getMonth() + 1).toString().padStart(2, "0")}/${expDate.getFullYear()}`
        : "16/08/2028"

      const valueFormatted = contractValue.toLocaleString("vi-VN")
      const valueText = docTienBangChu(contractValue)
      const careFeeFormatted = careFee.toLocaleString("vi-VN")
      const careFeeText = docTienBangChu(careFee)
      const treeQtyText = docSoLuongCay(treeQuantity)

      let result = template
        .split("{{TEN_KHACH_HANG}}")
        .join(cName)
        .split("{{CCCD_MST}}")
        .join(cCccd)
        .split("{{DIA_CHI}}")
        .join(cAddress)
        .split("{{SO_DIEN_THOAI}}")
        .join(cPhone)
        .split("{{EMAIL}}")
        .join(cEmail)
        .split("{{MA_HOP_DONG}}")
        .join(contractCode)
        .split("{{TONG_GIA_TRI}}")
        .join(valueFormatted)
        .split("{{TONG_GIA_TRI_CHU}}")
        .join(valueText)
        .split("{{PHI_CHAM_SOC}}")
        .join(careFeeFormatted)
        .split("{{PHI_CHAM_SOC_CHU}}")
        .join(careFeeText)
        .split("{{SO_LUONG_CAY}}")
        .join(String(treeQuantity))
        .split("{{SO_LUONG_CAY_CHU}}")
        .join(treeQtyText)
        .split("{{NGAY_KY}}")
        .join(todayStr)
        .split("{{NGAY_HET_HAN}}")
        .join(expDateStr)

      // Replace all detected and custom dynamic placeholders
      for (const [key, val] of Object.entries(allPlaceholders)) {
        if (val) {
          result = result.split(`{{${key}}}`).join(val)
        }
      }

      return result
    },
    [
      customerName,
      selectedUser,
      customerPhone,
      customerCccd,
      customerAddress,
      customerEmail,
      expiredAt,
      contractValue,
      careFee,
      treeQuantity,
      contractCode,
      allPlaceholders,
      t,
    ]
  )

  // Compute Live Rendered HTML with placeholders replaced if not manually edited
  useEffect(() => {
    if (!isCustomEdited && rawTemplateHtml) {
      setRenderedPreviewHtml(buildRenderedHtml(rawTemplateHtml))
    }
  }, [isCustomEdited, rawTemplateHtml, buildRenderedHtml])

  // Reset to auto-filled template
  const handleResetToTemplate = () => {
    setIsCustomEdited(false)
    if (rawTemplateHtml) {
      setRenderedPreviewHtml(buildRenderedHtml(rawTemplateHtml))
      toast.success(t("contracts.notifications.templateRefreshed"))
    }
  }

  // Validation Checks
  const isStep1Valid = Boolean(selectedUserId && contractType && title.trim())
  const isStep2Valid =
    contractValue > 0 && Boolean(expiredAt && partyA && partyB)

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid) {
      toast.error(t("contracts.notifications.selectCustomerAndTitle"))
      return
    }
    if (currentStep === 2 && !isStep2Valid) {
      toast.error(t("contracts.notifications.enterValidValueAndDuration"))
      return
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Handle Publish / Draft Submit
  const handleSubmit = async (publishStatus: "pending" | "draft") => {
    if (!selectedUserId) {
      toast.error(t("contracts.notifications.selectCustomer"))
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        userId: selectedUserId,
        treeCode: selectedTreeCode !== "none" ? selectedTreeCode : undefined,
        title: title.trim(),
        content:
          renderedPreviewHtml ||
          `Hợp đồng ${contractType === "purchase_and_care" ? "Mua bán & Ký gửi Chăm sóc" : "Ký gửi"} Sâm Ngọc Linh lập thủ công cho khách hàng ${customerName || selectedUser?.name || selectedUserId}.`,
        contractValue,
        paymentStatus,
        status: publishStatus,
        expiredAt: (parseLocalDate(expiredAt) || new Date()).toISOString(),
        contractType,
        partyA,
        partyB,
        terms: customTerms.trim() || undefined,
        metadata: {
          source: "manual",
          isManualIssued: true,
          templateSlug: selectedTemplateSlug,
          contractCode,
          customerName,
          customerCccd,
          customerAddress,
          customerPhone,
          customerEmail,
          careFee,
          treeQuantity,
          customFields: customPlaceholders,
          isCustomEdited,
          contractHtml: renderedPreviewHtml,
          issuedAt: new Date().toISOString(),
        },
      }

      const res = await fetchApi("/admin/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (res.status < 400 && result.data) {
        toast.success(
          publishStatus === "pending"
            ? t("contracts.notifications.publishSuccess")
            : t("contracts.notifications.updateSuccess")
        )
        router.push(`/${lang}/pages/contracts/${result.data.id}`)
      } else {
        toast.error(result.message || t("contracts.notifications.createError"))
      }
    } catch (err) {
      console.error("Error creating contract:", err)
      toast.error(t("contracts.notifications.serverError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    currentStep,
    setCurrentStep,
    isSubmitting,
    selectedUserId,
    handleUserChange,
    selectedUser,
    contractType,
    setContractType,
    selectedTreeCode,
    setSelectedTreeCode,
    title,
    setTitle,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerCccd,
    setCustomerCccd,
    customerAddress,
    setCustomerAddress,
    customerEmail,
    setCustomerEmail,
    treeQuantity,
    setTreeQuantity,
    contractValue,
    handleContractValueChange,
    careFee,
    setCareFee,
    paymentStatus,
    partyA,
    setPartyA,
    partyB,
    setPartyB,
    contractCode,
    expiredAt,
    setExpiredAt,
    customTerms,
    setCustomTerms,
    customPlaceholders,
    setCustomPlaceholders,
    selectedTemplateSlug,
    setSelectedTemplateSlug,
    renderedPreviewHtml,
    setRenderedPreviewHtml,
    isCustomEdited,
    setIsCustomEdited,
    step3ViewMode,
    setStep3ViewMode,
    allPlaceholders,
    handleResetToTemplate,
    isStep1Valid,
    isStep2Valid,
    handleNext,
    handlePrev,
    handleSubmit,
  }
}
