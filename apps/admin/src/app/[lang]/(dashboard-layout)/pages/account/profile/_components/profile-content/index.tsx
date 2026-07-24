import { ProfileContentInfo } from "./profile-content-info"
import { ProfileContentMainFeed } from "./profile-content-main-feed"

export function ProfileContent({ user }: { user?: any }) {
  return (
    <section className="flex flex-col gap-4 p-4 md:flex-row">
      <ProfileContentInfo user={user} />
      <ProfileContentMainFeed />
    </section>
  )
}

