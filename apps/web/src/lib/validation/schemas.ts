import { z } from 'zod';

export const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

export const phoneSchema = z
  .string()
  .min(1, 'validation.phone.required')
  .regex(phoneRegex, 'validation.phone.invalid');

export const emailSchema = z
  .string()
  .min(1, 'validation.email.required')
  .email('validation.email.invalid');

export const passwordSchema = z
  .string()
  .min(6, 'validation.password.min');

// Checkout / Shipping Address Schema
export const shippingAddressSchema = z.object({
  recipientName: z
    .string()
    .min(2, 'validation.shippingAddress.recipientMin')
    .max(100, 'validation.shippingAddress.recipientMax'),
  recipientPhone: phoneSchema,
  shippingAddress: z
    .string()
    .min(5, 'validation.shippingAddress.addressMin')
    .max(255, 'validation.shippingAddress.addressMax'),
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
  otp: z.string().length(6, 'validation.otp.length'),
  remember: z.boolean().optional(),
});

export type SignInPhoneFormValues = z.infer<typeof signInPhoneSchema>;

// Sign Up Schema
export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(2, 'validation.shippingAddress.recipientMin')
    .max(100, 'validation.shippingAddress.recipientMax'),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'validation.password.confirmRequired'),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'validation.signUp.agreeTerms',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.password.mismatch',
  path: ['confirmPassword'],
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

// Profile Info Schema
export const profileInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, 'validation.profileInfo.fullNameMin')
    .max(100, 'validation.profileInfo.fullNameMax'),
  gender: z.enum(['male', 'female'], {
    message: 'validation.profileInfo.genderRequired',
  }),
  birthDate: z.string().min(1, 'validation.profileInfo.birthDateRequired'),
  phone: phoneSchema,
});

export type ProfileInfoFormValues = z.infer<typeof profileInfoSchema>;

// Change Password Schema
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'validation.password.oldRequired'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'validation.password.confirmNewRequired'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'validation.password.mismatch',
  path: ['confirmPassword'],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

