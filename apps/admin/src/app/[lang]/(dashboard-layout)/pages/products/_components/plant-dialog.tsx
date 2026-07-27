"use client"

import Image from "next/image"
import Cropper from "react-easy-crop"

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
    images?: string[]
  }
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
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
  const { t } = useTranslation()

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="sm:max-w-[475px]">
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>
                {mode === "create"
                  ? t("products.addProduct")
                  : t("products.editProduct")}
              </DialogTitle>
              <DialogDescription>{t("products.subtitle")}</DialogDescription>
            </DialogHeader>

            {error && (
              <InlineAlert
                type="error"
                title={t("common.status.error")}
                description={error}
                className="my-3"
              />
            )}

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-name">
                    {t("products.fields.name")}
                  </Label>
                  <Input
                    id="dialog-name"
                    name="name"
                    placeholder={t("products.fields.name")}
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dialog-code">
                    {t("products.fields.sku")}
                  </Label>
                  <Input
                    id="dialog-code"
                    name="code"
                    placeholder={t("products.fields.sku")}
                    value={formData.code}
                    onChange={onChange}
                    disabled={mode === "edit"}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-ageYear">Age</Label>
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
                  <Label htmlFor="dialog-price">
                    {t("products.fields.price")} (VND)
                  </Label>
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
                  <Label htmlFor="dialog-stock">
                    {t("products.fields.stock")}
                  </Label>
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
                  <Label htmlFor="dialog-status">
                    {t("products.fields.status")}
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={onSelectStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("products.fields.status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">
                        {t("common.status.active")}
                      </SelectItem>
                      <SelectItem value="harvested">
                        {t("common.status.completed")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dialog-image">
                    {t("products.fields.image")}
                  </Label>
                  <Input
                    id="dialog-image"
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={onImageFileChange}
                  />
                  {uploadingImage && (
                    <span className="text-xs text-slate-500">
                      {t("common.status.pending")}
                    </span>
                  )}
                  {formData.images && formData.images.length > 0 ? (
                    <div className="flex gap-2 mt-2 overflow-x-auto py-1">
                      {formData.images.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0"
                        >
                          <Image
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : formData.imageUrl ? (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border mt-1">
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dialog-description">
                  {t("products.fields.description")}
                </Label>
                <Textarea
                  id="dialog-description"
                  name="description"
                  placeholder={t("products.fields.description")}
                  value={formData.description}
                  onChange={onChange}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.actions.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {loading
                  ? t("common.status.pending")
                  : mode === "create"
                    ? t("common.actions.create")
                    : t("common.actions.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Image Cropping */}
      <Dialog
        open={cropState.isOpen}
        onOpenChange={(val) => !val && onCloseCrop()}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {t("common.actions.cropImage") || "Cắt hình ảnh (1:1)"}
            </DialogTitle>
            <DialogDescription>
              {t("common.actions.adjustCrop") ||
                "Điều chỉnh khung cắt hình ảnh"}
            </DialogDescription>
          </DialogHeader>

          <div className="relative w-full h-[300px] bg-slate-100 rounded-lg overflow-hidden border my-4">
            {cropState.imageSrc && (
              <Cropper
                image={cropState.imageSrc}
                crop={cropState.crop}
                zoom={cropState.zoom}
                aspect={1}
                onCropChange={(c) =>
                  onCropStateChange((prev) => ({ ...prev, crop: c }))
                }
                onZoomChange={(z) =>
                  onCropStateChange((prev) => ({ ...prev, zoom: z }))
                }
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                {t("common.labels.zoom") || "Thu phóng"}:
              </span>
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
                aria-label="Zoom"
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onCloseCrop}>
                {t("common.actions.cancel")}
              </Button>
              <Button
                type="button"
                onClick={onCropSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {t("common.actions.confirm")}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
