"use client"

import React from "react"
import Image from "next/image"
import { Image as ImageIcon } from "lucide-react"

import type { UseFormReturn } from "react-hook-form"
import type { ShopItemFormValues } from "./shop-item-schema"

import { useTranslation } from "@/providers/i18n-provider"
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

interface ShopItemFormFieldsProps {
  form: UseFormReturn<ShopItemFormValues>
  mode: "create" | "edit"
  formData: {
    imageUrl?: string
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
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("products.categoryForm.code")}</FormLabel>
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
            <FormLabel>{t("products.categoryForm.name")}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("products.categoryForm.name")} />
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
            <FormLabel>{t("products.categoryForm.parent")}</FormLabel>
            <Select
              value={field.value}
              onValueChange={(val) => {
                field.onChange(val)
                onSelectCategory(val)
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("products.categoryForm.parent")}
                  />
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
            <FormLabel>{t("products.fields.unit")}</FormLabel>
            <Select
              value={field.value}
              onValueChange={(val) => {
                field.onChange(val)
                onSelectUnit(val)
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("products.fields.unit")} />
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
            <FormLabel>{t("products.fields.price")}</FormLabel>
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
            <FormLabel>{t("products.fields.stock")}</FormLabel>
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
            <FormLabel>{t("products.fields.status")}</FormLabel>
            <Select
              value={field.value}
              onValueChange={(val) => {
                field.onChange(val)
                onSelectStatus(val)
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("products.fields.status")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">
                  {t("common.status.active")}
                </SelectItem>
                <SelectItem value="inactive">
                  {t("common.status.inactive")}
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
            <FormLabel>{t("products.categoryForm.description")}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder={t("products.categoryForm.description")}
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:col-span-2 border-t pt-4 space-y-2">
        <FormLabel>{t("products.fields.image")}</FormLabel>
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
          </div>
        </div>
      </div>
    </div>
  )
}
