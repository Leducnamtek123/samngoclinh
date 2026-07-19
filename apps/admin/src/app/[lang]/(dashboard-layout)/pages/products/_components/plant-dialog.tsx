"use client"

import Cropper from "react-easy-crop"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InlineAlert } from "@/components/ui/feedback-components"

interface PlantDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: {
    code: string
    name: string
    ageYear: number
    price: number
    stock: number
    status: string
    description: string
    imageUrl: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSelectStatus: (val: string) => void
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
  uploadingImage: boolean

  // Crop props
  cropState: {
    imageSrc: string | null
    crop: { x: number; y: number }
    zoom: number
    isOpen: boolean
  }
  onCropStateChange: (updater: (prev: any) => any) => void
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void
  onCropSubmit: () => void
  onCloseCrop: () => void
}

export function PlantDialog({
  isOpen,
  onClose,
  mode,
  formData,
  onChange,
  onSelectStatus,
  onImageFileChange,
  onSubmit,
  loading,
  error,
  uploadingImage,

  cropState,
  onCropStateChange,
  onCropComplete,
  onCropSubmit,
  onCloseCrop,
}: PlantDialogProps) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="sm:max-w-[475px]">
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Thêm sản phẩm sâm mới" : "Chỉnh sửa sản phẩm sâm"}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Nhập các thông số chi tiết để đăng bán cây sâm Ngọc Linh."
                  : "Cập nhật các thông số chi tiết của sản phẩm đang bán."}
              </DialogDescription>
            </DialogHeader>

            {error && (
              <InlineAlert type="error" title="Lỗi" message={error} className="my-3" />
            )}

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-name">Tên sản phẩm sâm</Label>
                  <Input
                    id="dialog-name"
                    name="name"
                    placeholder="Ví dụ: Cây Sâm Ngọc Linh 4 năm"
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dialog-code">Mã code định danh</Label>
                  <Input
                    id="dialog-code"
                    name="code"
                    placeholder="Ví dụ: plant-sam-4y"
                    value={formData.code}
                    onChange={onChange}
                    disabled={mode === "edit"}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-ageYear">Tuổi (năm)</Label>
                  <Input
                    id="dialog-ageYear"
                    name="ageYear"
                    type="number"
                    min={0}
                    value={formData.ageYear}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dialog-price">Giá bán (VND)</Label>
                  <Input
                    id="dialog-price"
                    name="price"
                    type="number"
                    min={0}
                    value={formData.price}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dialog-stock">Số lượng kho</Label>
                  <Input
                    id="dialog-stock"
                    name="stock"
                    type="number"
                    min={0}
                    value={formData.stock}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-status">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={onSelectStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Sâm đang phát triển</SelectItem>
                      <SelectItem value="harvested">Sâm đã thu hoạch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dialog-image">Ảnh sản phẩm</Label>
                  <Input
                    id="dialog-image"
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={onImageFileChange}
                  />
                  {uploadingImage && <span className="text-xs text-slate-500">Đang tải ảnh lên Cloudinary...</span>}
                  {formData.imageUrl && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border mt-1">
                      <Image src={formData.imageUrl} alt="Preview" fill sizes="64px" className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dialog-description">Mô tả sản phẩm</Label>
                <Textarea
                  id="dialog-description"
                  name="description"
                  placeholder="Nhập mô tả sản phẩm tại đây..."
                  value={formData.description}
                  onChange={onChange}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {loading ? "Đang lưu..." : mode === "create" ? "Thêm mới" : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Image Cropping */}
      <Dialog open={cropState.isOpen} onOpenChange={(val) => !val && onCloseCrop()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cắt ảnh sản phẩm (Tỉ lệ 1:1)</DialogTitle>
            <DialogDescription>
              Di chuyển và phóng to/thu nhỏ để có khung hình ưng ý nhất cho sản phẩm sâm giống.
            </DialogDescription>
          </DialogHeader>

          <div className="relative w-full h-[300px] bg-slate-100 rounded-lg overflow-hidden border my-4">
            {cropState.imageSrc && (
              <Cropper
                image={cropState.imageSrc}
                crop={cropState.crop}
                zoom={cropState.zoom}
                aspect={1}
                onCropChange={(c) => onCropStateChange((prev) => ({ ...prev, crop: c }))}
                onZoomChange={(z) => onCropStateChange((prev) => ({ ...prev, zoom: z }))}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Zoom:</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={cropState.zoom}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  onCropStateChange((prev) => ({ ...prev, zoom: val }))
                }}
                aria-label="Độ phóng đại (Zoom)"
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onCloseCrop}>
                Hủy
              </Button>
              <Button type="button" onClick={onCropSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Áp dụng
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
