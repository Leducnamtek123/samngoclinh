"use client"

import React from "react"
import { FileText, RefreshCw, Eye, Code, Lightbulb, PenTool } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/providers/i18n-provider"

interface CreateContractStep3Props {
  selectedTemplateSlug: string
  onTemplateChange: (val: string) => void
  isCustomEdited: boolean
  customerName: string
  customerCccd: string
  customerPhone: string
  contractValue: number
  careFee: number
  treeQuantity: number
  contractCode: string
  onResetToTemplate: () => void
  step3ViewMode: "preview" | "editor"
  onViewModeChange: (mode: "preview" | "editor") => void
  renderedPreviewHtml: string
  onRenderedPreviewHtmlChange: (val: string) => void
}

export function CreateContractStep3Preview({
  selectedTemplateSlug,
  onTemplateChange,
  isCustomEdited,
  customerName,
  customerCccd,
  customerPhone,
  contractValue,
  careFee,
  treeQuantity,
  contractCode,
  onResetToTemplate,
  step3ViewMode,
  onViewModeChange,
  renderedPreviewHtml,
  onRenderedPreviewHtmlChange,
}: CreateContractStep3Props) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Template config & Placeholders */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> {t("contracts.wizard.step3")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("contracts.wizard.step3Desc")}</Label>
              <Select value={selectedTemplateSlug} onValueChange={onTemplateChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh">
                    {t("contracts.types.CULTIVATION_INVESTMENT")}
                  </SelectItem>
                  <SelectItem value="dieu-khoan-su-dung">
                    {t("contracts.types.OTHER")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-900 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  {t("contracts.fields.type")}:
                </span>
                {isCustomEdited && (
                  <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                    {t("common.actions.edit")}
                  </Badge>
                )}
              </div>

              <div className="text-xs space-y-1.5 font-mono text-slate-600 dark:text-slate-400">
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">{t("orders.fields.customer")}:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                    {customerName || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">{t("users.fields.identityNumber")}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {customerCccd || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">{t("users.fields.phone")}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {customerPhone || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">{t("contracts.fields.totalValue")}:</span>
                  <span className="font-bold text-emerald-600">
                    {contractValue.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">{t("contracts.fields.careFee")}:</span>
                  <span className="font-bold text-emerald-600">
                    {careFee.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">{t("contracts.fields.tree")}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {treeQuantity}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">{t("contracts.fields.code")}:</span>
                  <span className="font-bold text-primary truncate max-w-[150px]">
                    {contractCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetToTemplate}
                className="w-full text-xs gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> {t("common.actions.reset")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Live A4 Preview & Direct HTML Editor */}
      <div className="lg:col-span-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => onViewModeChange("preview")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  step3ViewMode === "preview"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-slate-950 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> {t("contracts.contractDetails")}
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("editor")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  step3ViewMode === "editor"
                    ? "bg-white text-primary shadow-xs dark:bg-slate-950 dark:text-primary"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <PenTool className="w-3.5 h-3.5" /> <span>{t("common.actions.edit")}</span>
              </button>
            </div>
          </div>
        </div>

        {step3ViewMode === "preview" ? (
          <div className="bg-slate-100 dark:bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
            <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <iframe
                title="Contract Preview"
                srcDoc={renderedPreviewHtml}
                className="w-full h-[650px] min-h-[500px] border-0 bg-white"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>{t("contracts.wizard.step3Desc")}:</span>
              <span>{renderedPreviewHtml.length.toLocaleString()} chars</span>
            </div>
            <Textarea
              value={renderedPreviewHtml}
              onChange={(e) => onRenderedPreviewHtmlChange(e.target.value)}
              rows={26}
              className="font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400 p-4 rounded-xl border border-slate-800 focus-visible:ring-emerald-500"
              placeholder="HTML..."
            />
          </div>
        )}
      </div>
    </div>
  )
}
