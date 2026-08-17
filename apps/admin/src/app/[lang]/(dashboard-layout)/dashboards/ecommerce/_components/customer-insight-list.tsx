"use client"

import { Crown, UserCheck, UserPlus, Users } from "lucide-react"

import type { CustomerInsightsType } from "../types"

import { CustomerInsightItem } from "./customer-insight-item"

export function CustomerInsightList({ data }: { data: CustomerInsightsType }) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(165px,1fr))] gap-3 md:justify-items-center">
      <CustomerInsightItem
        title="Tổng khách hàng"
        value={data.totalCustomers}
        icon={Users}
        color="hsl(var(--chart-1))"
      />
      <CustomerInsightItem
        title="Khách hàng mới"
        value={data.newCustomers}
        icon={UserPlus}
        color="hsl(var(--chart-2))"
      />
      <CustomerInsightItem
        title="Khách hàng quay lại"
        value={data.returningCustomers}
        icon={UserCheck}
        color="hsl(var(--chart-3))"
      />
      <CustomerInsightItem
        title="Khách hàng VIP"
        value={data.vipCustomers}
        icon={Crown}
        color="hsl(var(--chart-4))"
      />
    </ul>
  )
}
