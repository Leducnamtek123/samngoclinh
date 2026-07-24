"use client"

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
                ? "Thêm gói dịch vụ mới"
                : "Chỉnh sửa gói dịch vụ"}
            </DialogTitle>
            <DialogDescription>
              Nhập các thông tin chi tiết cho gói{" "}
              {activeTab === "care" ? "chăm sóc" : "bảo hiểm/bảo vệ"}. Nhấn Lưu
              để hoàn tất.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="my-3 p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pkg-code">Mã gói dịch vụ</Label>
              <Input
                id="pkg-code"
                value={formData.code}
                onChange={(e) =>
                  onChange((prev: any) => ({ ...prev, code: e.target.value }))
                }
                placeholder="Ví dụ: CARE_GOLD, PROT_MAX"
                disabled={mode === "edit"}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pkg-name">Tên gói dịch vụ</Label>
              <Input
                id="pkg-name"
                value={formData.name}
                onChange={(e) =>
                  onChange((prev: any) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ví dụ: Gói Chăm Sóc Vàng"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pkg-price">Giá tiền (VND)</Label>
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
                <Label htmlFor="pkg-duration">Thời hạn gói (tháng)</Label>
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
                  Phạm vi bảo vệ / bồi thường
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
                  placeholder="Ví dụ: Bồi thường 100% khi cây chết"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="pkg-status">Trạng thái hoạt động</Label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  onChange((prev: any) => ({ ...prev, status: val }))
                }
              >
                <SelectTrigger id="pkg-status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động (Active)</SelectItem>
                  <SelectItem value="inactive">Tạm ngưng (Inactive)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pkg-desc">Mô tả dịch vụ</Label>
              <Textarea
                id="pkg-desc"
                value={formData.description}
                onChange={(e) =>
                  onChange((prev: any) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Mô tả chi tiết quyền lợi dịch vụ..."
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
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
