import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"
import { userData } from "@/data/user"

import { DangerousZone } from "./_components/general/dangerous-zone"
import { ProfileInfo } from "./_components/general/profile-info"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: "Profile Information Settings",
}

export default async function ProfileInfoPage() {
  let user = userData

  try {
    const res = await fetchApi("/user/profile")
    const payload = await res.json()
    if (res.ok && payload.data) {
      const profile = payload.data
      const nameParts = profile.name ? profile.name.trim().split(/\s+/) : ["Admin"]
      const firstName = nameParts.slice(0, -1).join(" ") || "Admin"
      const lastName = nameParts[nameParts.length - 1] || "User"

      user = {
        ...userData,
        id: profile.id || "1",
        name: profile.name || "Admin User",
        firstName,
        lastName,
        email: profile.email || "admin@mail.com",
        username: profile.username || "admin",
        phoneNumber: profile.mobileNumbers?.[0]?.number || "",
        avatar: profile.photo?.url || "/images/avatars/male-01.svg",
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
