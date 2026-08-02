import { z } from "zod"

import { formatFileSize } from "@/lib/utils"

import { MAX_AVATAR_SIZE } from "../../constants"

export const fomratedAvatarSize = formatFileSize(MAX_AVATAR_SIZE)

export const ProfileInfoSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  language: z.string().optional(),
  timeZone: z.string().optional(),
  currency: z.string().optional(),
  organization: z.string().optional(),
  avatar: z
    .instanceof(File)
    .refine((avatar) => avatar.size <= MAX_AVATAR_SIZE, {
      message: `Avatar must be ${fomratedAvatarSize} or less.`,
    })
    .optional(),
})
