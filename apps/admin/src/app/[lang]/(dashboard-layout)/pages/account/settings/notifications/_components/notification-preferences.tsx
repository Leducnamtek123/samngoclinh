import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NotificationPreferencesForm } from "./notifications-preferenes-form"

export function NotificationPreferences() {
  return (
    <Card className="rounded-2xl border-border shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg font-extrabold text-foreground">
          Tùy chọn nhận thông báo
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Tùy chỉnh các kênh nhận thông báo quan trọng trong hệ sinh thái Sâm
          Ngọc Linh.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NotificationPreferencesForm />
      </CardContent>
    </Card>
  )
}
