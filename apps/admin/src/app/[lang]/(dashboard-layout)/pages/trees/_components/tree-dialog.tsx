"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Trồng thêm cây giống" : "Cập nhật thông tin cây trồng"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông số chi tiết cây trồng. Lô cây sẽ được gán vào cơ sở dữ liệu trồng trọt.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="my-3 p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4 grid-cols-2">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="tree-name">Tên cây giống</Label>
              <Input
                id="tree-name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Nhập tên cây sâm, ví dụ: Sâm Ngọc Linh Trà My"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-age">Độ tuổi (năm tuổi)</Label>
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
              <Label htmlFor="tree-quantity">Số lượng gốc</Label>
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
                <Label htmlFor="tree-bedCode">Gán vào luống</Label>
                <Select
                  value={formData.bedCode}
                  onValueChange={(val) => onSelectChange("bedCode", val)}
                >
                  <SelectTrigger id="tree-bedCode">
                    <SelectValue placeholder="Chọn luống trồng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Không gán luống (Trống) —</SelectItem>
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
                <Label htmlFor="tree-status">Trạng thái sinh trưởng</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => onSelectChange("status", val)}
                >
                  <SelectTrigger id="tree-status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang sinh trưởng (Active)</SelectItem>
                    <SelectItem value="harvested">Đã thu hoạch (Harvested)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="tree-health">Tình trạng sức khỏe</Label>
              <Select
                value={formData.healthStatus}
                onValueChange={(val) => onSelectChange("healthStatus", val)}
              >
                <SelectTrigger id="tree-health">
                  <SelectValue placeholder="Chọn tình trạng sức khỏe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Khỏe mạnh (Tốt)</SelectItem>
                  <SelectItem value="diseased">Bị nhiễm sâu bệnh</SelectItem>
                  <SelectItem value="weak">Cần theo dõi sát (Kém)</SelectItem>
                  <SelectItem value="dead">Đã chết (Hỏng)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-planted">Ngày xuống giống</Label>
              <Input
                id="tree-planted"
                name="plantedAt"
                type="date"
                value={formData.plantedAt}
                onChange={onChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-expected-harvest">Dự kiến thu hoạch</Label>
              <Input
                id="tree-expected-harvest"
                name="expectedHarvestAt"
                type="date"
                value={formData.expectedHarvestAt}
                onChange={onChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-last-care">Ngày chăm sóc cuối</Label>
              <Input
                id="tree-last-care"
                name="lastCareDate"
                type="date"
                value={formData.lastCareDate}
                onChange={onChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-next-care">Lịch chăm sóc tiếp</Label>
              <Input
                id="tree-next-care"
                name="nextCareDate"
                type="date"
                value={formData.nextCareDate}
                onChange={onChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-price">Giá mua gốc sâm (VND)</Label>
              <Input
                id="tree-price"
                name="priceBought"
                type="number"
                value={formData.priceBought}
                onChange={onChange}
                placeholder="Ví dụ: 5000000"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tree-owner">Khách hàng sở hữu</Label>
              <Select
                value={formData.ownerUserId || "system"}
                onValueChange={(val) => onSelectChange("ownerUserId", val === "system" ? "" : val)}
              >
                <SelectTrigger id="tree-owner">
                  <SelectValue placeholder="Chọn khách hàng sở hữu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">Hệ thống (Không có chủ)</SelectItem>
                  {users.map((u) => {
                    const name = `${u.firstName || ""} ${u.lastName || ""} (${u.username || u.email})`.trim();
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
