"use client"

import React, { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import type { Area, CropState } from "./shop-item-crop-dialog"
import type { ShopItemFormValues } from "./shop-item-schema"

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
import { Form } from "@/components/ui/form"
import { ShopItemCropDialog } from "./shop-item-crop-dialog"
import { ShopItemFormFields } from "./shop-item-form-fields"
import { DEFAULT_UNITS, shopItemSchema } from "./shop-item-schema"

export type { ShopItemFormValues }

interface ShopItemDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: ShopItemFormValues
  categoryOptions: { value: string; label: string }[]
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onFormChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onSelectCategory: (val: string) => void
  onSelectUnit?: (val: string) => void
  onSelectStatus: (val: string) => void
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (data: ShopItemFormValues) => void
  loading: boolean
  error: string
  uploadingImage: boolean

  // Cropper states
  cropState: CropState
  onCropStateChange: (updater: (prev: CropState) => CropState) => void
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void
  onCropSave: () => void
  onCloseCrop: () => void
}

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

  const currentUnit = form.watch("unit")
  const unitOptions = [...DEFAULT_UNITS]
  if (currentUnit && !unitOptions.some((u) => u.value === currentUnit)) {
    unitOptions.push({
      value: currentUnit,
      label: currentUnit,
    })
  }

  const currentCategory = form.watch("category")
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

              <ShopItemFormFields
                form={form}
                mode={mode}
                formData={formData}
                dynamicCategoryOptions={dynamicCategoryOptions}
                unitOptions={unitOptions}
                onSelectCategory={onSelectCategory}
                onSelectUnit={onSelectUnit || (() => {})}
                onSelectStatus={onSelectStatus}
                onImageFileChange={onImageFileChange}
              />

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

      <ShopItemCropDialog
        cropState={cropState}
        onCropStateChange={onCropStateChange}
        onCropComplete={onCropComplete}
        onCropSave={onCropSave}
        onCloseCrop={onCloseCrop}
        uploadingImage={uploadingImage}
      />
    </>
  )
}
