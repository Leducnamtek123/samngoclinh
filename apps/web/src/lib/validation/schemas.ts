import { z } from 'zod';

export const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

export const phoneSchema = z
  .string()
  .min(1, 'Vui lòng nhập số điện thoại')
  .regex(phoneRegex, 'Số điện thoại không hợp lệ (ví dụ: 0912345678)');

export const emailSchema = z
  .string()
  .min(1, 'Vui lòng nhập địa chỉ email')
  .email('Địa chỉ email không hợp lệ');

export const passwordSchema = z
  .string()
  .min(6, 'Mật khẩu phải có ít nhất 6 ký tự');

// Checkout / Shipping Address Schema
export const shippingAddressSchema = z.object({
  recipientName: z
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không vượt quá 100 ký tự'),
  recipientPhone: phoneSchema,
  shippingAddress: z
    .string()
    .min(5, 'Địa chỉ giao hàng phải có ít nhất 5 ký tự')
    .max(255, 'Địa chỉ không vượt quá 255 ký tự'),
  notes: z.string().optional(),
});

export type ShippingAddressFormValues = z.infer<typeof shippingAddressSchema>;

// Sign In Email Schema
export const signInEmailSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  remember: z.boolean().optional(),
});

export type SignInEmailFormValues = z.infer<typeof signInEmailSchema>;

// Sign In Phone Schema
export const signInPhoneSchema = z.object({
  phone: phoneSchema,
  otp: z.string().length(6, 'Mã OTP phải có đúng 6 chữ số'),
  remember: z.boolean().optional(),
});

export type SignInPhoneFormValues = z.infer<typeof signInPhoneSchema>;

// Sign Up Schema
export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không vượt quá 100 ký tự'),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'Bạn phải đồng ý với điều khoản sử dụng',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không trùng khớp',
  path: ['confirmPassword'],
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

// Profile Info Schema
export const profileInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không vượt quá 100 ký tự'),
  gender: z.enum(['male', 'female'], {
    message: 'Vui lòng chọn giới tính',
  }),
  birthDate: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  phone: phoneSchema,
});


export type ProfileInfoFormValues = z.infer<typeof profileInfoSchema>;

// Change Password Schema
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu mới xác nhận không trùng khớp',
  path: ['confirmPassword'],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
