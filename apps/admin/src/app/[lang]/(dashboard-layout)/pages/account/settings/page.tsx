import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"

import { DangerousZone } from "./_components/general/dangerous-zone"
import { ProfileInfo } from "./_components/general/profile-info"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: "Profile Information Settings",
}

export default async function ProfileInfoPage() {
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
        const defaultAddr =
          profile.addresses?.find((a: any) => a.isDefault) ||
          profile.addresses?.[0]

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
  } catch (error) {
    console.error("Error fetching user profile in settings page:", error)
  }

  return (
    <div className="grid gap-4">
      <ProfileInfo user={user} />
      <DangerousZone user={user} />
    </div>
  )
}
