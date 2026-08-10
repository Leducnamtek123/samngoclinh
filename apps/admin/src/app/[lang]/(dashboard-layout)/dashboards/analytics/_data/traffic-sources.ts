import type { TrafficSourcesType } from "../types"

export const trafficSourcesData: TrafficSourcesType = {
  period: "Tháng này",
  sources: [
    {
      name: "Vườn liên kết",
      visitors: 4000,
      fill: "hsl(var(--chart-1))",
      percentageChange: 0.3,
      icon: "Sprout",
    },
    {
      name: "Đại lý phân phối",
      visitors: 2500,
      fill: "hsl(var(--chart-2))",
      percentageChange: 0.25,
      icon: "House",
    },
    {
      name: "Đơn hàng Online",
      visitors: 2000,
      fill: "hsl(var(--chart-3))",
      percentageChange: 0.2,
      icon: "ShoppingBag",
    },
    {
      name: "Khách ký gửi tự do",
      visitors: 1000,
      fill: "hsl(var(--chart-4))",
      percentageChange: -0.1,
      icon: "User",
    },
    {
      name: "Hợp đồng doanh nghiệp",
      visitors: 500,
      fill: "hsl(var(--chart-5))",
      percentageChange: 0.05,
      icon: "FileCheck",
    },
  ],
}
