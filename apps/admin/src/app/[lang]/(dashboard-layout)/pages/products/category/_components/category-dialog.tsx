"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
  FormDescription,
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
import type { ProductCategory } from "./use-categories-manager"

const categorySchema = z.object({
  code: z.string().min(2, "Mã danh mục phải có ít nhất 2 ký tự"),
  name: z.string().min(2, "Tên danh mục không được để trống"),
  slug: z.string().min(2, "Slug không được để trống"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  selectedCategory: ProductCategory | null
  onSave: (data: CategoryFormValues) => void
}

export function CategoryDialog({
  isOpen,
  onClose,
  mode,
  selectedCategory,
  onSave,
}: CategoryDialogProps) {
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
    if (mode === "edit" && selectedCategory) {
      form.reset({
        code: selectedCategory.code,
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        description: selectedCategory.description || "",
        status: selectedCategory.status,
      })
    } else {
      form.reset({
        code: `CAT-${Math.floor(100 + Math.random() * 900)}`,
        name: "",
        slug: "",
        description: "",
        status: "active",
      })
    }
  }, [mode, selectedCategory, form, isOpen])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameVal = e.target.value
    form.setValue("name", nameVal)
    if (mode === "create") {
      const generatedSlug = nameVal
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
      form.setValue("slug", generatedSlug)
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
              ? "Thêm danh mục sản phẩm mới"
              : "Chỉnh sửa danh mục sản phẩm"}
          </DialogTitle>
          <DialogDescription>
            Điền đầy đủ thông tin để quản lý danh mục phân loại sản phẩm.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 my-2">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã danh mục (Code)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="VD: processed" disabled={mode === "edit"} />
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
                  <FormLabel>Tên danh mục</FormLabel>
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
                  <FormLabel>Đường dẫn tĩnh (Slug)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="VD: san-pham-che-bien" />
                  </FormControl>
                  <FormDescription>Tự động tạo từ tên danh mục</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Tạm ẩn</SelectItem>
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
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Nhập mô tả nhóm sản phẩm..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">
                Lưu danh mục
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
