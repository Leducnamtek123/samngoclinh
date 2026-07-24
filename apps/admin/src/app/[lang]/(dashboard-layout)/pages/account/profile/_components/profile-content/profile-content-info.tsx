import { ProfileContentConnection } from "./profile-content-info-connection"
import { ProfileContentIntro } from "./profile-content-info-intro"

export function ProfileContentInfo({ user }: { user?: any }) {
  return (
    <div className="flex-1 space-y-4 md:flex-none md:w-2/5">
      <ProfileContentIntro user={user} />
      <ProfileContentConnection />
    </div>
  )
}
