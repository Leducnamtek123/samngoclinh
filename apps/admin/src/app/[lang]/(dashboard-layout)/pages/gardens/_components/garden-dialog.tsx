"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { GardenFormValues } from "@/schemas/garden-schema"

import { gardenFormSchema } from "@/schemas/garden-schema"

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface GardenDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: GardenFormValues
  onSubmit: (values: GardenFormValues) => void
  loading: boolean
  error: string
}

export function GardenDialog({
  isOpen,
  onClose,
  mode,
  formData,
  onSubmit,
  loading,
  error,
}: GardenDialogProps) {
  const { t } = useTranslation()

  const form = useForm<GardenFormValues>({
    resolver: zodResolver(gardenFormSchema),
    defaultValues: formData,
  })

  useEffect(() => {
    if (isOpen) {
      form.reset(formData)
    }
  }, [isOpen, formData, form])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[625px] overflow-y-auto max-h-[90vh]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Thêm khu vườn mới" : "Chỉnh sửa khu vườn"}
              </DialogTitle>
              <DialogDescription>
                Điền các thông tin của khu vườn dưới đây. Nhấn Lưu khi hoàn tất.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Tên khu vườn *</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên vườn sâm..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vị trí địa lý</FormLabel>
                    <FormControl>
                      <Input placeholder="Kon Tum, Quảng Nam..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diện tích (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên quản lý vườn</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SĐT quản lý vườn</FormLabel>
                    <FormControl>
                      <Input placeholder="0987654321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxBeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số luống tối đa</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Mô tả chi tiết</FormLabel>
                    <FormControl>
                      <Input placeholder="Mô tả về khu vườn..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                {t("common.actions.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading
                  ? t("common.status.pending")
                  : t("common.actions.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
