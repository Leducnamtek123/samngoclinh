"use client"

import React from "react"
import { Code, Eye, FileText, Info, Upload } from "lucide-react"
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
import type { ContractTemplateItem, TemplateFormState } from "./contract-templates-manager"

interface TemplateEditorPreviewProps {
  title: string
  version: string
  description: string
  htmlContent: string
  currentTemplate: ContractTemplateItem | null
  activeTab: "editor" | "preview"
  setActiveTab: (tab: "editor" | "preview") => void
  onFormStateChange: (updater: (prev: TemplateFormState) => TemplateFormState) => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  getRenderedPreviewHtml: (rawHtml: string) => string
}

export function TemplateEditorPreview({
  title,
  version,
  description,
  htmlContent,
  currentTemplate,
  activeTab,
  setActiveTab,
  onFormStateChange,
  onFileUpload,
  getRenderedPreviewHtml,
}: TemplateEditorPreviewProps) {
  return (
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
              <input
                type="file"
                id="html-file-input"
                accept=".html,.htm,.txt"
                className="hidden"
                onChange={onFileUpload}
              />
              <label htmlFor="html-file-input">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-md cursor-pointer hover:bg-accent transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  Import HTML file
                </span>
              </label>

              <Tabs
                value={activeTab}
                onValueChange={(val) =>
                  setActiveTab(val as "editor" | "preview")
                }
              >
                <TabsList className="h-8">
                  <TabsTrigger value="editor" className="text-xs gap-1.5 px-3">
                    <Code className="w-3.5 h-3.5" />
                    Trình soạn thảo
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs gap-1.5 px-3">
                    <Eye className="w-3.5 h-3.5" />
                    Xem trước
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Metadata inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <Label className="text-xs font-semibold">Tên mẫu hiển thị</Label>
              <Input
                value={title}
                onChange={(e) =>
                  onFormStateChange((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Tên mẫu biểu..."
                className="text-xs h-8"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Phiên bản</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Định dạng SemVer: 1.0.0, 2.1.0,...
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                value={version}
                onChange={(e) =>
                  onFormStateChange((prev) => ({ ...prev, version: e.target.value }))
                }
                placeholder="2.0.0"
                className="text-xs h-8"
              />
            </div>
            <div className="sm:col-span-3 space-y-1">
              <Label className="text-xs font-semibold">Mô tả mục đích áp dụng</Label>
              <Input
                value={description}
                onChange={(e) =>
                  onFormStateChange((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Mô tả tóm tắt văn bản quy chuẩn này..."
                className="text-xs h-8"
              />
            </div>
          </div>

          {/* Main Area: Editor or Live Preview */}
          {activeTab === "editor" ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">
                  Mã nguồn HTML mẫu biểu
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Hỗ trợ định dạng HTML, CSS nội dòng và các biến placeholder
                  {" {{...}}"}
                </span>
              </div>
              <Textarea
                value={htmlContent}
                onChange={(e) =>
                  onFormStateChange((prev) => ({
                    ...prev,
                    htmlContent: e.target.value,
                  }))
                }
                rows={22}
                placeholder="<html>...</html>"
                className="font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400 p-4 rounded-lg focus-visible:ring-emerald-700 resize-y"
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between pb-1">
                <Label className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                  Xem trước trực quan (Dữ liệu mô phỏng)
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Khung hiển thị mô phỏng khi tài liệu được render sang PDF / Ký
                  số
                </span>
              </div>
              <div
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-8 bg-white dark:bg-slate-900 shadow-xs max-h-[600px] overflow-y-auto"
                dangerouslySetInnerHTML={{
                  __html: getRenderedPreviewHtml(htmlContent),
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
