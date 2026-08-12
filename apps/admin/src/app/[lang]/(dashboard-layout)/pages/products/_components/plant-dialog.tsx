"use client"

import { useEffect } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import Cropper from "react-easy-crop"
import { useForm } from "react-hook-form"

import type { PlantFormValues } from "@/schemas/plant-schema"

import { plantFormSchema } from "@/schemas/plant-schema"

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

interface PlantDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: PlantFormValues & { images?: string[]; code?: string }
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (values: PlantFormValues) => void
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

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: formData,
  })

  useEffect(() => {
    if (isOpen) {
      form.reset(formData)
    }
  }, [isOpen, formData, form])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="sm:max-w-[475px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                />
              )}

              <div className="grid gap-4 py-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("products.fields.name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("products.fields.name")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="ageYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("products.fields.price")}</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
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
                        <FormLabel>{t("products.fields.stock")}</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("products.fields.status")}</FormLabel>
                        <Select
                          value={field.value || "available"}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("products.fields.status")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">
                              {t("common.status.active")}
                            </SelectItem>
                            <SelectItem value="harvested">
                              {t("common.status.completed")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-2">
                    <FormLabel>{t("products.fields.image")}</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={onImageFileChange}
                    />
                    {uploadingImage && (
                      <span className="text-xs text-slate-500">
                        {t("common.status.pending")}
                      </span>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("products.fields.description")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("products.fields.description")}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          </Form>
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
