"use client"

import React from "react"
import Image from "next/image"
import type { UseFormReturn } from "react-hook-form"
import { Image as ImageIcon } from "lucide-react"
import {
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
import type { ShopItemFormValues } from "./shop-item-schema"

interface ShopItemFormFieldsProps {
  form: UseFormReturn<ShopItemFormValues>
  mode: "create" | "edit"
  formData: {
    imageUrl: string
  }
  dynamicCategoryOptions: Array<{ value: string; label: string }>
  unitOptions: Array<{ value: string; label: string }>
  onSelectCategory: (val: string) => void
  onSelectUnit: (val: string) => void
  onSelectStatus: (val: string) => void
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ShopItemFormFields({
  form,
  mode,
  formData,
  dynamicCategoryOptions,
  unitOptions,
  onSelectCategory,
  onSelectUnit,
  onSelectStatus,
  onImageFileChange,
}: ShopItemFormFieldsProps) {
  return (
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
                src={formData.imageUrl || form.watch("imageUrl") || ""}
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
              Tải lên hình ảnh sản phẩm. Hệ thống sẽ mở khung cắt ảnh tỉ lệ vuông 1:1.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
