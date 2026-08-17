"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Plus, Sliders, Trash2 } from "lucide-react"

import { useTranslation } from "@/providers/i18n-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateContractCustomPlaceholdersProps {
  customPlaceholders: Record<string, string>
  onCustomPlaceholdersChange: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >
  allPlaceholders: Record<string, string>
  formatPlaceholderLabel: (key: string) => string
}

export function CreateContractCustomPlaceholders({
  customPlaceholders,
  onCustomPlaceholdersChange,
  allPlaceholders,
  formatPlaceholderLabel,
}: CreateContractCustomPlaceholdersProps) {
  const { t } = useTranslation()
  const [newKeyInput, setNewKeyInput] = useState("")
  const [newValInput, setNewValInput] = useState("")

  const handleAddPlaceholder = () => {
    if (!newKeyInput.trim()) {
      toast.error(t("contracts.customPlaceholders.errMissingKey"))
      return
    }
    const cleanKey = newKeyInput.trim().toUpperCase().replace(/[{}]/g, "")
    onCustomPlaceholdersChange((prev) => ({
      ...prev,
      [cleanKey]: newValInput,
    }))
    setNewKeyInput("")
    setNewValInput("")
    toast.success(
      t("contracts.customPlaceholders.successAdded", { key: cleanKey })
    )
  }

  const handleDeletePlaceholder = (key: string) => {
    onCustomPlaceholdersChange((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  return (
    <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-900 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
            {t("contracts.customPlaceholders.sectionTitle")}
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] bg-purple-100 text-purple-800 border-purple-300"
        >
          {t("contracts.customPlaceholders.fieldsCount", {
            count: Object.keys(allPlaceholders).length,
          })}
        </Badge>
      </div>

      {Object.keys(allPlaceholders).length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          {t("contracts.customPlaceholders.emptyNotice")}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {Object.entries(customPlaceholders).map(([key, val]) => (
            <div
              key={key}
              className="space-y-1.5 bg-white dark:bg-slate-900 p-3 rounded-lg border border-purple-100 dark:border-purple-950"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {formatPlaceholderLabel(key)}
                </Label>
                <code className="text-[10px] font-mono text-purple-600 bg-purple-50 dark:bg-purple-950 px-1 py-0.5 rounded">
                  {"{{" + key + "}}"}
                </code>
              </div>
              <div className="flex items-center gap-1.5">
                <Input
                  value={val}
                  onChange={(e) => {
                    onCustomPlaceholdersChange((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }}
                  placeholder={t(
                    "contracts.customPlaceholders.inputPlaceholder",
                    { key }
                  )}
                  className="text-xs bg-slate-50 dark:bg-slate-950"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeletePlaceholder(key)}
                  className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form add manual custom field */}
      <div className="pt-2 border-t border-purple-100 dark:border-purple-900 flex flex-wrap items-center gap-2">
        <Input
          value={newKeyInput}
          onChange={(e) =>
            setNewKeyInput(
              e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_")
            )
          }
          placeholder={t("contracts.customPlaceholders.newKeyPlaceholder")}
          className="w-48 text-xs font-mono bg-white dark:bg-slate-950"
        />
        <Input
          value={newValInput}
          onChange={(e) => setNewValInput(e.target.value)}
          placeholder={t("contracts.customPlaceholders.newValPlaceholder")}
          className="flex-1 min-w-[160px] text-xs bg-white dark:bg-slate-950"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddPlaceholder}
          className="text-xs gap-1 bg-white dark:bg-slate-950 border-purple-200"
        >
          <Plus className="w-3.5 h-3.5" />{" "}
          {t("contracts.customPlaceholders.addBtn")}
        </Button>
      </div>
    </div>
  )
}
