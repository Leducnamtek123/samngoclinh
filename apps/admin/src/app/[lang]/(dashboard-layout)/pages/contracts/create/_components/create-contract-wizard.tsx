"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  Sparkles,
  TreeDeciduous,
  Send,
  Save,
  Check,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { fetchApi } from "@/lib/api"

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

interface CreateContractWizardProps {
  users: UserItem[]
  trees: TreeItem[]
  lang: string
}

const STEPS = [
  { id: 1, title: "Thông tin", desc: "Khách hàng & Loại hợp đồng" },
  { id: 2, title: "Điều khoản", desc: "Giá trị & Thời hạn hiệu lực" },
  { id: 3, title: "Nội dung", desc: "Mẫu văn bản & Xem trước" },
  { id: 4, title: "Phát hành", desc: "Kiểm tra & Xác nhận gửi" },
]

export function CreateContractWizard({ users, trees, lang }: CreateContractWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1: Info
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || "")
  const [contractType, setContractType] = useState<string>("purchase_and_care")
  const [selectedTreeCode, setSelectedTreeCode] = useState<string>("none")
  const [title, setTitle] = useState<string>("Hợp đồng Mua bán, Ký gửi & Chăm sóc Cây Sâm Ngọc Linh")

  // Step 2: Commercial Terms
  const [contractValue, setContractValue] = useState<number>(5000000)
  const [paymentStatus, setPaymentStatus] = useState<string>("unpaid")
  const [partyA, setPartyA] = useState<string>("Công ty Cổ phần Sâm Ngọc Linh")
  const [partyB, setPartyB] = useState<string>("")
  const [expiredAt, setExpiredAt] = useState<string>(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 2)
    return d.toISOString().substring(0, 10)
  })
  const [customTerms, setCustomTerms] = useState<string>("")

  // Step 3: Templates
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string>(
    "hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
  )
  const [rawTemplateHtml, setRawTemplateHtml] = useState<string>("")
  const [renderedPreviewHtml, setRenderedPreviewHtml] = useState<string>("")
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<boolean>(false)

  // Selected User Object
  const selectedUser = users.find((u) => u.id === selectedUserId)

  // Auto-fill Party B when User changes
  useEffect(() => {
    if (selectedUser) {
      const userPhone = selectedUser.mobileNumbers?.[0]?.number || ""
      const phoneStr = userPhone ? ` - SĐT: ${userPhone}` : ""
      setPartyB(`${selectedUser.name || selectedUser.username || "Khách hàng"}${phoneStr}`)
    }
  }, [selectedUserId, selectedUser])

  // Fetch Template HTML
  useEffect(() => {
    const fetchTemplate = async () => {
      setIsLoadingTemplate(true)
      try {
        const res = await fetchApi(`/public/contracts/templates/${selectedTemplateSlug}`)
        const payload = await res.json()
        if (res.status < 400 && payload.data?.contentHtml) {
          setRawTemplateHtml(payload.data.contentHtml)
        }
      } catch (err) {
        console.error("Failed to load template:", err)
      } finally {
        setIsLoadingTemplate(false)
      }
    }
    fetchTemplate()
  }, [selectedTemplateSlug])

  // Compute Live Rendered HTML with placeholders replaced
  useEffect(() => {
    if (!rawTemplateHtml) {
      setRenderedPreviewHtml("<p class='p-6 text-slate-500'>Đang tải nội dung mẫu hợp đồng...</p>")
      return
    }

    const customerName = selectedUser?.name || selectedUser?.username || "Quý Khách Hàng"
    const customerPhone = selectedUser?.mobileNumbers?.[0]?.number || "090xxxxxxx"
    const todayStr = new Date().toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
    const valueFormatted = contractValue.toLocaleString("vi-VN")

    let result = rawTemplateHtml
      .split("{{TEN_KHACH_HANG}}").join(customerName)
      .split("{{SO_DIEN_THOAI}}").join(customerPhone)
      .split("{{TONG_GIA_TRI}}").join(valueFormatted)
      .split("{{MA_HOP_DONG}}").join("CTR-MANUAL-" + new Date().getFullYear())
      .split("{{NGAY_KY}}").join(todayStr)
      .split("{{SO_LUONG_CAY}}").join(selectedTreeCode !== "none" ? "1" : "1")

    setRenderedPreviewHtml(result)
  }, [rawTemplateHtml, selectedUser, contractValue, selectedTreeCode])

  // Validation Checks
  const isStep1Valid = Boolean(selectedUserId && contractType && title.trim())
  const isStep2Valid = contractValue > 0 && Boolean(expiredAt && partyA && partyB)
  const isStep3Valid = Boolean(renderedPreviewHtml)

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
        content: `Hợp đồng ${contractType === "purchase_and_care" ? "Mua bán & Ký gửi Chăm sóc" : "Ký gửi"} Sâm Ngọc Linh lập thủ công cho khách hàng ${selectedUser?.name || selectedUserId}.`,
        contractValue,
        paymentStatus,
        status: publishStatus,
        expiredAt: new Date(expiredAt).toISOString(),
        contractType,
        partyA,
        partyB,
        terms: customTerms.trim() || undefined,
        metadata: {
          source: "manual",
          isManualIssued: true,
          templateSlug: selectedTemplateSlug,
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <Link
            href={`/${lang}/pages/contracts`}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách hợp đồng
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tạo hợp đồng thủ công
            </h1>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300">
              Tạo thủ công
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Tạo hợp đồng cho các giao dịch không phát sinh tự động từ đơn hàng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={isSubmitting || !isStep1Valid}
            className="gap-1.5"
          >
            <Save className="w-4 h-4" /> Lưu bản nháp
          </Button>
          {currentStep === 4 ? (
            <Button
              onClick={() => handleSubmit("pending")}
              disabled={isSubmitting || !isStep1Valid || !isStep2Valid}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <Send className="w-4 h-4" /> Phát hành hợp đồng
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-1.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STEPS.map((s) => {
          const isActive = s.id === currentStep
          const isCompleted = s.id < currentStep

          return (
            <button
              key={s.id}
              onClick={() => s.id < currentStep && setCurrentStep(s.id)}
              disabled={s.id > currentStep}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                isActive
                  ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                  : isCompleted
                  ? "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-slate-300"
                  : "bg-white border-slate-200/60 opacity-60 dark:bg-slate-950 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 inline" /> : `0${s.id}`}
                </span>
                {isCompleted && (
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase">Hoàn tất</span>
                )}
              </div>
              <p className={`mt-2 font-bold text-sm leading-tight ${isActive ? "text-primary" : "text-slate-800 dark:text-slate-200"}`}>
                {s.title}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{s.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {/* STEP 1: GENERAL INFO */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="w-5 h-5 text-primary" /> 1. Khách hàng
                  </CardTitle>
                  <CardDescription>
                    Chọn khách hàng đại diện Bên B tham gia ký kết hợp đồng.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerSelect">Chọn khách hàng *</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger id="customerSelect" className="w-full">
                        <SelectValue placeholder="-- Chọn khách hàng --" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{u.name || u.username}</span>
                              <span className="text-muted-foreground text-xs">({u.email})</span>
                              {u.isVerified && (
                                <Badge variant="secondary" className="text-[10px] px-1 py-0 bg-emerald-100 text-emerald-800">
                                  eKYC
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedUser && (
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {selectedUser.name || selectedUser.username}
                          </span>
                          {selectedUser.isVerified ? (
                            <Badge className="bg-emerald-600 text-white gap-1 text-[10px]">
                              <UserCheck className="w-3 h-3" /> Đã xác thực eKYC
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">
                              Chưa xác thực eKYC
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                        {selectedUser.mobileNumbers?.[0]?.number && (
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            SĐT: <span className="font-medium">{selectedUser.mobileNumbers[0].number}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        <span>Mã tài khoản: </span>
                        <code className="font-mono text-[11px] bg-slate-200/80 dark:bg-slate-800 px-1 py-0.5 rounded">
                          {selectedUser.id.slice(0, 12)}...
                        </code>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Thông tin hợp đồng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleInput">Tiêu đề hợp đồng *</Label>
                    <Input
                      id="titleInput"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ví dụ: Hợp đồng Mua bán và Ký gửi Chăm sóc Sâm Ngọc Linh"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nguồn phát sinh</Label>
                      <Input
                        value="Tạo thủ công"
                        disabled
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Loại hợp đồng *</Label>
                      <Select value={contractType} onValueChange={setContractType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="purchase_and_care">Mua bán & Ký gửi chăm sóc</SelectItem>
                          <SelectItem value="purchase">Mua bán sâm</SelectItem>
                          <SelectItem value="consignment">Ký gửi chăm sóc</SelectItem>
                          <SelectItem value="care">Dịch vụ chăm sóc</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="treeSelect">Gắn mã cây sâm</Label>
                    <Select value={selectedTreeCode} onValueChange={setSelectedTreeCode}>
                      <SelectTrigger id="treeSelect">
                        <SelectValue placeholder="-- Không gắn mã cây cụ thể --" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="none">-- Không gắn mã cây cụ thể --</SelectItem>
                        {trees.map((t) => (
                          <SelectItem key={t.id} value={t.code}>
                            {t.code} - {t.name} {t.ageYear ? `(${t.ageYear} năm tuổi)` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Guide Card */}
            <div className="space-y-4">
              <Card className="bg-slate-50/70 dark:bg-slate-900/50 border-dashed border-slate-300 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Lưu ý khi tạo hợp đồng thủ công
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
                  <p>
                    <strong>1. Phát sinh tự động:</strong> Khách mua sâm trực tuyến sẽ được hệ thống tự động tạo hợp đồng khi đơn hàng thanh toán thành công.
                  </p>
                  <p>
                    <strong>2. Khách hàng nhận thông báo:</strong> Sau khi phát hành ở trạng thái <em>Chờ ký</em>, khách hàng sẽ thấy văn bản trên tài khoản để ký điện tử.
                  </p>
                  <p>
                    <strong>3. Chứng thực số:</strong> Sau khi khách ký, hệ thống tự động xác thực và gắn mã tra cứu.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 2: COMMERCIAL TERMS */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600" /> Điều khoản hợp đồng
                </CardTitle>
                <CardDescription>
                  Thiết lập giá trị hợp đồng, trạng thái thanh toán và thời hạn hiệu lực.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="valueInput">Tổng giá trị hợp đồng *</Label>
                    <Input
                      id="valueInput"
                      type="number"
                      min={0}
                      step={100000}
                      value={contractValue}
                      onChange={(e) => setContractValue(Number(e.target.value) || 0)}
                      className="font-semibold text-lg"
                    />
                    <p className="text-xs font-medium text-emerald-600">
                      Bằng chữ: {contractValue.toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Trạng thái thanh toán *</Label>
                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                        <SelectItem value="paid">Đã thanh toán</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expiredDate">Thời hạn hiệu lực đến ngày *</Label>
                    <Input
                      id="expiredDate"
                      type="date"
                      value={expiredAt}
                      onChange={(e) => setExpiredAt(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Bên A</Label>
                    <Input value={partyA} onChange={(e) => setPartyA(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bên B</Label>
                  <Input value={partyB} onChange={(e) => setPartyB(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termsInput">Điều khoản bổ sung</Label>
                  <Textarea
                    id="termsInput"
                    rows={3}
                    value={customTerms}
                    onChange={(e) => setCustomTerms(e.target.value)}
                    placeholder="Ghi chú thêm các cam kết hoặc thỏa thuận riêng nếu có..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 3: CONTENT & TEMPLATE */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Template config */}
            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Mẫu hợp đồng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Mẫu hợp đồng</Label>
                    <Select value={selectedTemplateSlug} onValueChange={setSelectedTemplateSlug}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh">
                          HĐ Mua bán & Ký gửi chăm sóc
                        </SelectItem>
                        <SelectItem value="dieu-khoan-su-dung">
                          Điều khoản sử dụng
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-900 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Biến mẫu tự động điền:
                    </span>
                    <div className="text-xs space-y-1.5 font-mono text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>{"{{TEN_KHACH_HANG}}"}:</span>
                        <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                          {selectedUser?.name || "Khách hàng"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{"{{SO_DIEN_THOAI}}"}:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {selectedUser?.mobileNumbers?.[0]?.number || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{"{{TONG_GIA_TRI}}"}:</span>
                        <span className="font-bold text-emerald-600">
                          {contractValue.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{"{{NGAY_KY}}"}:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {new Date().toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Live A4 Preview */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Xem trước văn bản
                </span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">
                  Tự động điền dữ liệu
                </Badge>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
                <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <iframe
                    title="Xem trước văn bản"
                    srcDoc={renderedPreviewHtml}
                    className="w-full h-[650px] min-h-[500px] border-0 bg-white"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & PUBLISH */}
        {currentStep === 4 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-emerald-200 dark:border-emerald-950 shadow-md">
              <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" /> 4. Kiểm tra & Phát hành
                </CardTitle>
                <CardDescription>
                  Vui lòng kiểm tra lại toàn bộ thông tin trước khi phát hành hợp đồng.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Tiêu đề hợp đồng:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{title}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Nguồn phát sinh:</span>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Tạo thủ công
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Khách hàng:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedUser?.name || selectedUser?.username} ({selectedUser?.email})
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Xác thực eKYC:</span>
                    {selectedUser?.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <UserCheck className="w-3.5 h-3.5" /> Đã xác thực eKYC
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600">Chưa xác thực eKYC</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Tổng giá trị hợp đồng:</span>
                    <span className="text-base font-extrabold text-primary">
                      {contractValue.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Trạng thái thanh toán:</span>
                    <Badge
                      variant="outline"
                      className={
                        paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }
                    >
                      {paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Mã cây sâm gắn kết:</span>
                    <span className="font-mono text-xs">
                      {selectedTreeCode !== "none" ? selectedTreeCode : "Quản lý theo số lượng"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Thời hạn hiệu lực:</span>
                    <span className="font-semibold">
                      {new Date(expiredAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                    </span>
                  </div>
                </div>

                {/* Validation Checklist */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Điều kiện phát hành:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Khách hàng chủ hợp đồng đã được xác định hợp lệ ({selectedUser?.email}).</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Giá trị hợp đồng ({contractValue.toLocaleString("vi-VN")} đ) và ngày hiệu lực hợp lệ.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Mẫu hợp đồng đã sẵn sàng điền tự động.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Xem lại nội dung
                </Button>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit("draft")}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none"
                  >
                    <Save className="w-4 h-4 mr-1.5" /> Lưu bản nháp
                  </Button>
                  <Button
                    onClick={() => handleSubmit("pending")}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                  >
                    <Send className="w-4 h-4 mr-1.5" /> Phát hành hợp đồng
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentStep === 1 || isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
        </Button>
        {currentStep < 4 && (
          <Button onClick={handleNext} className="gap-1.5">
            Tiếp tục bước {currentStep + 1} <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
