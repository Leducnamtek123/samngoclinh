import { z } from "zod"

export const treeFormSchema = z.object({
  name: z.string().min(1, "Tên cây sâm không được để trống"),
  ageYear: z.coerce.number().min(0, "Tuổi cây phải lớn hơn hoặc bằng 0"),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn hoặc bằng 1"),
  status: z.string().default("planted"),
  healthStatus: z.string().default("healthy"),
  bedCode: z.string().optional(),
  ownerUserId: z.string().optional(),
  plantedAt: z.string().optional(),
  expectedHarvestAt: z.string().optional(),
  lastCareDate: z.string().optional(),
  nextCareDate: z.string().optional(),
  priceBought: z.string().optional(),
})

export type TreeFormValues = z.infer<typeof treeFormSchema>
