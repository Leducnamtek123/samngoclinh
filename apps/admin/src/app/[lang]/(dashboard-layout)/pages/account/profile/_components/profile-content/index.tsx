import Link from "next/link"
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  History,
  Key,
  Layers,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Shield,
  Sprout,
  User,
  Users,
} from "lucide-react"

import type { UserProfileData } from "../../page"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const activityLogs = [
  {
    id: "log-1",
    title: "Duyệt hồ sơ định danh eKYC",
    desc: "Xác thực tài khoản nhà đầu tư Nguyễn Văn An (#INV-8823)",
    time: "Hôm nay, 14:32",
    icon: <FileCheck className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: "log-2",
    title: "Cập nhật dữ liệu Luống Sâm 31",
    desc: "Ghi nhận chỉ số độ ẩm đất 72% và phân bón hữu cơ tại Vườn Noàng Sâm 2026",
    time: "Hôm nay, 10:15",
    icon: <Sprout className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: "log-3",
    title: "Xuất bản lô mã QR Code",
    desc: "Khởi tạo 150 mã QR truy xuất nguồn gốc sâm củ 3 năm tuổi",
    time: "Hôm qua, 16:40",
    icon: <QrCode className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: "log-4",
    title: "Cấu hình chính sách giá & ưu đãi",
    desc: "Cập nhật tỷ lệ điểm thưởng cho khách hàng hạng Vàng",
    time: "14/08/2026, 09:20",
    icon: <History className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: "log-5",
    title: "Đăng nhập hệ thống thành công",
    desc: "Truy cập từ bảng điều khiển Quản trị viên (IP: 127.0.0.1)",
    time: "14/08/2026, 08:00",
    icon: <Key className="w-4 h-4 text-emerald-600" />,
  },
]

const managedGardens = [
  {
    id: "garden-noang-1",
    name: "Noàng Sâm 2026 Số 1",
    location: "Đăk Tô, Kon Tum",
    bedsCount: 15,
    plantsCount: "30.000 cây",
    status: "Hoạt động",
  },
  {
    id: "gd-kontum-03",
    name: "Vườn Sâm Đăk Tô Kon Tum",
    location: "Kon Tum",
    bedsCount: 20,
    plantsCount: "350 cây",
    status: "Hoạt động",
  },
  {
    id: "gd-tralinh-01",
    name: "Vườn Sâm Trà Linh 01",
    location: "Trà Linh, Kon Tum",
    bedsCount: 12,
    plantsCount: "150 cây",
    status: "Hoạt động",
  },
]

export function ProfileContent({ user }: { user?: UserProfileData | null }) {
  const name = user?.name || "Quản trị viên Hệ thống"
  const email = user?.email || "admin@samngoclinh.com"
  const phone = user?.phone || "0967 234 234"
  const role = user?.role || "SUPER_ADMIN"

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
      {/* Cột trái: Thông tin nhân sự & Quyền hạn (5 cột) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Card: Thông tin cơ bản */}
        <Card className="rounded-2xl border-border shadow-xs">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Hồ sơ Nhân sự & Tài khoản</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Thông tin chức danh và phạm vi quản lý nội bộ
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">
                  Đơn vị công tác
                </p>
                <p className="font-bold text-foreground">
                  Hệ thống Nông nghiệp Số Sâm Ngọc Linh
                </p>
                <p className="text-xs text-muted-foreground">
                  Trung tâm Quản trị & Điều hành Canh tác
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">
                  Chức vụ & Quyền hạn
                </p>
                <p className="font-bold text-foreground">
                  {role === "SUPER_ADMIN"
                    ? "Tổng Quản Trị Hệ Thống (Super Admin)"
                    : "Quản Lý Vườn Sâm"}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-none font-bold text-[10px] inline-flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Toàn quyền Quản trị (All-Access)</span>
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">
                  Email liên hệ
                </p>
                <p className="font-bold text-foreground">{email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">
                  Số điện thoại
                </p>
                <p className="font-bold text-foreground">{phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">
                  Ngày kích hoạt
                </p>
                <p className="font-bold text-foreground">01/01/2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Bảo mật & Xác thực */}
        <Card className="rounded-2xl border-border shadow-xs">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>Tiêu chuẩn Bảo mật</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">
                Xác thực 2 yếu tố (2FA)
              </span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã kích hoạt
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Cấp bậc phân quyền</span>
              <span className="font-bold text-foreground">Mức 1 (Tối cao)</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">
                Trạng thái tài khoản
              </span>
              <Badge
                variant="secondary"
                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold"
              >
                Hoạt động bình thường
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cột phải: Vườn phụ trách & Nhật ký hoạt động (7 cột) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Card: Khu vườn phụ trách trực tiếp */}
        <Card className="rounded-2xl border-border shadow-xs">
          <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Khu vườn Phụ trách & Giám sát</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Danh sách các điểm canh tác chính thuộc thẩm quyền quản trị
              </CardDescription>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs h-7 rounded-lg"
            >
              <Link href="/pages/gardens">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {managedGardens.map((g) => (
              <div
                key={g.id}
                className="p-3.5 rounded-xl border border-border/60 hover:border-emerald-300 dark:hover:border-emerald-700 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-foreground">
                      {g.name}
                    </h4>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    >
                      {g.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span>{g.location}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-primary">
                    {g.plantsCount}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {g.bedsCount} luống sâm
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Card: Nhật ký Hoạt động Quản trị */}
        <Card className="rounded-2xl border-border shadow-xs">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" />
              <span>Nhật ký Hoạt động Gần đây</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Lịch sử các thao tác vận hành nông nghiệp & quản trị hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 text-xs pb-3 border-b border-border/40 last:border-0 last:pb-0"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {log.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-foreground text-sm">
                        {log.title}
                      </p>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {log.time}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {log.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
