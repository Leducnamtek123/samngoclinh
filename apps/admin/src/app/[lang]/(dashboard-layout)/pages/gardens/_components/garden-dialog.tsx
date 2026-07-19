"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface GardenDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: {
    name: string
    location: string
    description: string
    area: string
    latitude: string
    longitude: string
    managerName: string
    managerPhone: string
    establishedAt: string
    maxBeds: string
  }
  onChange: (updater: (prev: any) => any) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
}

export function GardenDialog({
  isOpen,
  onClose,
  mode,
  formData,
  onChange,
  onSubmit,
  loading,
  error,
}: GardenDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[625px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Thêm khu vườn mới" : "Chỉnh sửa khu vườn"}</DialogTitle>
          <DialogDescription>
            Điền các thông tin của khu vườn dưới đây. Nhấn Lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-medium border border-red-200/50 dark:border-red-900/30">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="garden-name">Tên khu vườn <span className="text-red-500">*</span></Label>
              <Input
                id="garden-name"
                value={formData.name}
                onChange={(e) => onChange((prev: any) => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên vườn, ví dụ: Vườn Sâm Số 1"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garden-location">Vị trí địa lý</Label>
              <Input
                id="garden-location"
                value={formData.location}
                onChange={(e) => onChange((prev: any) => ({ ...prev, location: e.target.value }))}
                placeholder="Kon Tum, Quảng Nam..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garden-area">Diện tích (m²)</Label>
              <Input
                id="garden-area"
                type="number"
                step="any"
                value={formData.area}
                onChange={(e) => onChange((prev: any) => ({ ...prev, area: e.target.value }))}
                placeholder="Ví dụ: 500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garden-latitude">Vĩ độ (Latitude)</Label>
              <Input
                id="garden-latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => onChange((prev: any) => ({ ...prev, latitude: e.target.value }))}
                placeholder="Ví dụ: 14.1234"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garden-longitude">Kinh độ (Longitude)</Label>
              <Input
                id="garden-longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => onChange((prev: any) => ({ ...prev, longitude: e.target.value }))}
                placeholder="Ví dụ: 107.5678"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garden-manager-name">Tên quản lý vườn</Label>
              <Input
                id="garden-manager-name"
                value={formData.managerName}
                onChange={(e) => onChange((prev: any) => ({ ...prev, managerName: e.target.value }))}
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garden-manager-phone">SĐT quản lý vườn</Label>
              <Input
                id="garden-manager-phone"
                value={formData.managerPhone}
                onChange={(e) => onChange((prev: any) => ({ ...prev, managerPhone: e.target.value }))}
                placeholder="Ví dụ: 0987654321"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garden-established">Ngày thành lập</Label>
              <Input
                id="garden-established"
                type="date"
                value={formData.establishedAt}
                onChange={(e) => onChange((prev: any) => ({ ...prev, establishedAt: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="garden-max-beds">Số luống tối đa</Label>
              <Input
                id="garden-max-beds"
                type="number"
                value={formData.maxBeds}
                onChange={(e) => onChange((prev: any) => ({ ...prev, maxBeds: e.target.value }))}
                placeholder="Ví dụ: 100"
              />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="garden-description">Mô tả chi tiết</Label>
              <Input
                id="garden-description"
                value={formData.description}
                onChange={(e) => onChange((prev: any) => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả về đất, khí hậu, các giống sâm..."
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
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
