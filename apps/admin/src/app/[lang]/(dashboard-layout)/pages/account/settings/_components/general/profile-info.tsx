import type { UserType } from "../../../types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProfileInfoForm } from "./profile-info-form"

export function ProfileInfo({ user }: { user?: UserType }) {
  return (
    <Card className="rounded-2xl border-border shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg font-extrabold text-foreground">Thông tin tài khoản quản trị</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Cập nhật thông tin định danh cá nhân và cơ sở nông trường phụ trách.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileInfoForm user={user} />
      </CardContent>
    </Card>
  )
}
