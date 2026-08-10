import { Metadata } from "next"
import { PointsSettingsManager } from "./_components/points-settings-manager"

export const metadata: Metadata = {
  title: "Cấu hình Tỷ lệ điểm thưởng | Admin Sâm Ngọc Linh",
  description: "Cấu hình giá trị điểm tích lũy thanh toán",
}

export default function PointsSettingsPage() {
  return (
    <div className="p-6">
      <PointsSettingsManager />
    </div>
  )
}
