import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"
import { userData } from "@/data/user"
import { ProfileContent } from "./_components/profile-content"
import { ProfileHeader } from "./_components/profile-header"

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân | Admin",
  description: "Thông tin chi tiết tài khoản quản trị hệ thống Sâm Ngọc Linh",
}

export default async function ProfilePage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  let user = userData

  try {
    let res = await fetchApi("/user/profile/me")
    if (!res.ok) {
      res = await fetchApi("/user/profile")
    }
    const payload = await res.json()
    if (res.ok && payload.data) {
      const profile = payload.data
      const nameParts = profile.name ? profile.name.trim().split(/\s+/) : ["Admin"]
      const firstName = nameParts.slice(0, -1).join(" ") || "Admin"
      const lastName = nameParts[nameParts.length - 1] || "User"

      user = {
        ...userData,
        id: profile.id || "1",
        name: profile.name || profile.username || "Admin User",
        firstName,
        lastName,
        email: profile.email || "admin@samngoclinh.com",
        username: profile.username || "admin",
        role: profile.role?.name || profile.role || "Quản trị viên",
        phoneNumber: profile.mobileNumbers?.[0]?.number || profile.phone || "---",
        avatar: profile.photo?.url || profile.avatar || "/images/avatars/male-01.svg",
      }
    }
  } catch (error) {
    console.error("Error fetching user profile in profile page:", error)
  }

  return (
    <div className="container px-0">
      <ProfileHeader locale={params.lang} user={user} />
      <ProfileContent user={user} />
    </div>
  )
}

