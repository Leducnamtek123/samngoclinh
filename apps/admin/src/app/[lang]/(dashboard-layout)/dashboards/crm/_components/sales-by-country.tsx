import type { BackofficeOverview } from "@/types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { SalesByCountryChart } from "./sales-by-country-chart"

interface SalesByCountryProps {
  overview?: BackofficeOverview | null
}

export function SalesByCountry({ overview }: SalesByCountryProps) {
  const visitorsByCountry = overview?.visitorsByCountry || []
  const countries =
    visitorsByCountry.length > 0
      ? visitorsByCountry.map((c) => ({
          countryName: c.country,
          countryCode: (c.code || "VN").toUpperCase(),
          sales: c.visitors * 50000,
        }))
      : []

  return (
    <DashboardCard
      title="Thị Trường & Khu Vực Đầu Tư"
      period="Toàn hệ thống"
      action={<DashboardCardActionsDropdown />}
    >
      <SalesByCountryChart data={countries} />
    </DashboardCard>
  )
}
