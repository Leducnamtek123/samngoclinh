import * as z from "zod"

export const shopItemSchema = z.object({
  code: z.string().min(1, "Mã sản phẩm không được để trống"),
  name: z.string().min(2, "Tên sản phẩm phải có ít nhất 2 ký tự"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  unit: z.string().min(1, "Vui lòng chọn đơn vị tính"),
  price: z.coerce
    .number({ invalid_type_error: "Đơn giá phải là số" })
    .min(0, "Đơn giá không được âm"),
  stock: z.coerce
    .number({ invalid_type_error: "Tồn kho phải là số" })
    .min(0, "Tồn kho không được âm"),
  status: z.string().min(1, "Vui lòng chọn trạng thái"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
})

export type ShopItemFormValues = z.infer<typeof shopItemSchema>

export const DEFAULT_UNITS = [
  { value: "cái", label: "Cái / Chiếc" },
  { value: "chai", label: "Chai" },
  { value: "Chai 750ml", label: "Chai 750ml" },
  { value: "hũ", label: "Hũ" },
  { value: "Hũ 200ml", label: "Hũ 200ml" },
  { value: "lọ", label: "Lọ" },
  { value: "hộp", label: "Hộp" },
  { value: "Hộp 20 gói", label: "Hộp 20 gói" },
  { value: "gói", label: "Gói" },
  { value: "kg", label: "Kg (Kilogam)" },
  { value: "pcs", label: "Chiếc (Pcs)" },
]
