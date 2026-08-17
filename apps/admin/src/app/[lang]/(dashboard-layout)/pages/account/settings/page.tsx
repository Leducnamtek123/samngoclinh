import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"

import { DangerousZone } from "./_components/general/dangerous-zone"
import { ProfileInfo } from "./_components/general/profile-info"

export const metadata: Metadata = {
  title: "Cài đặt thông tin tài khoản | Sâm Ngọc Linh Admin",
  description: "Quản lý thông tin cá nhân và thiết lập tài khoản quản trị",
}

interface AddressItem {
  id?: string
  detail?: string
  isDefault?: boolean
}

interface ProfileSettingsUser {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  username: string
  phoneNumber: string
  avatar: string
  role: string
  country: string
  address: string
  state: string
  zipCode: string
  language: string
  timeZone: string
  currency: string
  organization: string
}

export default async function ProfileInfoPage() {
  let user: ProfileSettingsUser | null = null

  try {
    let res = await fetchApi("/v1/shared/user/profile")
    if (!res.ok) {
      res = await fetchApi("/user/profile")
    }
    if (res.ok) {
      const payload = await res.json()
      if (payload.data) {
        const profile = payload.data
        const fullName = (profile.name || profile.username || "").trim()
        const nameParts = fullName ? fullName.split(/\s+/) : []
        const firstName =
          nameParts.length > 1
            ? nameParts.slice(0, -1).join(" ")
            : nameParts[0] || ""
        const lastName =
          nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""
        const addresses: AddressItem[] = Array.isArray(profile.addresses)
          ? profile.addresses
          : []
        const defaultAddr =
          addresses.find((a: AddressItem) => a.isDefault) || addresses[0]

        user = {
          id: profile.id || "",
          name: fullName,
          firstName,
          lastName,
          email: profile.email || "",
          username: profile.username || "",
          phoneNumber:
            profile.mobileNumbers?.[0]?.number || profile.phone || "",
          avatar: profile.photo?.url || profile.avatar || "",
          role: profile.role?.name || profile.role || "",
          country: profile.country?.name || "",
          address: defaultAddr?.detail || "",
          state: "",
          zipCode: "",
          language: "vi",
          timeZone: "Asia/Ho_Chi_Minh",
          currency: "VND",
          organization: "",
        }
      }
    }
  } catch (error: unknown) {
    console.error("Failed to load profile info settings:", error)
  }

  return (
    <div className="space-y-6">
      <ProfileInfo user={user || undefined} />
      <DangerousZone />
    </div>
  )
}
