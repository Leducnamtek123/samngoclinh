"use client"

import React from "react"
import { Loader2, ShieldCheck } from "lucide-react"

interface ContractDetailViewerProps {
  isLoadingTemplate: boolean
  renderedContractHtml: string
}

export function ContractDetailViewer({
  isLoadingTemplate,
  renderedContractHtml,
}: ContractDetailViewerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Nội dung hợp đồng
        </span>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900/60 p-2 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
        {isLoadingTemplate && !renderedContractHtml ? (
          <div className="h-[750px] bg-white rounded-xl flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            <span>Đang tải nội dung văn bản hợp đồng...</span>
          </div>
        ) : (
          <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <iframe
              title="Văn bản hợp đồng"
              srcDoc={renderedContractHtml}
              className="w-full h-[850px] min-h-[600px] border-0 bg-white"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        )}
      </div>
    </div>
  )
}
