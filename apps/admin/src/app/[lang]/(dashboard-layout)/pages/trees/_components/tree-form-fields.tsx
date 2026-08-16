"use client"

import React from "react"
import type { UseFormReturn } from "react-hook-form"
import type { TreeFormValues } from "@/schemas/tree-schema"
import type { AdminUser, Bed } from "@/types"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type { Bed }

interface TreeFormFieldsProps {
  form: UseFormReturn<TreeFormValues>
  mode: "create" | "edit"
  beds: Bed[]
  users: AdminUser[] | Array<{ id: string; name?: string | null; username: string; email?: string }>
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
        name="bedCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.bedCode")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("trees.placeholders.selectBed")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">
                  {t("trees.placeholders.noBed")}
                </SelectItem>
                {beds.map((b) => (
                  <SelectItem key={b.id} value={b.code}>
                    {b.name} ({b.code})
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
        name="ownerUserId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.owner")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("trees.placeholders.selectOwner")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name || u.username} ({u.email || u.username})
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
        name="ageYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.ageYear")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                placeholder={t("trees.fields.ageYear")}
                {...field}
              />
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
            <FormLabel>{t("trees.fields.quantity")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                placeholder={t("trees.fields.quantity")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="healthStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.healthStatus")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("trees.placeholders.selectHealthStatus")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Tốt">{t("trees.health.good")}</SelectItem>
                <SelectItem value="Bình thường">{t("trees.health.normal")}</SelectItem>
                <SelectItem value="Kém">{t("trees.health.poor")}</SelectItem>
                <SelectItem value="Cần chăm sóc đặc biệt">{t("trees.health.critical")}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.status")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("trees.placeholders.selectStatus")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">{t("trees.status.active")}</SelectItem>
                <SelectItem value="harvested">{t("trees.status.harvested")}</SelectItem>
                <SelectItem value="diseased">{t("trees.status.diseased")}</SelectItem>
                <SelectItem value="dead">{t("trees.status.dead")}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="priceBought"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.priceBought")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                placeholder={t("trees.fields.priceBought")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="plantedAt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.plantedAt")}</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value}
                onChangeStr={field.onChange}
                placeholder={t("trees.placeholders.selectDate")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastCareDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.lastCareDate")}</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value}
                onChangeStr={field.onChange}
                placeholder={t("trees.placeholders.selectDate")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nextCareDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("trees.fields.nextCareDate")}</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value}
                onChangeStr={field.onChange}
                placeholder={t("trees.placeholders.selectDate")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expectedHarvestAt"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>{t("trees.fields.expectedHarvestAt")}</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value}
                onChangeStr={field.onChange}
                placeholder={t("trees.placeholders.selectDate")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
