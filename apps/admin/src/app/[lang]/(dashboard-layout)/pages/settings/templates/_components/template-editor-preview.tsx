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
import type { ContractTemplateItem } from "./contract-templates-manager"

interface TemplateEditorPreviewProps {
  title: string
  version: string
  description: string
  htmlContent: string
  currentTemplate: ContractTemplateItem | null
  activeTab: "editor" | "preview"
  setActiveTab: (tab: "editor" | "preview") => void
  onFormStateChange: (updater: (prev: any) => any) => void
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
                onChange={onFileUpload}
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
                onChange={(e) =>
                  onFormStateChange((prev: any) => ({ ...prev, title: e.target.value }))
                }
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
                onChange={(e) =>
                  onFormStateChange((prev: any) => ({ ...prev, version: e.target.value }))
                }
                placeholder="2.0.0"
                className="h-8 text-xs mt-1 font-mono"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Mô tả</Label>
              <Input
                value={description}
                onChange={(e) =>
                  onFormStateChange((prev: any) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
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
                onChange={(e) =>
                  onFormStateChange((prev: any) => ({
                    ...prev,
                    htmlContent: e.target.value,
                  }))
                }
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
  )
}
