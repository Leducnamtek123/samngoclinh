"use client"

import React from "react"
import { Code, Eye, FileText, Info, Upload } from "lucide-react"
import { useTranslation } from "@/providers/i18n-provider"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const { t } = useTranslation()

  return (
    <div className="lg:col-span-3 space-y-4">
      <Card>
        <CardHeader className="pb-3 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              {title || currentTemplate?.title || t("content.templates.title")}
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Slug: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600">{currentTemplate?.slug || "new-template"}</code></span>
              <span>•</span>
              <span>Ver: <strong className="text-foreground">{version}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "editor" | "preview")}
              className="w-auto"
            >
              <TabsList className="grid grid-cols-2 w-[180px]">
                <TabsTrigger value="editor" className="text-xs gap-1.5">
                  <Code className="w-3.5 h-3.5" /> Soạn thảo
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Xem trước
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <label
              htmlFor="upload-template-file"
              className="cursor-pointer inline-flex items-center gap-1 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 px-2.5 py-1.5 rounded-md font-medium text-slate-700 dark:text-slate-200 transition-colors shrink-0"
              title="Import file HTML mẫu biểu"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Import HTML</span>
              <input
                id="upload-template-file"
                type="file"
                accept=".html,.htm,.txt"
                className="hidden"
                onChange={onFileUpload}
              />
            </label>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Metadata inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <Label className="text-xs font-semibold">{t("content.templates.templateName")}</Label>
              <Input
                value={title}
                onChange={(e) =>
                  onFormStateChange((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder={t("content.templates.templateNamePlaceholder")}
                className="text-xs h-8"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">{t("content.templates.version")}</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {t("content.templates.versionTooltip")}
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
              <Label className="text-xs font-semibold">{t("content.templates.description")}</Label>
              <Input
                value={description}
                onChange={(e) =>
                  onFormStateChange((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder={t("content.templates.descriptionPlaceholder")}
                className="text-xs h-8"
              />
            </div>
          </div>

          {/* Main Area: Editor or Live Preview */}
          {activeTab === "editor" ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">
                  {t("content.templates.sourceHtml")}
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {t("content.templates.sourceHtmlHelp")}
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
                  {t("content.templates.visualPreview")}
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {t("content.templates.visualPreviewHelp")}
                </span>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white overflow-hidden shadow-xs">
                <iframe
                  title={t("content.templates.iframeTitle")}
                  srcDoc={getRenderedPreviewHtml(htmlContent)}
                  className="w-full h-[600px] border-0 bg-white"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
