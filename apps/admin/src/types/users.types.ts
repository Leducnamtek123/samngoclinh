export type UserStatus = "active" | "inactive" | "blocked" | "pending"
export type RoleType = "superAdmin" | "admin" | "user" | "staff"

export interface Role {
  id: string
  name: string
  description?: string
  type: RoleType | string
  abilities?: string[]
  createdAt?: string
}

export interface AdminUser {
  id: string
  name: string | null
  username: string
  email: string
  roleId?: string
  role?: Role | string
  roleName?: string
  status: UserStatus | string
  gender?: string | null
  birthDate?: string | null
  countryId?: string
  lastLoginAt?: string | null
  lastIPAddress?: string | null
  phoneNumber?: string | null
  phone?: string | null
  identityNumber?: string | null
  cccd?: string | null
  address?: string | null
  avatar?: string | null
  isVerified?: boolean
  signUpDate?: string
  mobileNumbers?: Array<{ number: string }>
  addresses?: Array<{ detail: string; isDefault?: boolean }>
  createdAt: string
  updatedAt?: string
}

export interface UserActivityLog {
  id: string
  userId: string
  userName?: string
  action: string
  description?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}
