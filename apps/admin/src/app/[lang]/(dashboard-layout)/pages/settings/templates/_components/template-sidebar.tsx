"use client"

import React from "react"
import { Check, Code, Copy, Info } from "lucide-react"

import type { ContractTemplateItem } from "./contract-templates-manager"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TemplateSidebarProps {
  templates: ContractTemplateItem[]
  selectedSlug: string
  onSelectTemplate: (slug: string) => void
  currentTemplate: ContractTemplateItem | null
  onInsertPlaceholder: (code: string) => void
  copiedCode: string | null
}

export function TemplateSidebar({
  templates,
  selectedSlug,
  onSelectTemplate,
  currentTemplate,
  onInsertPlaceholder,
  copiedCode,
}: TemplateSidebarProps) {
  return (
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
                onClick={() => onSelectTemplate(tpl.slug)}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
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
                <button
                  type="button"
                  key={ph.code}
                  onClick={() => onInsertPlaceholder(ph.code)}
                  className="w-full text-left p-2 rounded-lg border border-border/80 hover:border-emerald-400 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 cursor-pointer transition-colors text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                    <span>{ph.code}</span>
                    {copiedCode === ph.code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground opacity-60" />
                    )}
                  </div>
                  <p className="text-[11px] text-foreground font-medium">
                    {ph.label}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
    </div>
  )
}
