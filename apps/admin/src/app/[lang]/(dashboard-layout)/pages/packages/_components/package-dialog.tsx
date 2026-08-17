"use client"

import { useTranslation } from "@/providers/i18n-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export interface PackageFormData {
  code: string
  name: string
  price: number
  durationMonths: number
  coverage: string
  description: string
  status: string
}

interface PackageDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: PackageFormData
  onChange: (updater: (prev: PackageFormData) => PackageFormData) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
  activeTab: "care" | "protection"
}

export function PackageDialog({
  isOpen,
  onClose,
  mode,
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  activeTab,
}: PackageDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !loading) onClose()
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? activeTab === "care"
                ? t("packages.addCareTitle")
                : t("packages.addProtectionTitle")
              : activeTab === "care"
                ? t("packages.editCareTitle")
                : t("packages.editProtectionTitle")}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? t("packages.createDesc")
              : t("packages.editDesc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 dark:bg-red-950/50 dark:border-red-900 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pkg-code">{t("packages.fields.code")}</Label>
              <Input
                id="pkg-code"
                placeholder={t("packages.placeholders.code")}
                value={formData.code}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, code: e.target.value }))
                }
                disabled={mode === "edit" || loading}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pkg-name">{t("packages.fields.name")}</Label>
              <Input
                id="pkg-name"
                placeholder={t("packages.placeholders.name")}
                value={formData.name}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, name: e.target.value }))
                }
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pkg-price">{t("packages.fields.price")}</Label>
              <Input
                id="pkg-price"
                type="number"
                min="0"
                step="10000"
                placeholder={t("packages.placeholders.price")}
                value={formData.price || ""}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    price: Number(e.target.value) || 0,
                  }))
                }
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pkg-duration">{t("packages.fields.duration")}</Label>
              <Input
                id="pkg-duration"
                type="number"
                min="1"
                placeholder={t("packages.placeholders.duration")}
                value={formData.durationMonths || ""}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    durationMonths: Number(e.target.value) || 12,
                  }))
                }
                disabled={loading}
                required
              />
            </div>
          </div>

          {activeTab === "protection" && (
            <div className="space-y-1.5">
              <Label htmlFor="pkg-coverage">{t("packages.fields.coverage")}</Label>
              <Input
                id="pkg-coverage"
                placeholder={t("packages.placeholders.coverage")}
                value={formData.coverage}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, coverage: e.target.value }))
                }
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="pkg-status">{t("packages.fields.status")}</Label>
            <Select
              value={formData.status}
              onValueChange={(val) =>
                onChange((prev) => ({ ...prev, status: val }))
              }
              disabled={loading}
            >
              <SelectTrigger id="pkg-status">
                <SelectValue placeholder={t("packages.selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t("packages.active")}</SelectItem>
                <SelectItem value="inactive">{t("packages.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pkg-desc">{t("packages.fields.description")}</Label>
            <Textarea
              id="pkg-desc"
              rows={3}
              placeholder={t("packages.placeholders.description")}
              value={formData.description}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, description: e.target.value }))
              }
              disabled={loading}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? t("common.processing") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
