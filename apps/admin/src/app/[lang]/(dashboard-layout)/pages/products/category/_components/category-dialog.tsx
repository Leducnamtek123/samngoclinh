"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { ProductCategory } from "./use-categories-manager"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const categorySchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (values: CategoryFormValues) => void
  selectedCategory?: ProductCategory | null
  initialData?: ProductCategory | null
  mode: "create" | "edit"
}

export function CategoryDialog({
  isOpen,
  onClose,
  onSave,
  selectedCategory,
  initialData,
  mode,
}: CategoryDialogProps) {
  const { t } = useTranslation()
  const activeData = selectedCategory || initialData
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      code: "",
      name: "",
      slug: "",
      description: "",
      status: "active",
    },
  })

  useEffect(() => {
    if (activeData && mode === "edit") {
      form.reset({
        code: activeData.code,
        name: activeData.name,
        slug: activeData.slug,
        description: activeData.description || "",
        status: activeData.status,
      })
    } else {
      form.reset({
        code: "",
        name: "",
        slug: "",
        description: "",
        status: "active",
      })
    }
  }, [activeData, mode, form, isOpen])

  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mode === "create") {
      const name = e.target.value
      form.setValue("slug", generateSlug(name), { shouldValidate: true })
    }
  }

  const handleSubmit = (values: CategoryFormValues) => {
    onSave(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? t("products.categoryForm.addTitle")
              : t("products.categoryForm.editTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("products.categoryForm.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 my-2"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("products.categoryForm.code")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="VD: processed"
                      disabled={mode === "edit"}
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
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleNameChange(e)
                      }}
                      placeholder="VD: Sản phẩm chế biến"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("products.categoryForm.slug")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="VD: san-pham-che-bien" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("products.categoryForm.status")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("products.categoryForm.status")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">{t("products.categoryForm.active")}</SelectItem>
                      <SelectItem value="inactive">{t("products.categoryForm.inactive")}</SelectItem>
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
                <FormItem>
                  <FormLabel>{t("products.categoryForm.desc")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Mô tả..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.actions.cancel")}
              </Button>
              <Button type="submit">{t("common.actions.save")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
