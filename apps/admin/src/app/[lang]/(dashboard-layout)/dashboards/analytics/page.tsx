import type { Metadata } from "next"
import Link from "next/link"
import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, ArrowRight, Sprout, FileText, ShoppingCart, Users } from "lucide-react"

import { ConversionFunnel } from "./_components/conversion-funnel"
import { EngagementByDevice } from "./_components/engagement-by-device"
import { NewVsReturningVisitors } from "./_components/new-vs-returning-visitors"
import { Overview } from "./_components/overview"
import { PerformanceOverTime } from "./_components/performance-over-time"
import { TrafficSources } from "./_components/traffic-sources"
import { VisitorsByCountry } from "./_components/visitors-by-country"

export const metadata: Metadata = {
  title: "Bảng điều khiển | Sâm Ngọc Linh Admin",
  description: "Báo cáo thống kê hiệu năng, canh tác và kinh doanh hệ thống Sâm Ngọc Linh",
}

interface OverviewData {
  totalPendingApprovals: number
  totalActiveProviders: number
  totalArticles: number
  totalGardens: number
  totalBeds: number
  totalTrees: number
  totalOrders: number
  totalRevenue: number
  totalContracts: number
  totalSignedContracts: number
  totalUsers: number
}

export default async function AnalyticsPage() {
  let stats: OverviewData = {
    totalPendingApprovals: 0,
    totalActiveProviders: 0,
    totalArticles: 0,
    totalGardens: 0,
    totalBeds: 0,
    totalTrees: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalContracts: 0,
    totalSignedContracts: 0,
    totalUsers: 0,
  }
  let errorMsg = ""

  try {
    const res = await fetchApi("/admin/backoffice/overview")
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Không thể tải báo cáo từ hệ thống"
    } else if (payload.data) {
      stats = payload.data
    }
  } catch (e) {
    console.error("Error fetching admin backoffice overview:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">Báo cáo Quản trị</h1>
          <p className="text-muted-foreground">
            Tổng quan hiệu suất hoạt động kinh doanh, tình hình canh tác nông trại sâm Ngọc Linh toàn hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold px-3 py-1">
            Nông trại trực tuyến
          </Badge>
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 font-semibold px-3 py-1">
            Hợp tác xã sâm Ngọc Linh
          </Badge>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive font-medium">
          {errorMsg} (Hiển thị dữ liệu tạm thời)
        </div>
      )}

      {/* Cần xử lý khẩn cấp (KYC pending) */}
      {stats.totalPendingApprovals > 0 && (
        <Alert className="bg-amber-50 text-amber-900 border-amber-200 flex items-center justify-between p-4 rounded-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <AlertTitle className="font-bold text-sm">Yêu cầu xác minh danh tính đang chờ duyệt</AlertTitle>
              <AlertDescription className="text-xs text-amber-700">
                Có <strong>{stats.totalPendingApprovals} yêu cầu xác thực KYC</strong> từ người dùng mới đăng ký chưa được phê duyệt.
              </AlertDescription>
            </div>
          </div>
          <Link href="/pages/users">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5">
              Phê duyệt ngay <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </Alert>
      )}

      {/* Top 4 KPI mini charts */}
      <Overview stats={stats} />

      {/* Main visual charts grid */}
      <section className="grid gap-6 md:grid-cols-2">
        <TrafficSources stats={stats} />
        <ConversionFunnel />
        <NewVsReturningVisitors stats={stats} />
        <PerformanceOverTime stats={stats} />
        <VisitorsByCountry stats={stats} />
        
        {/* Quick Operations Shortcuts inside dashboard */}
        <div className="flex flex-col justify-between border rounded-xl p-6 bg-slate-50 dark:bg-slate-900 border-slate-200 shadow-sm dark:border-slate-800">
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Vận hành nhanh</h3>
            <p className="text-sm text-muted-foreground mb-4">Các thao tác xử lý nghiệp vụ chính của Admin</p>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/pages/gardens">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-white bg-slate-100/50">
                  <Sprout className="h-4 w-4 text-emerald-600" /> Vườn & Luống
                </Button>
              </Link>
              <Link href="/pages/contracts">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-white bg-slate-100/50">
                  <FileText className="h-4 w-4 text-amber-600" /> Hợp đồng Điện tử
                </Button>
              </Link>
              <Link href="/pages/orders">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-white bg-slate-100/50">
                  <ShoppingCart className="h-4 w-4 text-blue-600" /> Đơn đặt hàng
                </Button>
              </Link>
              <Link href="/pages/users">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-white bg-slate-100/50">
                  <Users className="h-4 w-4 text-teal-600" /> Hồ sơ người dùng
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-muted-foreground flex justify-between items-center">
            <span>Dữ liệu cập nhật theo thời gian thực</span>
            <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50">Live</Badge>
          </div>
        </div>

        <EngagementByDevice stats={stats} />
      </section>
    </div>
  )
}
