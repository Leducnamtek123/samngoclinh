"use client"

import React from "react"
import Cropper from "react-easy-crop"
import { Loader2 } from "lucide-react"

import type { Area } from "react-easy-crop"

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

export type { Area }

export interface CropState {
  isOpen: boolean
  imageSrc: string | null
  crop: { x: number; y: number }
  zoom: number
  croppedAreaPixels?: Area | null
}

interface ShopItemCropDialogProps {
  cropState: CropState
  onCropStateChange: (updater: (prev: CropState) => CropState) => void
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void
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
          <DialogTitle>Cắt và căn chỉnh ảnh sản phẩm</DialogTitle>
          <DialogDescription>
            Kéo thả và chỉnh tỉ lệ để có hình ảnh đại diện vuông đẹp nhất
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-64 bg-slate-900 rounded-md overflow-hidden my-2">
          {cropState.imageSrc && (
            <Cropper
              image={cropState.imageSrc}
              crop={cropState.crop}
              zoom={cropState.zoom}
              aspect={1}
              onCropChange={(crop) =>
                onCropStateChange((prev) => ({ ...prev, crop }))
              }
              onZoomChange={(zoom) =>
                onCropStateChange((prev) => ({ ...prev, zoom }))
              }
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <div className="space-y-2 py-2">
          <FormLabel className="text-xs">
            Phóng to / Thu nhỏ ({cropState.zoom.toFixed(1)}x)
          </FormLabel>
          <Input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={cropState.zoom}
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              onCropStateChange((prev) => ({
                ...prev,
                zoom: val,
              }))
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
          />
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCloseCrop}
            disabled={uploadingImage}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={onCropSave}
            disabled={uploadingImage}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {uploadingImage ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Lưu & Tải lên"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
