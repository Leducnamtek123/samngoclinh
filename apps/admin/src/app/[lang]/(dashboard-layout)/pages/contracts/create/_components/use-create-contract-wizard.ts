"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { fetchApi } from "@/lib/api"
import { useApiQuery } from "@/hooks/use-api-query"
import {
  extractCustomPlaceholders,
  formatLocalDate,
  parseLocalDate,
  docTienBangChu,
  docSoLuongCay,
} from "./create-contract-wizard-helpers"

interface UserItem {
  id: string
  name?: string
  username?: string
  email?: string
  isVerified?: boolean
  mobileNumbers?: Array<{ number: string }>
}

interface TreeItem {
  id: string
  code: string
  name: string
  ageYear?: number
}

interface UseCreateContractWizardProps {
  users: UserItem[]
  trees: TreeItem[]
  lang: string
}

export function useCreateContractWizard({ users, lang }: UseCreateContractWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1: Info & Customer details
  const initialUser = users[0]
  const [selectedUserId, setSelectedUserId] = useState<string>(initialUser?.id || "")
  const [contractType, setContractType] = useState<string>("purchase_and_care")
  const [selectedTreeCode, setSelectedTreeCode] = useState<string>("none")
  const [title, setTitle] = useState<string>("Hợp đồng Mua bán, Ký gửi & Chăm sóc Cây Sâm Ngọc Linh")

  // Customer Override Fields (Admin can freely customize)
  const [customerName, setCustomerName] = useState<string>(
    initialUser?.name || initialUser?.username || ""
  )
  const [customerPhone, setCustomerPhone] = useState<string>(
    initialUser?.mobileNumbers?.[0]?.number || ""
  )
  const [customerCccd, setCustomerCccd] = useState<string>("079090001234")
  const [customerAddress, setCustomerAddress] = useState<string>("Xã Trà Linh, Huyện Nam Trà My, Tỉnh Quảng Nam")
  const [customerEmail, setCustomerEmail] = useState<string>(
    initialUser?.email || ""
  )
  const [treeQuantity, setTreeQuantity] = useState<number>(1)

  // Step 2: Commercial Terms
  const [contractValue, setContractValue] = useState<number>(5000000)
  const [careFee, setCareFee] = useState<number>(500000)
  const [paymentStatus] = useState<string>("unpaid")
  const [partyA, setPartyA] = useState<string>("Công ty Cổ phần Sâm Ngọc Linh")
  const [partyB, setPartyB] = useState<string>(() => {
    if (!initialUser) return ""
    const uName = initialUser.name || initialUser.username || "Khách hàng"
    const uPhone = initialUser.mobileNumbers?.[0]?.number
    return uPhone ? `${uName} - SĐT: ${uPhone}` : uName
  })
  const [contractCode] = useState<string>(
    () => `HĐ-SNL-${new Date().getFullYear()}/${String(Math.floor(Math.random() * 900) + 100)}`
  )
  const [expiredAt, setExpiredAt] = useState<string>(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 2)
    return formatLocalDate(d)
  })
  const [customTerms, setCustomTerms] = useState<string>("")

  // Dynamic Custom Placeholders (Auto-detected from Template HTML)
  const [customPlaceholders, setCustomPlaceholders] = useState<Record<string, string>>({})

  // Step 3: Templates & Direct Content Editor
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string>(
    "hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
  )
  const [renderedPreviewHtml, setRenderedPreviewHtml] = useState<string>("")
  const [isCustomEdited, setIsCustomEdited] = useState<boolean>(false)
  const [step3ViewMode, setStep3ViewMode] = useState<"preview" | "editor">("preview")

  // Fetch Template HTML via React Query
  const { data: templateResponse } = useApiQuery<any>(
    ["contract-template", selectedTemplateSlug],
    `/public/contracts/templates/${selectedTemplateSlug}`,
    { enabled: Boolean(selectedTemplateSlug) }
  )
  const rawTemplateHtml = templateResponse?.data?.contentHtml || ""

  // Selected User Object
  const selectedUser = users.find((u) => u.id === selectedUserId)

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
    const u = users.find((item) => item.id === userId)
    if (u) {
      const uName = u.name || u.username || "Khách hàng"
      const uPhone = u.mobileNumbers?.[0]?.number || ""
      const uEmail = u.email || ""
      setCustomerName(uName)
      setCustomerPhone(uPhone)
      setCustomerEmail(uEmail)
      const phoneStr = uPhone ? ` - SĐT: ${uPhone}` : ""
      setPartyB(`${uName}${phoneStr}`)
    }
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
      if (!template) return "<p class='p-6 text-slate-500'>Đang tải nội dung mẫu hợp đồng...</p>"

      const cName = customerName.trim() || selectedUser?.name || selectedUser?.username || "Quý Khách Hàng"
      const cPhone = customerPhone.trim() || selectedUser?.mobileNumbers?.[0]?.number || "090xxxxxxx"
      const cCccd = customerCccd.trim() || "079090001234"
      const cAddress = customerAddress.trim() || "Xã Trà Linh, Huyện Nam Trà My, Tỉnh Quảng Nam"
      const cEmail = customerEmail.trim() || selectedUser?.email || "contact@khachhang.vn"

      const today = new Date()
      const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`
      const expDate = parseLocalDate(expiredAt)
      const expDateStr = expDate
        ? `${expDate.getDate().toString().padStart(2, '0')}/${(expDate.getMonth() + 1).toString().padStart(2, '0')}/${expDate.getFullYear()}`
        : "16/08/2028"

      const valueFormatted = contractValue.toLocaleString("vi-VN")
      const valueText = docTienBangChu(contractValue)
      const careFeeFormatted = careFee.toLocaleString("vi-VN")
      const careFeeText = docTienBangChu(careFee)
      const treeQtyText = docSoLuongCay(treeQuantity)

      let result = template
        .split("{{TEN_KHACH_HANG}}").join(cName)
        .split("{{CCCD_MST}}").join(cCccd)
        .split("{{DIA_CHI}}").join(cAddress)
        .split("{{SO_DIEN_THOAI}}").join(cPhone)
        .split("{{EMAIL}}").join(cEmail)
        .split("{{MA_HOP_DONG}}").join(contractCode)
        .split("{{TONG_GIA_TRI}}").join(valueFormatted)
        .split("{{TONG_GIA_TRI_CHU}}").join(valueText)
        .split("{{PHI_CHAM_SOC}}").join(careFeeFormatted)
        .split("{{PHI_CHAM_SOC_CHU}}").join(careFeeText)
        .split("{{SO_LUONG_CAY}}").join(String(treeQuantity))
        .split("{{SO_LUONG_CAY_CHU}}").join(treeQtyText)
        .split("{{NGAY_KY}}").join(todayStr)
        .split("{{NGAY_HET_HAN}}").join(expDateStr)

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
      toast.success("Đã làm mới nội dung văn bản theo mẫu tự động.")
    }
  }

  // Validation Checks
  const isStep1Valid = Boolean(selectedUserId && contractType && title.trim())
  const isStep2Valid = contractValue > 0 && Boolean(expiredAt && partyA && partyB)

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid) {
      toast.error("Vui lòng chọn khách hàng và nhập tiêu đề hợp đồng.")
      return
    }
    if (currentStep === 2 && !isStep2Valid) {
      toast.error("Vui lòng nhập giá trị hợp đồng và thời hạn hợp lệ.")
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
      toast.error("Vui lòng chọn khách hàng")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        userId: selectedUserId,
        treeCode: selectedTreeCode !== "none" ? selectedTreeCode : undefined,
        title: title.trim(),
        content: renderedPreviewHtml || `Hợp đồng ${contractType === "purchase_and_care" ? "Mua bán & Ký gửi Chăm sóc" : "Ký gửi"} Sâm Ngọc Linh lập thủ công cho khách hàng ${customerName || selectedUser?.name || selectedUserId}.`,
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
            ? "Đã phát hành hợp đồng thành công! Khách hàng có thể ký ngay trên Web/App."
            : "Đã lưu bản nháp hợp đồng thành công."
        )
        router.push(`/${lang}/pages/contracts/${result.data.id}`)
      } else {
        toast.error(result.message || "Không thể tạo hợp đồng.")
      }
    } catch (err) {
      console.error("Error creating contract:", err)
      toast.error("Có lỗi xảy ra khi kết nối máy chủ.")
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
