import Link from "next/link"
import { PackageOpen, Plus } from "lucide-react"

import type { PricingPlansType } from "@/components/pricing-plans"
import type { CarePackage, ProtectionPackage } from "@/types"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Pricing } from "./_components/pricing"
import { packagesService } from "@/services/packages.service"

export const metadata: Metadata = {
  title: "Bảng giá gói dịch vụ | Sâm Ngọc Linh Admin",
  description: "Quản lý bảng giá các gói chăm sóc và bảo vệ vườn sâm Ngọc Linh",
}

export default async function PricingPage() {
  const plans: PricingPlansType[] = []

  try {
    const [careRes, protRes] = await Promise.all([
      packagesService.getCarePackages({ perPage: 2 }).catch(() => null),
      packagesService.getProtectionPackages({ perPage: 1 }).catch(() => null),
    ])

    if (
      careRes?.data &&
      Array.isArray(careRes.data) &&
      careRes.data.length > 0
    ) {
      careRes.data.forEach((pkg: CarePackage, idx: number) => {
        plans.push({
          title: pkg.name || `Gói chăm sóc ${idx + 1}`,
          description:
            pkg.description || "Gói chăm sóc định kỳ vườn Sâm Ngọc Linh",
          price: pkg.price || 0,
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

    if (
      protRes?.data &&
      Array.isArray(protRes.data) &&
      protRes.data.length > 0
    ) {
      const pkg = protRes.data[0]
      plans.push({
        title: pkg.name || "Gói bảo hiểm & bảo vệ toàn diện",
        description:
          pkg.description || "Bảo hiểm rủi ro thiên tai & giám sát 24/7",
        price: pkg.price || 0,
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
  } catch (e: unknown) {
    console.error("Failed to fetch package pricing from API:", e)
  }

  if (plans.length === 0) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
          <PackageOpen className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Chưa có cấu hình bảng giá gói dịch vụ
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Hệ thống hiện tại chưa thiết lập gói chăm sóc hoặc bảo hiểm bảo vệ nào
          trong cơ sở dữ liệu.
        </p>
        <Link href="/pages/packages">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 mt-2">
            <Plus className="h-4 w-4" /> Tạo gói dịch vụ mới
          </Button>
        </Link>
      </div>
    )
  }

  return <Pricing data={plans} />
}
