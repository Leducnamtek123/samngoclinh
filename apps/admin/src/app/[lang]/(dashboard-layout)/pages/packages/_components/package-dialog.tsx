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
                ? "Thêm gói chăm sóc mới"
                : "Thêm gói bảo hiểm mới"
              : activeTab === "care"
                ? "Chỉnh sửa gói chăm sóc"
                : "Chỉnh sửa gói bảo hiểm"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Điền thông tin bên dưới để khởi tạo cấu hình gói dịch vụ cây sâm."
              : "Cập nhật thông tin và điều khoản của gói dịch vụ."}
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
              <Label htmlFor="pkg-code">Mã gói *</Label>
              <Input
                id="pkg-code"
                placeholder="VD: CARE_VIP_1Y"
                value={formData.code}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, code: e.target.value }))
                }
                disabled={mode === "edit" || loading}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pkg-name">Tên gói *</Label>
              <Input
                id="pkg-name"
                placeholder="VD: Chăm Sóc Toàn Diện 1 Năm"
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
              <Label htmlFor="pkg-price">Giá gói (VNĐ) *</Label>
              <Input
                id="pkg-price"
                type="number"
                min="0"
                step="10000"
                placeholder="VD: 500000"
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
              <Label htmlFor="pkg-duration">Thời hạn (Tháng) *</Label>
              <Input
                id="pkg-duration"
                type="number"
                min="1"
                placeholder="VD: 12"
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
              <Label htmlFor="pkg-coverage">Tỷ lệ bảo hiểm / Đền bù</Label>
              <Input
                id="pkg-coverage"
                placeholder="VD: 100% giá trị cây giống"
                value={formData.coverage}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, coverage: e.target.value }))
                }
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="pkg-status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(val) =>
                onChange((prev) => ({ ...prev, status: val }))
              }
              disabled={loading}
            >
              <SelectTrigger id="pkg-status">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang áp dụng (Active)</SelectItem>
                <SelectItem value="inactive">Tạm dừng (Inactive)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pkg-desc">Mô tả / Quyền lợi chi tiết</Label>
            <Textarea
              id="pkg-desc"
              rows={3}
              placeholder="Mô tả các hạng mục chăm sóc hoặc điều kiện bồi thường..."
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
              {loading ? "Đang xử lý..." : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
