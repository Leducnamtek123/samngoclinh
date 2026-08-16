"use client"

import { useEffect } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import Cropper from "react-easy-crop"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const shopItemSchema = z.object({
  code: z.string().min(1, "Mã sản phẩm không được để trống"),
  name: z.string().min(2, "Tên sản phẩm phải có ít nhất 2 ký tự"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  unit: z.string().min(1, "Vui lòng chọn đơn vị tính"),
  price: z.coerce
    .number({ invalid_type_error: "Đơn giá phải là số" })
    .min(0, "Đơn giá không được âm"),
  stock: z.coerce
    .number({ invalid_type_error: "Tồn kho phải là số" })
    .min(0, "Tồn kho không được âm"),
  status: z.string().min(1, "Vui lòng chọn trạng thái"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
})

export type ShopItemFormValues = z.infer<typeof shopItemSchema>

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
  onSubmit: (data: ShopItemFormValues) => void
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

const DEFAULT_UNITS = [
  { value: "cái", label: "Cái / Chiếc" },
  { value: "chai", label: "Chai" },
  { value: "Chai 750ml", label: "Chai 750ml" },
  { value: "hũ", label: "Hũ" },
  { value: "Hũ 200ml", label: "Hũ 200ml" },
  { value: "lọ", label: "Lọ" },
  { value: "hộp", label: "Hộp" },
  { value: "Hộp 20 gói", label: "Hộp 20 gói" },
  { value: "gói", label: "Gói" },
  { value: "kg", label: "Kg (Kilogam)" },
  { value: "pcs", label: "Chiếc (Pcs)" },
]

export function ShopItemDialog({
  isOpen,
  onClose,
  mode,
  formData,
  categoryOptions,
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
  const form = useForm<ShopItemFormValues>({
    resolver: zodResolver(shopItemSchema),
    defaultValues: {
      code: formData.code || "",
      name: formData.name || "",
      category: formData.category || "processed",
      unit: formData.unit || "cái",
      price: formData.price || 0,
      stock: formData.stock || 0,
      status: formData.status || "active",
      description: formData.description || "",
      imageUrl: formData.imageUrl || "",
    },
  })

  // Sync form values whenever dialog opens or formData prop changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        code: formData.code || "",
        name: formData.name || "",
        category: formData.category || "processed",
        unit: formData.unit || "cái",
        price: formData.price || 0,
        stock: formData.stock || 0,
        status: formData.status || "active",
        description: formData.description || "",
        imageUrl: formData.imageUrl || "",
      })
    }
  }, [isOpen, formData, form])

  // Dynamically build unit options to guarantee the selected value exists in the select
  const currentUnit = form.watch("unit") || formData.unit
  const unitOptions = [...DEFAULT_UNITS]
  if (currentUnit && !unitOptions.some((u) => u.value === currentUnit)) {
    unitOptions.push({ value: currentUnit, label: currentUnit })
  }

  // Dynamically build category options to guarantee selected category exists
  const currentCategory = form.watch("category") || formData.category
  const dynamicCategoryOptions = [...categoryOptions]
  if (
    currentCategory &&
    !dynamicCategoryOptions.some((c) => c.value === currentCategory)
  ) {
    dynamicCategoryOptions.push({
      value: currentCategory,
      label: currentCategory,
    })
  }

  const handleFormSubmit = (values: ShopItemFormValues) => {
    onSubmit(values)
  }

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

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4 my-2"
            >
              {error && (
                <InlineAlert
                  type="error"
                  title="Lỗi xử lý"
                  description={error}
                  className="my-2"
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã sản phẩm (SKU)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={mode === "edit"}
                          placeholder="PROD-01"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên sản phẩm</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Rượu Sâm Ngọc Linh..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục phân loại</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val)
                          onSelectCategory(val)
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dynamicCategoryOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đơn vị tính</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val)
                          onSelectUnit(val)
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn đơn vị tính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {unitOptions.map((u) => (
                            <SelectItem key={u.value} value={u.value}>
                              {u.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đơn giá (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng tồn kho</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Trạng thái kinh doanh</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val)
                          onSelectStatus(val)
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">
                            Hoạt động (Được mở bán)
                          </SelectItem>
                          <SelectItem value="inactive">
                            Tạm ngưng hoạt động
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Mô tả chi tiết</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Nhập thông số hoặc mô tả sản phẩm..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 border-t pt-4 space-y-2">
                  <FormLabel>Hình ảnh sản phẩm</FormLabel>
                  <div className="flex gap-4 items-center">
                    <div className="relative size-24 rounded-md overflow-hidden border bg-muted flex items-center justify-center text-muted-foreground">
                      {formData.imageUrl || form.watch("imageUrl") ? (
                        <Image
                          src={
                            formData.imageUrl || form.watch("imageUrl") || ""
                          }
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
                        Tải lên hình ảnh sản phẩm. Hệ thống sẽ mở khung cắt ảnh
                        tỉ lệ vuông 1:1.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6 border-t pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                  Lưu sản phẩm
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
                aspect={1}
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
            <FormLabel>Độ phóng đại (Zoom)</FormLabel>
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
