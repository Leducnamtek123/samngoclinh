"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Check, Loader2, RefreshCw, Save } from "lucide-react"

import { fetchApi } from "@/lib/api"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { TemplateEditorPreview } from "./template-editor-preview"
import { TemplateSidebar } from "./template-sidebar"

export interface ContractTemplateItem {
  slug: string
  title: string
  type: "CONTRACT" | "POLICY"
  version: string
  description: string
  lastModified: string
  contentHtml: string
  availablePlaceholders: { code: string; label: string }[]
}

export interface TemplateFormState {
  htmlContent: string
  version: string
  title: string
  description: string
}

const getRenderedPreviewHtml = (rawHtml: string) => {
  if (!rawHtml)
    return "<div style='font-family:sans-serif;padding:20px;color:#888;text-align:center;'>Chưa có nội dung xem trước</div>"

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
    .replace(/\{\{NGAY_KY\}\}/g, "16/08/2026")
    .replace(/\{\{THOI_HAN_NAM\}\}/g, "03")
    .replace(/\{\{NGAY_HET_HAN\}\}/g, "16/08/2029")
}

export function ContractTemplatesManager() {
  const [templates, setTemplates] = useState<ContractTemplateItem[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string>(
    "hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
  )
  const [currentTemplate, setCurrentTemplate] =
    useState<ContractTemplateItem | null>(null)
  const [formState, setFormState] = useState<TemplateFormState>({
    htmlContent: "",
    version: "2.0.0",
    title: "",
    description: "",
  })
  const { htmlContent, version, title, description } = formState

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Load templates list
  const loadTemplates = useCallback(async () => {
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
        const active =
          payload.data.find(
            (t: ContractTemplateItem) => t.slug === selectedSlug
          ) || payload.data[0]
        if (active) {
          setSelectedSlug(active.slug)
          setCurrentTemplate(active)
          setFormState({
            htmlContent: active.contentHtml || "",
            version: active.version || "2.0.0",
            title: active.title || "",
            description: active.description || "",
          })
        }
      } else {
        setStatusMessage({
          type: "error",
          text: payload.message || "Không thể tải danh sách mẫu.",
        })
      }
    } catch (e: unknown) {
      console.error("Error loading templates:", e)
      setStatusMessage({
        type: "error",
        text: "Không thể kết nối đến máy chủ để tải mẫu.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [selectedSlug])

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  // Switch selected template
  const handleSelectTemplate = (slug: string) => {
    setSelectedSlug(slug)
    const found = templates.find((t) => t.slug === slug)
    if (found) {
      setCurrentTemplate(found)
      setFormState({
        htmlContent: found.contentHtml || "",
        version: found.version || "2.0.0",
        title: found.title || "",
        description: found.description || "",
      })
      setStatusMessage(null)
    }
  }

  // Save template updates
  const handleSave = async () => {
    if (!currentTemplate) return
    setIsSaving(true)
    setStatusMessage(null)

    try {
      const res = await fetchApi(
        `/admin/contracts/templates/${currentTemplate.slug}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            version,
            description,
            contentHtml: htmlContent,
          }),
        }
      )
      const payload = await res.json()
      if (res.status < 400 && payload.data) {
        setStatusMessage({
          type: "success",
          text: "Mẫu hợp đồng đã được lưu và cập nhật thành công!",
        })
        setTemplates((prev) =>
          prev.map((t) => (t.slug === currentTemplate.slug ? payload.data : t))
        )
        setCurrentTemplate(payload.data)
      } else {
        setStatusMessage({
          type: "error",
          text: payload.message || "Lỗi khi cập nhật mẫu.",
        })
      }
    } catch (e: unknown) {
      console.error("Error saving template:", e)
      setStatusMessage({
        type: "error",
        text: "Không thể kết nối máy chủ để lưu mẫu.",
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
        setFormState((prev) => ({ ...prev, htmlContent: content }))
        setStatusMessage({
          type: "success",
          text: `Đã tải tệp "${file.name}" thành công. Hãy kiểm tra và nhấn "Lưu thay đổi".`,
        })
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  // Insert placeholder at cursor
  const handleInsertPlaceholder = (code: string) => {
    setFormState((prev) => ({
      ...prev,
      htmlContent: prev.htmlContent + `\n${code}`,
    }))
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
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
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
        <TemplateSidebar
          templates={templates}
          selectedSlug={selectedSlug}
          onSelectTemplate={handleSelectTemplate}
          currentTemplate={currentTemplate}
          onInsertPlaceholder={handleInsertPlaceholder}
          copiedCode={copiedCode}
        />

        <TemplateEditorPreview
          title={title}
          version={version}
          description={description}
          htmlContent={htmlContent}
          currentTemplate={currentTemplate}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onFormStateChange={setFormState}
          onFileUpload={handleFileUpload}
          getRenderedPreviewHtml={getRenderedPreviewHtml}
        />
      </div>
    </div>
  )
}
