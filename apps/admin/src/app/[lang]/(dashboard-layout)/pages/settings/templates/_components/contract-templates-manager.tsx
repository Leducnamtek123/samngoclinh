"use client"

import { useEffect, useState } from "react"
import {
  Check,
  Code,
  Copy,
  Eye,
  FileText,
  Info,
  Loader2,
  RefreshCw,
  Save,
  Upload,
} from "lucide-react"

import { fetchApi } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface ContractTemplateItem {
  slug: string
  title: string
  type: "CONTRACT" | "POLICY"
  version: string
  description: string
  lastModified: string
  contentHtml: string
  availablePlaceholders?: Array<{ code: string; label: string; example: string }>
}

export function ContractTemplatesManager() {
  const [templates, setTemplates] = useState<ContractTemplateItem[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string>(
    "hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
  )
  const [currentTemplate, setCurrentTemplate] = useState<ContractTemplateItem | null>(null)
  const [htmlContent, setHtmlContent] = useState<string>("")
  const [version, setVersion] = useState<string>("2.0.0")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Load templates list
  const loadTemplates = async () => {
    setIsLoading(true)
    setStatusMessage(null)
    try {
      let res = await fetchApi("/admin/contracts/templates")
      let payload = await res.json()
      if (res.status >= 400 || !payload.data) {
        res = await fetchApi("/public/contracts/templates")
        payload = await res.json()
      }
      if (res.status < 400 && payload.data) {
        setTemplates(payload.data)
        const active = payload.data.find(
          (t: ContractTemplateItem) => t.slug === selectedSlug
        ) || payload.data[0]
        if (active) {
          setSelectedSlug(active.slug)
          setCurrentTemplate(active)
          setHtmlContent(active.contentHtml)
          setVersion(active.version || "2.0.0")
          setTitle(active.title || "")
          setDescription(active.description || "")
        }
      } else {
        setStatusMessage({
          type: "error",
          text: payload.message || "Không thể tải danh sách mẫu.",
        })
      }
    } catch (e: any) {
      console.error("Error loading templates:", e)
      setStatusMessage({
        type: "error",
        text: "Không thể kết nối đến máy chủ để tải mẫu.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  // Switch selected template
  const handleSelectTemplate = (slug: string) => {
    setSelectedSlug(slug)
    const found = templates.find((t) => t.slug === slug)
    if (found) {
      setCurrentTemplate(found)
      setHtmlContent(found.contentHtml)
      setVersion(found.version || "2.0.0")
      setTitle(found.title || "")
      setDescription(found.description || "")
      setStatusMessage(null)
    }
  }

  // Save changes
  const handleSave = async () => {
    if (!selectedSlug) return
    setIsSaving(true)
    setStatusMessage(null)
    try {
      const res = await fetchApi(`/admin/contracts/templates/${selectedSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          version,
          description,
          contentHtml: htmlContent,
        }),
      })
      const payload = await res.json()
      if (res.status < 400 && payload.data) {
        setStatusMessage({
          type: "success",
          text: `Đã lưu thành công mẫu "${title}" (Phiên bản ${version}).`,
        })
        // Update local template record
        setTemplates((prev) =>
          prev.map((t) => (t.slug === selectedSlug ? payload.data : t))
        )
        setCurrentTemplate(payload.data)
      } else {
        setStatusMessage({
          type: "error",
          text: payload.message || "Lưu mẫu thất bại.",
        })
      }
    } catch (e: any) {
      console.error("Error saving template:", e)
      setStatusMessage({
        type: "error",
        text: "Lỗi kết nối khi lưu mẫu.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Import HTML from local file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        setHtmlContent(content)
        setStatusMessage({
          type: "success",
          text: `Đã tải tệp "${file.name}" thành công. Hãy kiểm tra và nhấn "Lưu thay đổi".`,
        })
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  // Helper to replace placeholders for preview
  const getRenderedPreviewHtml = (rawHtml: string) => {
    if (!rawHtml) return "<div style='font-family:sans-serif;padding:20px;color:#888;text-align:center;'>Chưa có nội dung xem trước</div>"
    
    return rawHtml
      .replace(/\{\{TEN_KHACH_HANG\}\}/g, "NGUYỄN VĂN AN (MẪU)")
      .replace(/\{\{CCCD_MST\}\}/g, "079090001234")
      .replace(/\{\{DIA_CHI\}\}/g, "Hải Châu, TP. Đà Nẵng")
      .replace(/\{\{SO_DIEN_THOAI\}\}/g, "0905 123 456")
      .replace(/\{\{EMAIL\}\}/g, "nguyenvanan.sample@gmail.com")
      .replace(/\{\{MA_HOP_DONG\}\}/g, "HĐ-DEMO/2026/SNL")
      .replace(/\{\{SO_LUONG_CAY\}\}/g, "10")
      .replace(/\{\{SO_LUONG_CAY_CHU\}\}/g, "Mười cây")
      .replace(/\{\{TONG_GIA_TRI\}\}/g, "2.800.000")
      .replace(/\{\{TONG_GIA_TRI_CHU\}\}/g, "Hai triệu tám trăm nghìn đồng")
      .replace(/\{\{PHI_CHAM_SOC\}\}/g, "1.500.000")
      .replace(/\{\{PHI_CHAM_SOC_CHU\}\}/g, "Một triệu năm trăm nghìn đồng")
      .replace(/\{\{NGAY_KY\}\}/g, new Date().toLocaleDateString("vi-VN"))
      .replace(/\{\{THOI_HAN_NAM\}\}/g, "03")
      .replace(/\{\{NGAY_HET_HAN\}\}/g, new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN"))
  }

  // Insert placeholder at cursor
  const handleInsertPlaceholder = (code: string) => {
    setHtmlContent((prev) => prev + `\n${code}`)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quản lý mẫu hợp đồng
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadTemplates}
            disabled={isLoading}
            className="h-9 gap-1.5 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="h-9 bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5 text-xs font-medium"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Lưu thay đổi</span>
          </Button>
        </div>
      </div>

      {/* Status Alert Notification */}
      {statusMessage && (
        <Alert
          variant={statusMessage.type === "error" ? "destructive" : "default"}
          className={
            statusMessage.type === "success"
              ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
              : ""
          }
        >
          {statusMessage.type === "success" ? (
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : null}
          <AlertTitle className="font-bold">
            {statusMessage.type === "success" ? "Thành công" : "Thông báo lỗi"}
          </AlertTitle>
          <AlertDescription>{statusMessage.text}</AlertDescription>
        </Alert>
      )}

      {/* Main Grid: Template Selector & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Template Selection Cards */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Danh sách mẫu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {templates.map((tpl) => {
                const isSelected = tpl.slug === selectedSlug
                return (
                  <button
                    key={tpl.slug}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.slug)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600 dark:bg-emerald-950/40"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <Badge
                        variant="secondary"
                        className={
                          tpl.type === "CONTRACT"
                            ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300"
                        }
                      >
                        {tpl.type === "CONTRACT" ? "Hợp đồng" : "Điều khoản"}
                      </Badge>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        v{tpl.version}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-foreground line-clamp-2">
                      {tpl.title}
                    </p>
                    {tpl.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-1">
                        {tpl.description}
                      </p>
                    )}
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Variables Reference Box */}
          {currentTemplate?.availablePlaceholders &&
            currentTemplate.availablePlaceholders.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                      <Code className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Biến mẫu</span>
                    </CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs max-w-xs">
                          Giá trị được hệ thống tự động thay thế khi tạo hợp đồng.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {currentTemplate.availablePlaceholders.map((ph) => (
                    <div
                      key={ph.code}
                      onClick={() => handleInsertPlaceholder(ph.code)}
                      className="p-2 rounded-lg border border-border/80 hover:border-emerald-400 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 cursor-pointer transition-colors text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                        <span>{ph.code}</span>
                        {copiedCode === ph.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-muted-foreground opacity-60" />
                        )}
                      </div>
                      <p className="text-[11px] text-foreground font-medium">{ph.label}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
        </div>

        {/* Right Column: Editor & Preview Workspace */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <CardTitle className="text-base font-bold">
                    {title || currentTemplate?.title}
                  </CardTitle>
                </div>

                {/* Import File Button */}
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="html-file-input"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg cursor-pointer text-xs font-bold border transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải tệp HTML lên</span>
                  </Label>
                  <input
                    id="html-file-input"
                    type="file"
                    accept=".html,.htm"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Metadata Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Tên mẫu</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Tên mẫu..."
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Label className="text-xs font-semibold">Phiên bản</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs max-w-xs">
                          Dùng để theo dõi các lần cập nhật của mẫu.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="2.0.0"
                    className="h-8 text-xs mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Mô tả</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả mẫu..."
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Editor / Preview Switcher Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as "editor" | "preview")}
                className="w-full pt-2"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <TabsList className="h-8">
                    <TabsTrigger value="editor" className="text-xs gap-1.5 px-3">
                      <Code className="w-3.5 h-3.5" />
                      <span>Mã HTML</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-muted-foreground hover:text-foreground ml-0.5" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs max-w-xs">
                            Nội dung HTML dùng để hiển thị mẫu văn bản.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs gap-1.5 px-3">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem trước</span>
                    </TabsTrigger>
                  </TabsList>

                  <span className="text-[11px] text-muted-foreground font-mono">
                    Độ dài: {htmlContent.length.toLocaleString()} ký tự
                  </span>
                </div>

                {/* Tab 1: Raw HTML Textarea Editor */}
                <TabsContent value="editor" className="pt-3 space-y-2">
                  <Textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="Nhập hoặc dán mã HTML tại đây..."
                    className="min-h-[500px] font-mono text-xs leading-relaxed p-4 bg-slate-950 text-emerald-400 border-slate-800 rounded-xl focus-visible:ring-emerald-500"
                    spellCheck={false}
                  />
                </TabsContent>

                {/* Tab 2: HTML Rendering Container (Sandboxed Iframe) */}
                <TabsContent value="preview" className="pt-3">
                  <div className="border border-border rounded-2xl bg-slate-100 dark:bg-slate-900/60 p-2 sm:p-4 shadow-inner">
                    <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                      <iframe
                        title="Xem trước văn bản"
                        srcDoc={getRenderedPreviewHtml(htmlContent)}
                        className="w-full h-[700px] min-h-[550px] border-0 bg-white"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
