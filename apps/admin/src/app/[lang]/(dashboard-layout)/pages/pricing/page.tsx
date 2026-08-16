import type { PricingPlansType } from "@/components/pricing-plans"
import type { Metadata } from "next"
import type { CarePackage, ProtectionPackage } from "@/types"

import { pricingData } from "./_data/pricing"
import { packagesService } from "@/services/packages.service"
import { Pricing } from "./_components/pricing"

export const metadata: Metadata = {
  title: "Bảng giá gói dịch vụ | Sâm Ngọc Linh Admin",
  description: "Quản lý bảng giá các gói chăm sóc và bảo vệ vườn sâm Ngọc Linh",
}

export default async function PricingPage() {
  let plans: PricingPlansType[] = pricingData

  try {
    const [careRes, protRes] = await Promise.all([
      packagesService.getCarePackages({ perPage: 2 }).catch(() => null),
      packagesService.getProtectionPackages({ perPage: 1 }).catch(() => null),
    ])

    const fetchedPlans: PricingPlansType[] = []

    if (careRes?.data && Array.isArray(careRes.data) && careRes.data.length > 0) {
      careRes.data.forEach((pkg: CarePackage, idx: number) => {
        fetchedPlans.push({
          title: pkg.name || `Gói chăm sóc ${idx + 1}`,
          description:
            pkg.description || "Gói chăm sóc định kỳ vườn Sâm Ngọc Linh",
          price: pkg.price || (idx === 0 ? 1500000 : 3500000),
          period: "tháng",
          features: [
            "Tưới tiêu & dinh dưỡng tự động",
            "Giám sát độ ẩm & thổ nhưỡng",
            "Nhật ký hình ảnh hàng tuần",
          ],
          isFeatured: idx === 1,
          href: "/pages/packages",
          buttonContent: "Quản lý gói",
        })
      })
    }

    if (protRes?.data && Array.isArray(protRes.data) && protRes.data.length > 0) {
      const pkg = protRes.data[0]
      fetchedPlans.push({
        title: pkg.name || "Gói bảo hiểm & bảo vệ toàn diện",
        description: pkg.description || "Bảo hiểm rủi ro thiên tai & giám sát 24/7",
        price: pkg.price || 5000000,
        period: "năm",
        features: [
          "Bảo hiểm cây giống 100%",
          "Camera an ninh AI 24/7",
          "Bác sĩ nông nghiệp thăm khám",
        ],
        isFeatured: false,
        href: "/pages/packages",
        buttonContent: "Quản lý gói",
      })
    }

    if (fetchedPlans.length > 0) {
      plans = fetchedPlans
    }
  } catch (e: unknown) {
    console.error("Failed to fetch package pricing from API:", e)
  }

  return <Pricing data={plans} />
}
