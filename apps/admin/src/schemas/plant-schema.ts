import { z } from "zod"

export const plantFormSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  price: z.coerce.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  stock: z.coerce.number().min(0, "Tồn kho phải lớn hơn hoặc bằng 0"),
  ageYear: z.coerce.number().min(0, "Số năm tuổi không hợp lệ"),
  status: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
})

export type PlantFormValues = z.infer<typeof plantFormSchema>
