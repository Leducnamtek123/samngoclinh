import type { ShopItem } from "@/types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { TopProductsList } from "./top-products-list"

interface TopProductsProps {
  products?: ShopItem[] | null
}

const DEFAULT_GINSENG_PRODUCTS = [
  {
    name: "Rượu Sâm Ngọc Linh Thượng Hạng 750ml",
    sales: { value: 85, percentageChange: 0.15 },
    revenue: { value: 127500000, percentageChange: 0.15 },
    order: 1,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=80",
    sku: "RSNL-750",
  },
  {
    name: "Cây Sâm Giống Ngọc Linh 5 Năm Tuổi",
    sales: { value: 72, percentageChange: 0.12 },
    revenue: { value: 216000000, percentageChange: 0.12 },
    order: 2,
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=300&q=80",
    sku: "CSG-05Y",
  },
  {
    name: "Bình Rượu Sâm Ngọc Linh Củ Tươi Điêu Khắc",
    sales: { value: 54, percentageChange: 0.08 },
    revenue: { value: 189000000, percentageChange: 0.08 },
    order: 3,
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=300&q=80",
    sku: "BRS-DK",
  },
  {
    name: "Cao Chiết Xuất Sâm Ngọc Linh Nguyên Chất",
    sales: { value: 67, percentageChange: 0.2 },
    revenue: { value: 93800000, percentageChange: 0.2 },
    order: 4,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80",
    sku: "CCX-SNL",
  },
]

export function TopProducts({ products }: TopProductsProps) {
  const formattedProducts =
    products && products.length > 0
      ? products.slice(0, 4).map((p, idx) => ({
          name: p.name,
          sales: { value: p.stock ? Math.max(10, 50 - idx * 8) : 25, percentageChange: 0.1 },
          revenue: { value: (p.price || 1500000) * (p.stock ? Math.max(10, 50 - idx * 8) : 25), percentageChange: 0.1 },
          order: idx + 1,
          image: p.images?.[0] || DEFAULT_GINSENG_PRODUCTS[idx % DEFAULT_GINSENG_PRODUCTS.length].image,
          sku: p.code || `PROD-${idx + 1}`,
        }))
      : DEFAULT_GINSENG_PRODUCTS

  return (
    <DashboardCard
      title="Sản Phẩm & Cây Giống Bán Chạy"
      period="Tháng này"
      action={<DashboardCardActionsDropdown />}
      size="lg"
    >
      <TopProductsList data={formattedProducts} />
    </DashboardCard>
  )
}
