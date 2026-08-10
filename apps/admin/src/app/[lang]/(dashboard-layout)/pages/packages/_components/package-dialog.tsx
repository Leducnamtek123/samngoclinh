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

interface PackageDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: {
    code: string
    name: string
    price: number
    durationMonths: number
    coverage: string
    description: string
    status: string
  }
  onChange: (updater: (prev: any) => any) => void
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
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create"
                ? t("packages.addPackage")
                : t("packages.editPackage")}
            </DialogTitle>
            <DialogDescription>
              {t("packages.createSubtitle")}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="my-3 p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pkg-code">{t("packages.fields.code")}</Label>
              <Input
                id="pkg-code"
                value={formData.code}
                onChange={(e) =>
                  onChange((prev: any) => ({ ...prev, code: e.target.value }))
                }
                placeholder="CARE_GOLD, PROT_MAX"
                disabled={mode === "edit"}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pkg-name">{t("packages.fields.name")}</Label>
              <Input
                id="pkg-name"
                value={formData.name}
                onChange={(e) =>
                  onChange((prev: any) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pkg-price">{t("packages.fields.price")}</Label>
              <Input
                id="pkg-price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  onChange((prev: any) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                min={0}
                required
              />
            </div>

            {activeTab === "care" ? (
              <div className="grid gap-2">
                <Label htmlFor="pkg-duration">{t("packages.fields.duration")}</Label>
                <Input
                  id="pkg-duration"
                  type="number"
                  value={formData.durationMonths}
                  onChange={(e) =>
                    onChange((prev: any) => ({
                      ...prev,
                      durationMonths: Number(e.target.value),
                    }))
                  }
                  min={1}
                  required
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="pkg-coverage">
                  {t("packages.fields.coverage")}
                </Label>
                <Input
                  id="pkg-coverage"
                  value={formData.coverage}
                  onChange={(e) =>
                    onChange((prev: any) => ({
                      ...prev,
                      coverage: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="pkg-status">{t("packages.fields.status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  onChange((prev: any) => ({ ...prev, status: val }))
                }
              >
                <SelectTrigger id="pkg-status">
                  <SelectValue placeholder={t("packages.fields.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("common.status.active")}</SelectItem>
                  <SelectItem value="inactive">{t("common.status.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pkg-desc">{t("packages.fields.description")}</Label>
              <Textarea
                id="pkg-desc"
                value={formData.description}
                onChange={(e) =>
                  onChange((prev: any) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {t("common.actions.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? t("common.status.processing") : t("common.actions.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
