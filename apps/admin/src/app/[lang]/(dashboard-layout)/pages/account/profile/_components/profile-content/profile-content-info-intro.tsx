import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileContentIntroList } from "./profile-content-info-intro-list"

export function ProfileContentIntro({ user }: { user?: any }) {
  return (
    <Card asChild>
      <article>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileContentIntroList user={user} />
        </CardContent>
      </article>
    </Card>
  )
}
