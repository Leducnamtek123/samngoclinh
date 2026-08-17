import { z } from "zod"

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Mật khẩu hiện tại phải có ít nhất 8 ký tự",
  }),
  newPassword: z.string().min(8, {
    message: "Mật khẩu mới phải có ít nhất 8 ký tự",
  }),
  confirmPassword: z.string().min(8, {
    message: "Xác nhận mật khẩu phải có ít nhất 8 ký tự",
  }),
})
