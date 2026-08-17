import { Suspense } from "react"

import type { Metadata } from "next"
import type { BackofficeOverview, Order, ShopItem } from "@/types"

import { backofficeService } from "@/services/backoffice.service"
import { catalogService } from "@/services/catalog.service"
import { ordersService } from "@/services/orders.service"

import { ChurnRate } from "./_components/churn-rate"
import { CustomerInsights } from "./_components/customer-insights"
import { GenderDistribution } from "./_components/gender-distribution"
import { Invoices } from "./_components/invoices"
import { Overview } from "./_components/overview"
import { RevenueBySource } from "./_components/revenue-by-source"
import { SalesTrend } from "./_components/sales-trend"
import { TopProducts } from "./_components/top-products"

export const metadata: Metadata = {
  title: "Báo cáo Bán hàng & Doanh thu | Sâm Ngọc Linh Admin",
  description:
    "Thống kê chi tiết doanh số các dòng Rượu Sâm Ngọc Linh thượng hạng, sâm củ và hợp đồng ủy quyền canh tác",
}

interface EcommercePageProps {
  params: Promise<{
    lang: string
  }>
}

export default async function EcommercePage(props: EcommercePageProps) {
  await props.params
  let overview: BackofficeOverview | null = null
  let orders: Order[] = []
  let shopItems: ShopItem[] = []

  try {
    const [overviewRes, ordersRes, catalogRes] = await Promise.all([
      backofficeService.getOverview().catch(() => null),
      ordersService.getOrders({ perPage: 10 }).catch(() => null),
      catalogService.getShopItems({ perPage: 6 }).catch(() => null),
    ])

    if (overviewRes?.data) {
      overview = overviewRes.data
    }
    if (ordersRes?.data && Array.isArray(ordersRes.data)) {
      orders = ordersRes.data
    }
    if (catalogRes?.data && Array.isArray(catalogRes.data)) {
      shopItems = catalogRes.data
    }
  } catch (error) {
    console.error("Error loading ecommerce dashboard data:", error)
  }

  return (
    <section className="container grid gap-6 p-4 md:p-6 mx-auto md:grid-cols-2">
      <div className="col-span-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
            Báo cáo Bán hàng & Doanh thu
          </h1>
          <p className="text-muted-foreground">
            Thống kê chi tiết doanh số các dòng Rượu Sâm Ngọc Linh thượng hạng, sâm củ và hợp đồng ủy quyền canh tác.
          </p>
        </div>
      </div>
      <Overview stats={overview} />
      <ChurnRate overview={overview} />
      <RevenueBySource
        sources={overview?.trafficSources}
        totalRevenue={overview?.totalRevenue}
      />
      <div className="col-span-full grid gap-4 md:grid-cols-4">
        <CustomerInsights overview={overview} />
        <GenderDistribution overview={overview} />
      </div>
      <SalesTrend
        monthlyRevenue={overview?.monthlyRevenue}
        totalRevenue={overview?.totalRevenue}
      />
      <TopProducts products={shopItems} />
      <Invoices orders={orders} />
    </section>
  )
}
