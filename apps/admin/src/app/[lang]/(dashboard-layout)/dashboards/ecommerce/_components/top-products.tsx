import type { ShopItem } from "@/types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { TopProductsList } from "./top-products-list"

interface TopProductsProps {
  products?: ShopItem[] | null
}

export function TopProducts({ products }: TopProductsProps) {
  const formattedProducts =
    products && products.length > 0
      ? products.slice(0, 5).map((p, idx) => ({
          name: p.name,
          sales: { value: p.stock || 0, percentageChange: 0.05 },
          revenue: {
            value: (p.price || 0) * (p.stock || 1),
            percentageChange: 0.05,
          },
          order: idx + 1,
          image: p.images?.[0] || "/images/placeholders/product.png",
          sku: p.code || `PROD-${idx + 1}`,
        }))
      : []

  return (
    <DashboardCard
      title="Sản Phẩm & Cây Giống Bán Chạy"
      period="Toàn hệ thống"
      action={<DashboardCardActionsDropdown />}
      className="flex flex-col"
      contentClassName="h-[29rem] overflow-y-auto pr-2 flex flex-col justify-start gap-y-3"
      size="lg"
    >
      <TopProductsList data={formattedProducts} />
    </DashboardCard>
  )
}
