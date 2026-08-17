import type { SalesTrendType } from "../types"

import { formatCurrency, formatDateShort } from "@/lib/utils"

import { SalesTrendSummaryItem } from "./sales-trend-summary-item"

export function SalesTrendSummary({
  data,
}: {
  data: SalesTrendType["summary"]
}) {
  return (
    <ul className="flex flex-col justify-around gap-4 sm:flex-row">
      <div className="flex flex-wrap justify-around gap-4 md:flex-col">
        <SalesTrendSummaryItem
          title="Doanh thu cao nhất"
          value={formatCurrency(data.highestSales.sales)}
          description={`vào ${data.highestSales.date}`}
        />
        <SalesTrendSummaryItem
          title="Doanh thu thấp nhất"
          value={formatCurrency(data.lowestSales.sales)}
          description={`vào ${data.lowestSales.date}`}
        />
      </div>
      <div className="flex flex-wrap justify-around gap-4 md:flex-col">
        <SalesTrendSummaryItem
          title="Tổng doanh thu"
          value={formatCurrency(data.totalSales)}
          description="toàn kỳ thống kê"
        />
        <SalesTrendSummaryItem
          title="Trung bình mỗi kỳ"
          value={formatCurrency(data.avgSales)}
          description="bình quân chu kỳ"
        />
      </div>
    </ul>
  )
}
