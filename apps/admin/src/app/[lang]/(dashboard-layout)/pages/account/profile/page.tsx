import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"

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
  let user: any = null

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

        user = {
          id: profile.id || "",
          name: fullName,
          firstName,
          lastName,
          email: profile.email || "",
          username: profile.username || "",
          role: profile.role?.name || profile.role || "",
          phoneNumber:
            profile.mobileNumbers?.[0]?.number || profile.phone || "",
          avatar: profile.photo?.url || profile.avatar || "",
        }
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
