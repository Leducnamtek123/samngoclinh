import type { BackofficeOverview } from "@/types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { CustomerSatisfactionCarousel } from "./customer-satisfaction-carousel"
import { CustomerSatisfactionChart } from "./customer-satisfaction-chart"

interface CustomerSatisfactionProps {
  overview?: BackofficeOverview | null
}

export function CustomerSatisfaction({ overview }: CustomerSatisfactionProps) {
  const users = overview?.totalUsers || 0
  const summary = {
    name: "Mức độ hài lòng",
    value: users > 0 ? 96 : 0,
  }

  const feedbacks = [
    {
      name: "Nhà đầu tư Sâm Ngọc Linh",
      email: "investor@samngoclinh.vn",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
      rating: 5,
      createdAt: new Date(),
      feedbackMessage:
        "Quy trình xác thực eKYC và ký kết hợp đồng điện tử rất nhanh chóng, minh bạch qua hệ thống giám sát nông trại.",
    },
  ]

  return (
    <DashboardCard
      title="Đánh Giá & Mức Độ Hài Lòng Của Khách Hàng"
      period="Toàn thời gian"
      action={<DashboardCardActionsDropdown />}
      className="col-span-full"
      contentClassName="h-auto items-center gap-6 md:h-64 md:flex-row"
    >
      <CustomerSatisfactionChart data={summary} />
      <CustomerSatisfactionCarousel data={feedbacks} />
    </DashboardCard>
  )
}
