"use client"

import React from "react"
import type { UseFormReturn } from "react-hook-form"
import type { TreeFormValues } from "@/schemas/tree-schema"
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

export interface Bed {
  id: string
  code: string
  name: string
}

interface TreeFormFieldsProps {
  form: UseFormReturn<TreeFormValues>
  mode: "create" | "edit"
  beds: Bed[]
  users: any[]
  t: (key: string) => string
}

export function TreeFormFields({
  form,
  mode,
  beds,
  users,
  t,
}: TreeFormFieldsProps) {
  return (
    <div className="grid gap-4 py-2 grid-cols-2">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>{t("trees.fields.name")}</FormLabel>
            <FormControl>
              <Input placeholder={t("trees.fields.name")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ageYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.age")}</FormLabel>
            <FormControl>
              <Input type="number" min={0} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input type="number" min={1} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {mode === "create" && (
        <FormField
          control={form.control}
          name="bedCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("trees.fields.bed")}</FormLabel>
              <Select
                value={field.value || "none"}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("trees.fields.bed")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">— None —</SelectItem>
                  {beds.map((bed) => (
                    <SelectItem key={bed.id} value={bed.code}>
                      {bed.name} ({bed.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {mode === "edit" && (
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                value={field.value || "available"}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("trees.fields.status")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">
                    {t("common.status.available")} (Có sẵn)
                  </SelectItem>
                  <SelectItem value="active">
                    {t("common.status.active")} (Hoạt động)
                  </SelectItem>
                  <SelectItem value="growing">
                    Đang phát triển (Growing)
                  </SelectItem>
                  <SelectItem value="planted">
                    Mới trồng (Planted)
                  </SelectItem>
                  <SelectItem value="harvested">
                    {t("common.status.harvested")} (Đã thu hoạch)
                  </SelectItem>
                  <SelectItem value="sold">
                    Đã bán (Sold)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="healthStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.healthStatus")}</FormLabel>
            <Select
              value={field.value || "healthy"}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("trees.fields.healthStatus")}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="healthy">
                  {t("common.status.healthy")}
                </SelectItem>
                <SelectItem value="diseased">
                  {t("common.status.diseased")}
                </SelectItem>
                <SelectItem value="weak">
                  {t("common.status.warning")}
                </SelectItem>
                <SelectItem value="dead">
                  {t("common.status.error")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="plantedAt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.plantedDate")}</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expectedHarvestAt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expected Harvest</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="priceBought"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("products.fields.price")} (VND)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="5000000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ownerUserId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Owner</FormLabel>
            <Select
              value={field.value || "system"}
              onValueChange={(val) =>
                field.onChange(val === "system" ? "" : val)
              }
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="system">
                  System (Hệ thống)
                </SelectItem>
                {users.map((u) => {
                  const fullName = (
                    u.fullName ||
                    u.name ||
                    [u.firstName, u.lastName].filter(Boolean).join(" ")
                  ).trim()
                  const handleOrEmail = u.username || u.email || u.id
                  const displayName = fullName
                    ? `${fullName} (${handleOrEmail})`
                    : handleOrEmail
                  return (
                    <SelectItem key={u.id} value={u.id}>
                      {displayName}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
