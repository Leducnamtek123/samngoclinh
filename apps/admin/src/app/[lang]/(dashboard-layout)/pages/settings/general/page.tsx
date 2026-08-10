import { Metadata } from "next"
import { GeneralSettingsManager } from "./_components/general-settings-manager"

export const metadata: Metadata = {
  title: "Cấu hình hệ thống chung | Admin Sâm Ngọc Linh",
  description: "Cấu hình chung cho hệ thống Sâm Ngọc Linh",
}

export default function GeneralSettingsPage() {
  return (
    <div className="p-6">
      <GeneralSettingsManager />
    </div>
  )
}
