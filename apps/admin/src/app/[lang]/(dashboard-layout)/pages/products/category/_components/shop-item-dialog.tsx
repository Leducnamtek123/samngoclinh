"use client"

import Image from "next/image"
import Cropper from "react-easy-crop"
import { Image as ImageIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InlineAlert } from "@/components/ui/feedback-components"
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

interface ShopItem {
  id: string
  code: string
  name: string
  price: number
  unit: string
  category: string
  stock?: number
  status?: string
  images?: string[]
  description?: string
}

interface ShopItemDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: {
    code: string
    name: string
    category: string
    unit: string
    price: number
    stock: number
    status: string
    description: string
    imageUrl: string
  }
  categoryOptions: Array<{ value: string; label: string }>
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onSelectCategory: (val: string) => void
  onSelectUnit: (val: string) => void
  onSelectStatus: (val: string) => void
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
  uploadingImage: boolean

  // Cropper states
  cropState: {
    isOpen: boolean
    imageSrc: string | null
    crop: { x: number; y: number }
    zoom: number
  }
  onCropStateChange: (updater: (prev: any) => any) => void
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void
  onCropSave: () => void
  onCloseCrop: () => void
}

export function ShopItemDialog({
  isOpen,
  onClose,
  mode,
  formData,
  categoryOptions,
  onChange,
  onSelectCategory,
  onSelectUnit,
  onSelectStatus,
  onImageFileChange,
  onSubmit,
  loading,
  error,
  uploadingImage,

  cropState,
  onCropStateChange,
  onCropComplete,
  onCropSave,
  onCloseCrop,
}: ShopItemDialogProps) {
  return (
    <>
      {/* Interactive Add/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === "create"
                ? "Thêm sản phẩm thương mại mới"
                : "Chỉnh sửa sản phẩm thương mại"}
            </DialogTitle>
            <DialogDescription>
              Nhập các trường thông tin cần thiết dưới đây để lưu sản phẩm
              thương mại.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 my-2">
            {error && (
              <InlineAlert
                type="error"
                title="Lỗi"
                description={error}
                className="my-2"
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã sản phẩm</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={onChange}
                  disabled={mode === "edit"}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Tên sản phẩm</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Danh mục phân loại</Label>
                <Select
                  value={formData.category}
                  onValueChange={onSelectCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Đơn vị tính</Label>
                <Select value={formData.unit} onValueChange={onSelectUnit}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Đơn vị tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cái">Cái / Chiếc</SelectItem>
                    <SelectItem value="chai">Chai</SelectItem>
                    <SelectItem value="hộp">Hộp</SelectItem>
                    <SelectItem value="gói">Gói</SelectItem>
                    <SelectItem value="kg">Kg (Kilogam)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Đơn giá (VND)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Tồn kho ban đầu</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="status">Trạng thái kinh doanh</Label>
                <Select value={formData.status} onValueChange={onSelectStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      Hoạt động (Được mở bán)
                    </SelectItem>
                    <SelectItem value="inactive">
                      Tạm ngưng hoạt động
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  placeholder="Nhập thông số hoặc mô tả sản phẩm..."
                  rows={3}
                />
              </div>

              <div className="space-y-2 col-span-2 border-t pt-4">
                <Label>Hình ảnh sản phẩm</Label>
                <div className="flex gap-4 items-center">
                  <div className="relative size-24 rounded-md overflow-hidden border bg-muted flex items-center justify-center text-muted-foreground">
                    {formData.imageUrl ? (
                      <Image
                        src={formData.imageUrl}
                        alt="Product Preview"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-8" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={onImageFileChange}
                        className="max-w-xs"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tải lên hình ảnh sản phẩm. Hệ thống sẽ mở khung cắt ảnh tỉ
                      lệ vuông 1:1.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6 border-t pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                Lưu sản phẩm
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Crop Dialog */}
      <Dialog
        open={cropState.isOpen}
        onOpenChange={(val) => !val && onCloseCrop()}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cắt ảnh sản phẩm (Tỉ lệ vuông 1:1)</DialogTitle>
            <DialogDescription>
              Kéo thả khung cắt để chọn góc ảnh đại diện đẹp nhất cho sản phẩm
              thương mại.
            </DialogDescription>
          </DialogHeader>

          {cropState.imageSrc && (
            <div className="relative w-full h-80 bg-muted rounded-md overflow-hidden my-4">
              <Cropper
                image={cropState.imageSrc}
                crop={cropState.crop}
                zoom={cropState.zoom}
                aspect={1} // 1:1 Aspect ratio
                onCropChange={(c) =>
                  onCropStateChange((prev) => ({ ...prev, crop: c }))
                }
                onCropComplete={onCropComplete}
                onZoomChange={(z) =>
                  onCropStateChange((prev) => ({ ...prev, zoom: z }))
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Độ phóng đại (Zoom)</Label>
            <Input
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
              className="w-full"
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              disabled={uploadingImage}
              onClick={onCloseCrop}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={uploadingImage}
              onClick={onCropSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {uploadingImage && (
                <Loader2 className="size-4 mr-2 animate-spin" />
              )}
              Cắt & Tải lên Cloudinary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
