"use client"

import React from "react"
import Cropper from "react-easy-crop"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface ShopItemCropDialogProps {
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
  uploadingImage: boolean
}

export function ShopItemCropDialog({
  cropState,
  onCropStateChange,
  onCropComplete,
  onCropSave,
  onCloseCrop,
  uploadingImage,
}: ShopItemCropDialogProps) {
  return (
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
  )
}
