import { Metadata } from "next"
import { ShippingSettingsManager } from "./_components/shipping-settings-manager"

export const metadata: Metadata = {
  title: "Cấu hình Phí vận chuyển | Admin Sâm Ngọc Linh",
  description: "Quản lý phí giao hàng mặc định cho hệ thống bán hàng",
}

export default function ShippingSettingsPage() {
  return (
    <div className="p-6">
      <ShippingSettingsManager />
    </div>
  )
}
