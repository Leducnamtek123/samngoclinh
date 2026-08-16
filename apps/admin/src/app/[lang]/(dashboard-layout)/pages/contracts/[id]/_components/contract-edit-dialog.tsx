"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
  FileEdit,
  User,
  Building2,
  Calendar as CalendarIcon,
  Sparkles,
  Eye,
  FileCode,
  CheckCircle2,
  Copy,
  Plus,
  Trash2,
  RefreshCw,
  Hash,
  HelpCircle,
  ShieldCheck,
  DollarSign,
  Sliders,
} from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/ui/date-picker"
import { fetchApi } from "@/lib/api"

import type { AdminUser, EContract } from "@/types"

interface ContractEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract: EContract
  user: AdminUser | null
  onSuccess: (updatedContract: EContract) => void
}

const KNOWN_PLACEHOLDER_LABELS: Record<string, { label: string; desc: string }> = {
  TEN_KHACH_HANG: { label: "Họ và tên khách hàng (Bên B)", desc: "Tên chủ sở hữu đứng tên hợp đồng" },
  CCCD_MST: { label: "Số CCCD / CMND / Mã số thuế", desc: "Số định danh cá nhân hoặc mã số thuế bên B" },
  SO_DIEN_THOAI: { label: "Số điện thoại liên hệ", desc: "Số điện thoại chính của bên B" },
  EMAIL: { label: "Địa chỉ thư điện tử (Email)", desc: "Email nhận thông báo và bản hợp đồng điện tử" },
  DIA_CHI: { label: "Địa chỉ thường trú / Liên hệ", desc: "Địa chỉ cư trú ghi trong văn bản pháp lý" },
  MA_HOP_DONG: { label: "Mã số định danh hợp đồng", desc: "Mã số duy nhất của hợp đồng trên hệ thống" },
  SO_LUONG_CAY: { label: "Số lượng cây sâm (Bằng số)", desc: "Tổng số lượng cây sâm giao kết" },
  SO_LUONG_CAY_CHU: { label: "Số lượng cây sâm (Bằng chữ)", desc: "Ví dụ: 01 cây sâm" },
  TONG_GIA_TRI: { label: "Tổng giá trị hợp đồng (Bằng số)", desc: "Giá trị hợp đồng bằng số (VNĐ)" },
  TONG_GIA_TRI_CHU: { label: "Tổng giá trị hợp đồng (Bằng chữ)", desc: "Giá trị hợp đồng viết bằng chữ tiếng Việt" },
  PHI_CHAM_SOC: { label: "Phí ủy thác chăm sóc (Bằng số)", desc: "Phí chăm sóc định kỳ hàng năm (VNĐ)" },
  PHI_CHAM_SOC_CHU: { label: "Phí ủy thác chăm sóc (Bằng chữ)", desc: "Phí chăm sóc định kỳ viết bằng chữ" },
  NGAY_KY: { label: "Ngày ký xác thực", desc: "Ngày ký hợp đồng điện tử (Ngày/Tháng/Năm)" },
  NGAY_HET_HAN: { label: "Ngày hết hạn hợp đồng", desc: "Thời hạn kết thúc hiệu lực của hợp đồng" },
  DAI_DIEN_BEN_A: { label: "Đại diện Bên A (Doanh nghiệp)", desc: "Đại diện theo pháp luật của Bên A" },
  TEN_VUON: { label: "Khu vườn trồng sâm", desc: "Tên khu vườn chăm sóc (Vườn Nam Trà My)" },
  MA_LUONG: { label: "Mã vị trí luống sâm", desc: "Vị trí luống trồng cây sâm trong vườn" },
}

export function ContractEditDialog({
  open,
  onOpenChange,
  contract,
  user,
  onSuccess,
}: ContractEditDialogProps) {
  const meta = (contract.metadata || {}) as Record<string, unknown>
  const savedVariables = (meta.templateVariables || {}) as Record<string, string>

  // Form State
  const [customerName, setCustomerName] = useState<string>("")
  const [cccd, setCccd] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [partyA, setPartyA] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [contractValue, setContractValue] = useState<number>(0)
  const [careFee, setCareFee] = useState<number>(0)
  const [totalPlants, setTotalPlants] = useState<number>(1)
  const [expiredAtDate, setExpiredAtDate] = useState<Date | undefined>(undefined)
  const [terms, setTerms] = useState<string>("")
  const [content, setContent] = useState<string>("")

  // Dynamic Template Variables Map
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({})
  const [newVarKey, setNewVarKey] = useState<string>("")
  const [newVarVal, setNewVarVal] = useState<string>("")
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<"variables" | "editor" | "preview">("variables")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const formatNumberVND = (num: number) =>
    Number(num || 0).toLocaleString("vi-VN") + " VNĐ"

  const formatDateDisplay = (dateObj?: Date | string | null) => {
    if (!dateObj) return "—"
    try {
      const d = typeof dateObj === "string" ? new Date(dateObj) : dateObj
      if (isNaN(d.getTime())) return "—"
      return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`
    } catch {
      return "—"
    }
  }

  // Load official HTML template from API
  const handleLoadOfficialTemplate = async () => {
    setIsLoadingTemplate(true)
    try {
      const targetSlug = "hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
      const res = await fetchApi(`/public/contracts/templates/${targetSlug}`)
      const payload = await res.json()
      if (res.status < 400 && payload.data?.contentHtml) {
        setContent(payload.data.contentHtml)
        toast.success("Đã nạp toàn bộ mẫu hợp đồng chuẩn từ hệ thống!")
      } else {
        toast.error("Không thể tải mẫu hợp đồng từ hệ thống.")
      }
    } catch {
      toast.error("Lỗi khi kết nối máy chủ để nạp mẫu văn bản.")
    } finally {
      setIsLoadingTemplate(false)
    }
  }

  // Initialize form state
  useEffect(() => {
    if (contract && open) {
      const partyBStr = typeof contract.partyB === "string" ? contract.partyB : contract.partyB?.name || ""
      const initCustomerName =
        (meta.customerName as string) ||
        user?.name ||
        contract.customerName ||
        partyBStr ||
        ""
      const initCccd = (meta.cccd as string) || user?.identityNumber || user?.cccd || ""
      const initPhone =
        (meta.phone as string) ||
        (meta.customerPhone as string) ||
        user?.mobileNumbers?.[0]?.number ||
        user?.phone ||
        ""
      const initEmail =
        (meta.email as string) ||
        (meta.customerEmail as string) ||
        user?.email ||
        ""
      const initAddress = (meta.address as string) || user?.address || ""
      const initPartyA = contract.partyA || "CÔNG TY CỔ PHẦN SÂM NGỌC LINH"
      const initTitle = contract.title || ""
      const initValue = Number(contract.contractValue || contract.totalValue || 0)
      const initCareFee = Number(
        meta.careFee ||
        Math.round(initValue * 0.1)
      )
      const initPlants = Number(meta.totalPlants || contract.items?.length || 1)

      setCustomerName(initCustomerName)
      setCccd(initCccd)
      setPhone(initPhone)
      setEmail(initEmail)
      setAddress(initAddress)
      setPartyA(initPartyA)
      setTitle(initTitle)
      setContractValue(initValue)
      setCareFee(initCareFee)
      setTotalPlants(initPlants)

      const exp = contract.expiredAt || contract.expiresAt
      let expDate: Date | undefined
      if (exp) {
        try {
          const d = new Date(exp)
          if (!isNaN(d.getTime())) {
            expDate = d
            setExpiredAtDate(d)
          }
        } catch {
          setExpiredAtDate(undefined)
        }
      }

      setTerms(contract.terms || "")
      const initialContent = contract.content || contract.contentHtml || ""
      setContent(initialContent)

      // Initialize template variables map with smart defaults
      const code = contract.code || "HĐ-SNL/2026/01"
      const defaultVars: Record<string, string> = {
        TEN_KHACH_HANG: initCustomerName,
        CCCD_MST: initCccd,
        SO_DIEN_THOAI: initPhone,
        EMAIL: initEmail,
        DIA_CHI: initAddress,
        MA_HOP_DONG: code,
        SO_LUONG_CAY: String(initPlants),
        SO_LUONG_CAY_CHU: `${initPlants} cây sâm`,
        TONG_GIA_TRI: formatNumberVND(initValue),
        TONG_GIA_TRI_CHU: formatNumberVND(initValue),
        PHI_CHAM_SOC: formatNumberVND(initCareFee),
        PHI_CHAM_SOC_CHU: formatNumberVND(initCareFee),
        NGAY_KY: formatDateDisplay(contract.signedAt || new Date()),
        NGAY_HET_HAN: formatDateDisplay(expDate || ""),
        DAI_DIEN_BEN_A: initPartyA,
        ...savedVariables,
      }
      setCustomVariables(defaultVars)
      setActiveTab("variables")

      // If content is short/plain text, auto-load official template
      if (!initialContent || (!initialContent.includes("<!DOCTYPE") && !initialContent.includes("<div class="))) {
        handleLoadOfficialTemplate()
      }
    }
  }, [contract, user, open])

  // Detect all {{ PLACEHOLDER }} tags in the content HTML
  const detectedPlaceholders = useMemo(() => {
    if (!content) return []
    const matches = content.match(/\{\{([A-Z0-9_]+)\}\}/g)
    if (!matches) return []
    const uniqueTags = Array.from(new Set(matches.map((m) => m.replace(/[{}]/g, ""))))
    return uniqueTags
  }, [content])

  // Handle variable change
  const handleVariableChange = (key: string, value: string) => {
    setCustomVariables((prev) => ({
      ...prev,
      [key]: value,
    }))

    // Sync back to top-level fields for core properties
    if (key === "TEN_KHACH_HANG") setCustomerName(value)
    if (key === "CCCD_MST") setCccd(value)
    if (key === "SO_DIEN_THOAI") setPhone(value)
    if (key === "EMAIL") setEmail(value)
    if (key === "DIA_CHI") setAddress(value)
    if (key === "DAI_DIEN_BEN_A") setPartyA(value)
  }

  // Add custom variable
  const handleAddCustomVariable = () => {
    if (!newVarKey.trim()) {
      toast.error("Vui lòng nhập mã biến (ví dụ: SO_TAI_KHOAN)")
      return
    }
    const cleanKey = newVarKey.trim().toUpperCase().replace(/[{}]/g, "")
    setCustomVariables((prev) => ({
      ...prev,
      [cleanKey]: newVarVal,
    }))
    setNewVarKey("")
    setNewVarVal("")
    toast.success(`Đã thêm trường {{${cleanKey}}}`)
  }

  // Delete custom variable
  const handleDeleteCustomVariable = (key: string) => {
    setCustomVariables((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    toast.success(`Đã xóa biến {{${key}}}`)
  }

  // Compute fully interpolated rendered HTML string with font Inter
  const renderedInterpolatedHtml = useMemo(() => {
    if (!content) {
      return `<div style="text-align: center; padding: 60px 20px; color: #94a3b8; font-family: 'Inter', -apple-system, sans-serif;">
        <p style="font-size: 15px; font-weight: 600;">Chưa có nội dung hợp đồng để xem trước.</p>
        <p style="font-size: 13px; margin-top: 6px;">Vui lòng bấm &quot;Nạp mẫu chuẩn từ hệ thống&quot; hoặc nhập nội dung ở thẻ Soạn thảo.</p>
      </div>`
    }

    let result = content

    // 1. Replace from customVariables map
    for (const [key, val] of Object.entries(customVariables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
      result = result.replace(
        regex,
        `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; border: 1px solid #86efac; font-family: 'Inter', sans-serif;">${val || `{{${key}}}`}</span>`
      )
    }

    // 2. Fallback replacements for standard placeholders
    const code = contract.code || "HĐ-SNL/2026/01"
    const totalValStr = formatNumberVND(contractValue)
    const careFeeStr = formatNumberVND(careFee)
    const signDateStr = formatDateDisplay(contract.signedAt || new Date())
    const expDateStr = formatDateDisplay(expiredAtDate || contract.expiredAt || "")

    result = result
      .replace(/\{\{TEN_KHACH_HANG\}\}/g, `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${customerName || "—"}</span>`)
      .replace(/\{\{CCCD_MST\}\}/g, `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${cccd || "—"}</span>`)
      .replace(/\{\{SO_DIEN_THOAI\}\}/g, `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${phone || "—"}</span>`)
      .replace(/\{\{EMAIL\}\}/g, `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${email || "—"}</span>`)
      .replace(/\{\{DIA_CHI\}\}/g, `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${address || "—"}</span>`)
      .replace(/\{\{MA_HOP_DONG\}\}/g, `<span style="background-color: #e0e7ff; color: #3730a3; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${code}</span>`)
      .replace(/\{\{SO_LUONG_CAY\}\}/g, `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${totalPlants || 1}</span>`)
      .replace(/\{\{SO_LUONG_CAY_CHU\}\}/g, `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${totalPlants || 1} cây sâm</span>`)
      .replace(/\{\{TONG_GIA_TRI\}\}/g, `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${totalValStr}</span>`)
      .replace(/\{\{TONG_GIA_TRI_CHU\}\}/g, `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${totalValStr}</span>`)
      .replace(/\{\{PHI_CHAM_SOC\}\}/g, `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${careFeeStr}</span>`)
      .replace(/\{\{PHI_CHAM_SOC_CHU\}\}/g, `<span style="background-color: #dcfce7; color: #166534; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${careFeeStr}</span>`)
      .replace(/\{\{NGAY_KY\}\}/g, `<span style="background-color: #f3e8ff; color: #6b21a8; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${signDateStr}</span>`)
      .replace(/\{\{NGAY_HET_HAN\}\}/g, `<span style="background-color: #f3e8ff; color: #6b21a8; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: 'Inter', sans-serif;">${expDateStr}</span>`)

    // Inject Font Inter override
    const fontInject = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>* { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; }</style>`
    if (result.includes("<head>")) {
      result = result.replace("<head>", `<head>${fontInject}`)
    } else {
      result = `${fontInject}<div style="font-family: 'Inter', -apple-system, sans-serif;">${result}</div>`
    }

    return result
  }, [content, customVariables, contractValue, careFee, totalPlants, customerName, cccd, phone, email, address, expiredAtDate, contract.code, contract.signedAt, contract.expiredAt])

  // Apply variables permanently into HTML content
  const handleApplyPermanentReplacement = () => {
    if (!content) return
    let permanentHtml = content
    for (const [key, val] of Object.entries(customVariables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
      permanentHtml = permanentHtml.replace(regex, val || "")
    }
    setContent(permanentHtml)
    toast.success("Đã thay thế vĩnh viễn các biến {{ }} vào nội dung văn bản!")
  }

  // Submit update
  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề hợp đồng.")
      return
    }

    setIsSubmitting(true)
    try {
      const partyBCombined = `${customerName || customVariables.TEN_KHACH_HANG || ""}${
        cccd || customVariables.CCCD_MST ? ` (CCCD: ${cccd || customVariables.CCCD_MST})` : ""
      }${phone || customVariables.SO_DIEN_THOAI ? ` - SĐT: ${phone || customVariables.SO_DIEN_THOAI}` : ""}`

      const payload = {
        title,
        partyA: partyA || customVariables.DAI_DIEN_BEN_A || "CÔNG TY CỔ PHẦN SÂM NGỌC LINH",
        partyB: partyBCombined,
        contractValue: Number(contractValue),
        expiredAt: expiredAtDate ? expiredAtDate.toISOString() : contract.expiredAt,
        terms,
        content,
        metadata: {
          ...meta,
          customerName: customerName || customVariables.TEN_KHACH_HANG,
          cccd: cccd || customVariables.CCCD_MST,
          phone: phone || customVariables.SO_DIEN_THOAI,
          customerPhone: phone || customVariables.SO_DIEN_THOAI,
          email: email || customVariables.EMAIL,
          customerEmail: email || customVariables.EMAIL,
          address: address || customVariables.DIA_CHI,
          careFee: Number(careFee),
          totalPlants: Number(totalPlants),
          templateVariables: customVariables,
          lastEditedAt: new Date().toISOString(),
        },
      }

      const res = await fetchApi(`/admin/contracts/${contract.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (res.status < 400 && result.data) {
        toast.success("Cập nhật thông tin và mẫu văn bản hợp đồng thành công!")
        onSuccess(result.data)
        onOpenChange(false)
      } else {
        toast.error(result.message || "Không thể cập nhật hợp đồng.")
      }
    } catch (e: unknown) {
      const err = e as Error
      toast.error(err.message || "Lỗi khi kết nối máy chủ.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Dynamic extra variables (detected from template or added by user, excluding core fields handled in Card 1 & 2)
  const coreTagKeys = new Set([
    "TEN_KHACH_HANG",
    "CCCD_MST",
    "SO_DIEN_THOAI",
    "EMAIL",
    "DIA_CHI",
    "MA_HOP_DONG",
    "SO_LUONG_CAY",
    "SO_LUONG_CAY_CHU",
    "TONG_GIA_TRI",
    "TONG_GIA_TRI_CHU",
    "PHI_CHAM_SOC",
    "PHI_CHAM_SOC_CHU",
    "NGAY_KY",
    "NGAY_HET_HAN",
    "DAI_DIEN_BEN_A",
  ])

  const extraFieldTags = useMemo(() => {
    const set = new Set<string>()
    detectedPlaceholders.forEach((t) => {
      if (!coreTagKeys.has(t)) set.add(t)
    })
    Object.keys(customVariables).forEach((k) => {
      if (!coreTagKeys.has(k)) set.add(k)
    })
    return Array.from(set)
  }, [detectedPlaceholders, customVariables])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] sm:max-w-5xl md:max-w-6xl h-[88vh] max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden border-border/80 shadow-2xl rounded-2xl bg-card font-sans">
        {/* HEADER */}
        <DialogHeader className="shrink-0 px-6 py-4 border-b border-border/70 bg-muted/20 pr-12">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <FileEdit className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <DialogTitle className="text-lg font-bold tracking-tight text-foreground font-sans">
                      Chỉnh sửa Biến số & Mẫu Hợp đồng
                    </DialogTitle>
                    <Badge variant="outline" className="font-mono text-xs px-2.5 py-0.5 bg-background border-border font-bold text-foreground">
                      <Hash className="w-3 h-3 mr-1 text-muted-foreground inline" />
                      {contract.code}
                    </Badge>
                  </div>
                  <DialogDescription className="text-xs text-muted-foreground font-sans mt-0.5">
                    Sử dụng các component form chuẩn để cập nhật thông tin pháp lý, giá trị cam kết và trường mẫu <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded">{"{{ TÊN_BIẾN }}"}</code>
                  </DialogDescription>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* NAVIGATION BAR */}
        <div className="shrink-0 px-6 py-2.5 border-b border-border/60 bg-muted/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-muted/60 dark:bg-muted/30 rounded-xl border border-border/60 font-sans">
            <button
              type="button"
              onClick={() => setActiveTab("variables")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer font-sans ${
                activeTab === "variables"
                  ? "bg-background text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>1. Thông tin hợp đồng & Pháp lý</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer font-sans ${
                activeTab === "editor"
                  ? "bg-background text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>2. Soạn thảo mã văn bản</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer font-sans ${
                activeTab === "preview"
                  ? "bg-background text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>3. Xem trước hợp đồng trực tiếp</span>
            </button>
          </div>

          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={handleLoadOfficialTemplate}
            disabled={isLoadingTemplate}
            className="h-8 text-xs gap-1.5 text-slate-700 dark:text-slate-200 border-border hover:bg-background cursor-pointer font-sans font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isLoadingTemplate ? "animate-spin" : ""}`} />
            <span>Nạp mẫu chuẩn từ hệ thống</span>
          </Button>
        </div>

        {/* MODAL CONTENT */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 font-sans space-y-5">
          {/* ========================================================================= */}
          {/* TAB 1: FORM CHUẨN (CARD, LABEL, INPUT, DATEPICKER) */}
          {/* ========================================================================= */}
          {activeTab === "variables" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* CARD 1: THÔNG TIN PHÁP LÝ BÊN B (KHÁCH HÀNG) */}
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      Thông tin pháp lý Bên B (Khách hàng sở hữu)
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
                      Tự động liên kết eKYC
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Thông tin hiển thị tại khu vực chủ thể bên B và các vị trí ký số của văn bản.
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-5 pb-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">
                          Họ và tên khách hàng <span className="text-rose-500">*</span>
                        </Label>
                        <code className="text-[10px] font-mono text-muted-foreground">{"{{TEN_KHACH_HANG}}"}</code>
                      </div>
                      <Input
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value)
                          handleVariableChange("TEN_KHACH_HANG", e.target.value)
                        }}
                        placeholder="Họ và tên đầy đủ..."
                        className="h-9 text-xs bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">
                          Số CMND / CCCD / MST
                        </Label>
                        <code className="text-[10px] font-mono text-muted-foreground">{"{{CCCD_MST}}"}</code>
                      </div>
                      <Input
                        value={cccd}
                        onChange={(e) => {
                          setCccd(e.target.value)
                          handleVariableChange("CCCD_MST", e.target.value)
                        }}
                        placeholder="Ví dụ: 049090001234..."
                        className="h-9 text-xs bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">
                          Số điện thoại liên hệ
                        </Label>
                        <code className="text-[10px] font-mono text-muted-foreground">{"{{SO_DIEN_THOAI}}"}</code>
                      </div>
                      <Input
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)
                          handleVariableChange("SO_DIEN_THOAI", e.target.value)
                        }}
                        placeholder="Ví dụ: 0901234567..."
                        className="h-9 text-xs bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">
                          Địa chỉ Email
                        </Label>
                        <code className="text-[10px] font-mono text-muted-foreground">{"{{EMAIL}}"}</code>
                      </div>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          handleVariableChange("EMAIL", e.target.value)
                        }}
                        placeholder="khachhang@example.com..."
                        className="h-9 text-xs bg-background"
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">
                          Địa chỉ thường trú / Liên hệ
                        </Label>
                        <code className="text-[10px] font-mono text-muted-foreground">{"{{DIA_CHI}}"}</code>
                      </div>
                      <Input
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value)
                          handleVariableChange("DIA_CHI", e.target.value)
                        }}
                        placeholder="Địa chỉ thường trú chi tiết..."
                        className="h-9 text-xs bg-background"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CARD 2: THÔNG SỐ HỢP ĐỒNG & GIÁ TRỊ CAM KẾT */}
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 pt-4 px-5">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Thông số Hợp đồng & Giá trị Cam kết
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Thiết lập tiêu đề, các mức giá trị và thời hạn hiệu lực của hợp đồng.
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-5 pb-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="col-span-1 sm:col-span-2 space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">
                        Tiêu đề hợp đồng <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Tiêu đề hợp đồng..."
                        className="h-9 text-xs bg-background font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">
                        Thời hạn hiệu lực đến ngày
                      </Label>
                      <DatePicker
                        value={expiredAtDate}
                        onValueChange={(d) => {
                          setExpiredAtDate(d)
                          handleVariableChange("NGAY_HET_HAN", formatDateDisplay(d))
                        }}
                        placeholder="Chọn ngày hết hạn..."
                        className="h-9 text-xs w-full bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">
                          Tổng giá trị hợp đồng (VNĐ)
                        </Label>
                        <code className="text-[10px] font-mono text-muted-foreground">{"{{TONG_GIA_TRI}}"}</code>
                      </div>
                      <Input
                        type="number"
                        value={contractValue}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          setContractValue(val)
                          handleVariableChange("TONG_GIA_TRI", formatNumberVND(val))
                          handleVariableChange("TONG_GIA_TRI_CHU", formatNumberVND(val))
                        }}
                        className="h-9 text-xs bg-background font-mono"
                      />
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatNumberVND(contractValue)}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">
                          Phí ủy thác chăm sóc (VNĐ/năm)
                        </Label>
                        <code className="text-[10px] font-mono text-muted-foreground">{"{{PHI_CHAM_SOC}}"}</code>
                      </div>
                      <Input
                        type="number"
                        value={careFee}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          setCareFee(val)
                          handleVariableChange("PHI_CHAM_SOC", formatNumberVND(val))
                          handleVariableChange("PHI_CHAM_SOC_CHU", formatNumberVND(val))
                        }}
                        className="h-9 text-xs bg-background font-mono"
                      />
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatNumberVND(careFee)}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">
                          Số lượng cây sâm bàn giao
                        </Label>
                        <code className="text-[10px] font-mono text-muted-foreground">{"{{SO_LUONG_CAY}}"}</code>
                      </div>
                      <Input
                        type="number"
                        min={1}
                        value={totalPlants}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          setTotalPlants(val)
                          handleVariableChange("SO_LUONG_CAY", String(val))
                          handleVariableChange("SO_LUONG_CAY_CHU", `${val} cây sâm`)
                        }}
                        className="h-9 text-xs bg-background font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <Label className="text-xs font-semibold text-foreground">
                      Điều khoản bổ sung / Thỏa thuận riêng
                    </Label>
                    <Textarea
                      rows={2}
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      placeholder="Cam kết bảo hiểm sinh trưởng 100% tại vườn Nam Trà My..."
                      className="text-xs bg-background"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* CARD 3: CÁC TRƯỜNG MỞ RỘNG THEO MẪU HỢP ĐỒNG */}
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-600" />
                      <CardTitle className="text-sm font-bold">
                        Các trường biến số mở rộng theo mẫu (Tự động phát hiện)
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200">
                      {extraFieldTags.length} trường tùy biến
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Các biến số đặc thù được tìm thấy trong mã HTML của mẫu hợp đồng.
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-5 pb-5 space-y-4">
                  {extraFieldTags.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic py-2">
                      Mẫu hiện tại đang sử dụng đầy đủ các trường chuẩn pháp lý. Bạn có thể thêm trường tùy biến mới bằng khung bên dưới nếu mẫu HTML có thêm biến riêng.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {extraFieldTags.map((tagKey) => {
                        const info = KNOWN_PLACEHOLDER_LABELS[tagKey] || {
                          label: `Trường: ${tagKey}`,
                          desc: `Biến tùy biến {{${tagKey}}}`,
                        }
                        const currentValue = customVariables[tagKey] || ""

                        return (
                          <div
                            key={tagKey}
                            className="p-3 rounded-lg border border-border bg-muted/20 hover:border-emerald-500/50 transition-colors space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <Label className="text-xs font-semibold text-foreground truncate" title={info.label}>
                                {info.label}
                              </Label>
                              <code className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded">
                                {`{{${tagKey}}}`}
                              </code>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Input
                                value={currentValue}
                                onChange={(e) => handleVariableChange(tagKey, e.target.value)}
                                placeholder={`Nhập ${info.label.toLowerCase()}...`}
                                className="h-8 text-xs bg-background"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteCustomVariable(tagKey)}
                                className="h-8 w-8 text-slate-400 hover:text-rose-500 shrink-0"
                                title="Xóa trường này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* ADD CUSTOM FIELD INLINE FORM */}
                  <div className="pt-3 border-t flex flex-col sm:flex-row items-center gap-2">
                    <Input
                      value={newVarKey}
                      onChange={(e) => setNewVarKey(e.target.value)}
                      placeholder="Mã biến mới (ví dụ: SO_TAI_KHOAN)..."
                      className="h-8 text-xs font-mono uppercase bg-background"
                    />
                    <Input
                      value={newVarVal}
                      onChange={(e) => setNewVarVal(e.target.value)}
                      placeholder="Giá trị mặc định..."
                      className="h-8 text-xs bg-background"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCustomVariable}
                      className="h-8 text-xs gap-1 shrink-0 font-medium cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Thêm trường</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: SOẠN THẢO MÃ HTML */}
          {/* ========================================================================= */}
          {activeTab === "editor" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 bg-muted/30 border border-border/70 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs font-sans">
                <div className="flex items-center gap-2 text-muted-foreground font-sans">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Chèn các thẻ <code className="font-mono font-bold text-foreground">{"{{TÊN_BIẾN}}"}</code> vào bất kỳ vị trí nào trong mã HTML. Hệ thống sẽ tự động bắt và tạo ô nhập liệu ở Thẻ 1.
                  </span>
                </div>

                <Button
                  size="sm"
                  type="button"
                  onClick={handleApplyPermanentReplacement}
                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 cursor-pointer font-sans"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Điền vĩnh viễn vào văn bản
                </Button>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contentEditor" className="text-xs font-semibold text-foreground font-sans">
                  Mã nguồn văn bản hợp đồng
                </Label>
                <Textarea
                  id="contentEditor"
                  rows={16}
                  className="font-mono text-xs leading-relaxed bg-background p-4 border-border/80 focus-visible:ring-emerald-500/20"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập mã HTML hợp đồng..."
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: XEM TRƯỚC HỢP ĐỒNG (LIVE PREVIEW) */}
          {/* ========================================================================= */}
          {activeTab === "preview" && (
            <div className="space-y-3 animate-in fade-in duration-200 font-sans pb-2">
              <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-900 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-medium font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Văn bản hiển thị thực tế sau khi đã điền đầy đủ các trường biến số {"{{"} {"}}"}:</span>
                </div>
                <Badge className="bg-emerald-600 text-white font-sans text-[10px] font-semibold shrink-0">
                  Xem trước trực tiếp
                </Badge>
              </div>

              {/* ISOLATED IFRAME PREVIEW - ZERO CSS LEAKAGE */}
              <div className="w-full rounded-xl border border-border overflow-hidden bg-white shadow-sm">
                <iframe
                  title="Xem trước văn bản hợp đồng"
                  srcDoc={renderedInterpolatedHtml}
                  className="w-full h-[580px] min-h-[480px] border-0 bg-white"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <DialogFooter className="shrink-0 px-6 py-3 border-t border-border/70 bg-muted/20 flex flex-row items-center justify-between sm:justify-between font-sans">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer font-sans"
          >
            Đóng
          </Button>

          <div className="flex items-center gap-2.5">
            {activeTab !== "preview" ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("preview")}
                className="h-8 gap-1.5 text-xs font-semibold cursor-pointer border-border hover:bg-background font-sans"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                Xem trước hợp đồng
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("variables")}
                className="h-8 gap-1.5 text-xs font-semibold cursor-pointer border-border hover:bg-background font-sans"
              >
                <User className="w-3.5 h-3.5" />
                Quay lại sửa biến số
              </Button>
            )}

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer px-4 font-sans"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
