import { z } from "zod"

export const gardenFormSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "Tên khu vườn không được để trống"),
  status: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  area: z.union([z.string(), z.number()]).optional(),
  maxBeds: z.union([z.string(), z.number()]).optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  managerName: z.string().optional(),
  managerPhone: z.string().optional(),
  establishedAt: z.string().optional(),
})

export type GardenFormValues = z.infer<typeof gardenFormSchema>
