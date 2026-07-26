"use client"

import { Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/feedback-components"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CarePackage {
  id: string
  code: string
  name: string
  price: number
  durationMonths: number
  description?: string
  status: string
}

interface ProtectionPackage {
  id: string
  code: string
  name: string
  price: number
  coverage?: string
  description?: string
  status: string
}

interface CarePackagesListProps {
  packages: CarePackage[]
  onEdit: (pkg: CarePackage) => void
  onDelete: (id: string) => void
  onOpenCreate: () => void
  formatVND: (price: number) => string
}

export function CarePackagesList({
  packages,
  onEdit,
  onDelete,
  onOpenCreate,
  formatVND,
}: CarePackagesListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã gói</TableHead>
            <TableHead>Tên gói dịch vụ</TableHead>
            <TableHead>Đơn giá</TableHead>
            <TableHead>Thời hạn</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8">
                <EmptyState
                  title="Chưa có gói chăm sóc"
                  description="Chưa cấu hình gói chăm sóc định kỳ nào trong hệ thống. Hãy tạo gói đầu tiên để tiếp tục."
                  actionLabel="Thêm gói mới"
                  onAction={onOpenCreate}
                />
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-mono text-xs font-semibold">
                  {pkg.code}
                </TableCell>
                <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                  {pkg.name}
                </TableCell>
                <TableCell className="font-medium text-emerald-600">
                  {formatVND(pkg.price)}
                </TableCell>
                <TableCell>{pkg.durationMonths} tháng</TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">
                  {pkg.description || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={pkg.status === "active" ? "default" : "outline"}
                  >
                    {pkg.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(pkg)}
                      className="h-8 w-8 text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(pkg.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

interface ProtectionPackagesListProps {
  packages: ProtectionPackage[]
  onEdit: (pkg: ProtectionPackage) => void
  onDelete: (id: string) => void
  onOpenCreate: () => void
  formatVND: (price: number) => string
}

export function ProtectionPackagesList({
  packages,
  onEdit,
  onDelete,
  onOpenCreate,
  formatVND,
}: ProtectionPackagesListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã gói</TableHead>
            <TableHead>Tên gói bảo vệ</TableHead>
            <TableHead>Đơn giá</TableHead>
            <TableHead>Phạm vi bảo hiểm</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8">
                <EmptyState
                  title="Chưa có gói bảo vệ"
                  description="Chưa cấu hình gói bảo vệ/bảo hiểm nào trong hệ thống. Hãy tạo gói bảo vệ đầu tiên."
                  actionLabel="Thêm gói mới"
                  onAction={onOpenCreate}
                />
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-mono text-xs font-semibold">
                  {pkg.code}
                </TableCell>
                <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                  {pkg.name}
                </TableCell>
                <TableCell className="font-medium text-emerald-600">
                  {formatVND(pkg.price)}
                </TableCell>
                <TableCell className="text-sm">{pkg.coverage || "—"}</TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">
                  {pkg.description || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={pkg.status === "active" ? "default" : "outline"}
                  >
                    {pkg.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(pkg)}
                      className="h-8 w-8 text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(pkg.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
