import type { Metadata } from "next"

import { ChurnRate } from "./_components/churn-rate"
import { CustomerInsights } from "./_components/customer-insights"
import { GenderDistribution } from "./_components/gender-distribution"
import { Invoices } from "./_components/invoices"
import { Overview } from "./_components/overview"
import { RevenueBySource } from "./_components/revenue-by-source"
import { SalesTrend } from "./_components/sales-trend"
import { TopProducts } from "./_components/top-products"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: "Ecommerce",
}

export default function EcommercePage() {
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
      <Overview />
      <ChurnRate />
      <RevenueBySource />
      <div className="col-span-full grid gap-4 md:grid-cols-4">
        <CustomerInsights />
        <GenderDistribution />
      </div>
      <SalesTrend />
      <TopProducts />
      <Invoices />
    </section>
  )
}
