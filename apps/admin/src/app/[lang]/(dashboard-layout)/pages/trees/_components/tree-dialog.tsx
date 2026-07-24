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

interface Bed {
  id: string
  code: string
  name: string
}

interface TreeDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: {
    name: string
    ageYear: number
    quantity: number
    bedCode: string
    status: string
    healthStatus: string
    plantedAt: string
    lastCareDate: string
    nextCareDate: string
    expectedHarvestAt: string
    priceBought: string
    ownerUserId: string
  }
  beds: Bed[]
  users: any[]
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectChange: (field: string, val: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
}

export function TreeDialog({
  isOpen,
  onClose,
  mode,
  formData,
  beds,
  users,
  onChange,
  onSelectChange,
  onSubmit,
  loading,
  error,
}: TreeDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? t("trees.addTree") : t("trees.editTree")}
            </DialogTitle>
            <DialogDescription>{t("trees.subtitle")}</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="my-3 p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4 grid-cols-2">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="tree-name">{t("trees.fields.name")}</Label>
              <Input
                id="tree-name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder={t("trees.fields.name")}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-age">{t("trees.fields.age")}</Label>
              <Input
                id="tree-age"
                name="ageYear"
                type="number"
                value={formData.ageYear}
                onChange={onChange}
                min={0}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-quantity">Quantity</Label>
              <Input
                id="tree-quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={onChange}
                min={1}
                required
              />
            </div>

            {mode === "create" && (
              <div className="grid gap-2">
                <Label htmlFor="tree-bedCode">{t("trees.fields.bed")}</Label>
                <Select
                  value={formData.bedCode}
                  onValueChange={(val) => onSelectChange("bedCode", val)}
                >
                  <SelectTrigger id="tree-bedCode">
                    <SelectValue placeholder={t("trees.fields.bed")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— None —</SelectItem>
                    {beds.map((bed) => (
                      <SelectItem key={bed.id} value={bed.code}>
                        {bed.name} ({bed.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {mode === "edit" && (
              <div className="grid gap-2">
                <Label htmlFor="tree-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => onSelectChange("status", val)}
                >
                  <SelectTrigger id="tree-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      {t("common.status.active")}
                    </SelectItem>
                    <SelectItem value="harvested">
                      {t("common.status.completed")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="tree-health">
                {t("trees.fields.healthStatus")}
              </Label>
              <Select
                value={formData.healthStatus}
                onValueChange={(val) => onSelectChange("healthStatus", val)}
              >
                <SelectTrigger id="tree-health">
                  <SelectValue placeholder={t("trees.fields.healthStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">
                    {t("common.status.healthy")}
                  </SelectItem>
                  <SelectItem value="diseased">
                    {t("common.status.diseased")}
                  </SelectItem>
                  <SelectItem value="weak">
                    {t("common.status.warning")}
                  </SelectItem>
                  <SelectItem value="dead">
                    {t("common.status.error")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-planted">
                {t("trees.fields.plantedDate")}
              </Label>
              <Input
                id="tree-planted"
                name="plantedAt"
                type="date"
                value={formData.plantedAt}
                onChange={onChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-expected-harvest">Expected Harvest</Label>
              <Input
                id="tree-expected-harvest"
                name="expectedHarvestAt"
                type="date"
                value={formData.expectedHarvestAt}
                onChange={onChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-last-care">Last Care Date</Label>
              <Input
                id="tree-last-care"
                name="lastCareDate"
                type="date"
                value={formData.lastCareDate}
                onChange={onChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-next-care">Next Care Date</Label>
              <Input
                id="tree-next-care"
                name="nextCareDate"
                type="date"
                value={formData.nextCareDate}
                onChange={onChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-price">
                {t("products.fields.price")} (VND)
              </Label>
              <Input
                id="tree-price"
                name="priceBought"
                type="number"
                value={formData.priceBought}
                onChange={onChange}
                placeholder="5000000"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-owner">Owner</Label>
              <Select
                value={formData.ownerUserId || "system"}
                onValueChange={(val) =>
                  onSelectChange("ownerUserId", val === "system" ? "" : val)
                }
              >
                <SelectTrigger id="tree-owner">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  {users.map((u) => {
                    const name =
                      `${u.firstName || ""} ${u.lastName || ""} (${u.username || u.email})`.trim()
                    return (
                      <SelectItem key={u.id} value={u.id}>
                        {name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
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
              {loading ? t("common.status.pending") : t("common.actions.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
