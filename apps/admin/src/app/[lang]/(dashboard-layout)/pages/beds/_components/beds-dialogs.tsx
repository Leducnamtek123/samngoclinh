"use client"

import React from "react"
import { Sprout } from "lucide-react"

import type { Bed, Garden } from "@/types"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ConfirmationDialog,
  ToastCard,
} from "@/components/ui/feedback-components"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface BedFormData {
  gardenCode: string
  code?: string
  name: string
  soilType?: string
  width?: number | string
  length?: number | string
  maxTrees?: number
  treeCount?: number
  ageYear?: number
  description?: string
  status?: string
  lastFertilizedAt?: string
  lastWateredAt?: string
}

export interface BedDialogState {
  isOpen: boolean
  mode: "create" | "edit"
  selectedBed: Bed | null
  loading: boolean
  error: string
}

interface BedFormDialogProps {
  dialogState: BedDialogState
  setDialogState: React.Dispatch<React.SetStateAction<BedDialogState>>
  formData: BedFormData
  setFormData: React.Dispatch<React.SetStateAction<BedFormData>>
  gardens: Garden[]
  handleSaveBed: (e: React.FormEvent) => void
}

export function BedFormDialog({
  dialogState,
  setDialogState,
  formData,
  setFormData,
  gardens,
  handleSaveBed,
}: BedFormDialogProps) {
  return (
    <Dialog
      open={dialogState.isOpen}
      onOpenChange={(open) =>
        setDialogState((prev) => ({ ...prev, isOpen: open }))
      }
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
            {dialogState.mode === "create"
              ? "Tạo luống sâm mới"
              : "Chỉnh sửa luống sâm"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Thiết lập thông tin quy hoạch, kích thước và loại đất cho luống
            trồng sâm.
          </DialogDescription>
        </DialogHeader>

        {dialogState.error && (
          <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-lg border border-red-200">
            {dialogState.error}
          </div>
        )}

        <form onSubmit={handleSaveBed} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="gardenCode"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Thuộc khu vườn
              </Label>
              <Select
                value={formData.gardenCode}
                onValueChange={(val) =>
                  setFormData({ ...formData, gardenCode: val })
                }
              >
                <SelectTrigger className="text-xs font-semibold">
                  <SelectValue placeholder="Chọn vườn" />
                </SelectTrigger>
                <SelectContent>
                  {gardens.map((g) => (
                    <SelectItem
                      key={g.id}
                      value={g.code}
                      className="text-xs font-semibold"
                    >
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Tên luống sâm
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ví dụ: Luống A-01"
                required
                className="text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label
                htmlFor="ageYear"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Chu kỳ (Năm)
              </Label>
              <Input
                id="ageYear"
                type="number"
                min="1"
                value={formData.ageYear}
                onChange={(e) =>
                  setFormData({ ...formData, ageYear: Number(e.target.value) })
                }
                required
                className="text-xs font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="treeCount"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Số lượng gốc sâm
              </Label>
              <Input
                id="treeCount"
                type="number"
                min="0"
                value={formData.treeCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    treeCount: Number(e.target.value),
                  })
                }
                required
                className="text-xs font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="maxTrees"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Tối đa (Sức chứa)
              </Label>
              <Input
                id="maxTrees"
                type="number"
                min="1"
                value={formData.maxTrees}
                onChange={(e) =>
                  setFormData({ ...formData, maxTrees: Number(e.target.value) })
                }
                required
                className="text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label
                htmlFor="width"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Chiều rộng (m)
              </Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                value={formData.width}
                onChange={(e) =>
                  setFormData({ ...formData, width: e.target.value })
                }
                placeholder="Ví dụ: 1.5"
                className="text-xs font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="length"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Chiều dài (m)
              </Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                value={formData.length}
                onChange={(e) =>
                  setFormData({ ...formData, length: e.target.value })
                }
                placeholder="Ví dụ: 12"
                className="text-xs font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="soilType"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Loại đất trồng
              </Label>
              <Input
                id="soilType"
                value={formData.soilType}
                onChange={(e) =>
                  setFormData({ ...formData, soilType: e.target.value })
                }
                placeholder="Ví dụ: Đất mùn rừng"
                className="text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="lastWateredAt"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Ngày tưới nước cuối
              </Label>
              <Input
                id="lastWateredAt"
                type="date"
                value={formData.lastWateredAt}
                onChange={(e) =>
                  setFormData({ ...formData, lastWateredAt: e.target.value })
                }
                className="text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="lastFertilizedAt"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Ngày bón phân cuối
              </Label>
              <Input
                id="lastFertilizedAt"
                type="date"
                value={formData.lastFertilizedAt}
                onChange={(e) =>
                  setFormData({ ...formData, lastFertilizedAt: e.target.value })
                }
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-bold uppercase text-slate-500"
            >
              Ghi chú mô tả
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Ghi chú thêm về điều kiện khí hậu, kỹ thuật trồng..."
              className="text-xs font-semibold"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setDialogState((prev) => ({ ...prev, isOpen: false }))
              }
              disabled={dialogState.loading}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              disabled={dialogState.loading}
            >
              {dialogState.loading ? "Đang xử lý..." : "Lưu thông tin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export interface BedConfirmState {
  isOpen: boolean
  title: string
  description: string
  action: () => void
  loading: boolean
}

interface BedsOtherDialogsProps {
  confirmState: BedConfirmState
  setConfirmState: React.Dispatch<React.SetStateAction<BedConfirmState>>
  isQrDialogOpen: boolean
  setIsQrDialogOpen: (open: boolean) => void
  qrCodeData: string
  successMsg: string
  setSuccessMsg: (msg: string) => void
  errorMsg: string
  setErrorMsg: (msg: string) => void
}

export function BedsOtherDialogs({
  confirmState,
  setConfirmState,
  isQrDialogOpen,
  setIsQrDialogOpen,
  qrCodeData,
  successMsg,
  setSuccessMsg,
  errorMsg,
  setErrorMsg,
}: BedsOtherDialogsProps) {
  return (
    <>
      <ConfirmationDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        description={confirmState.description}
        isLoading={confirmState.loading}
        onConfirm={confirmState.action}
        onClose={() =>
          setConfirmState({
            isOpen: false,
            title: "",
            description: "",
            action: () => {},
            loading: false,
          })
        }
      />

      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sprout className="h-5 w-5 text-emerald-600" />
              Nhãn in QR Code luống sâm
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 my-2">
            <div className="w-40 h-40 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
              <div className="text-center p-4">
                <div className="w-24 h-24 bg-white border border-slate-300 mx-auto rounded flex items-center justify-center shadow-xs">
                  <span className="font-mono text-[9px] font-bold text-emerald-800">
                    QR_{qrCodeData}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-slate-700 mt-2 font-mono">
                  {qrCodeData}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-semibold">
              Nhãn QR được dán trực tiếp tại đầu luống trồng nhằm đồng bộ nhật
              ký di động qua camera.
            </p>
          </div>
          <DialogFooter className="flex sm:justify-center gap-2">
            <Button
              variant="outline"
              type="button"
              className="flex-1 font-semibold text-xs h-9"
              onClick={() => setIsQrDialogOpen(false)}
            >
              Đóng
            </Button>
            <Button
              type="button"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9"
              onClick={() => {
                setSuccessMsg(
                  "Đã tải xuống file ảnh nhãn QR Code in ấn thành công!"
                )
                setIsQrDialogOpen(false)
              }}
            >
              Tải xuống nhãn in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
        {successMsg && (
          <ToastCard
            type="success"
            title="Thành công"
            description={successMsg}
            onClose={() => setSuccessMsg("")}
          />
        )}
        {errorMsg && (
          <ToastCard
            type="error"
            title="Lỗi xảy ra"
            description={errorMsg}
            onClose={() => setErrorMsg("")}
          />
        )}
      </div>
    </>
  )
}
