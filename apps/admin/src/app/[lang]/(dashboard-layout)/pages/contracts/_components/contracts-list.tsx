"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  FileText,
  FileDown,
  QrCode,
  Eye,
  Trash2,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreVertical,
  ExternalLink,
} from "lucide-react"

import type { EContract, User } from "./contracts-manager"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ContractsListProps {
  contracts: EContract[]
  users: User[]
  lang: string
  onDelete: (id: string) => void
}

const formatVND = (value: number) => {
  return Number(value || 0).toLocaleString("vi-VN") + " đ"
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "signed":
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 font-semibold gap-1 text-[11px]">
          <CheckCircle2 className="w-3 h-3" /> Đã ký
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 font-semibold gap-1 text-[11px]">
          <Clock className="w-3 h-3" /> Chờ ký
        </Badge>
      )
    case "expired":
      return (
        <Badge variant="destructive" className="gap-1 text-[11px]">
          <AlertTriangle className="w-3 h-3" /> Hết hạn
        </Badge>
      )
    case "cancelled":
      return (
        <Badge variant="outline" className="text-slate-500 text-[11px]">
          Đã hủy
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="text-[11px]">
          {status}
        </Badge>
      )
  }
}

const getContractTypeLabel = (type?: string) => {
  switch (type) {
    case "purchase_and_care":
      return "Mua bán & Ký gửi"
    case "purchase":
      return "Mua bán sâm"
    case "consignment":
      return "Ký gửi chăm sóc"
    case "care":
      return "Gói chăm sóc"
    default:
      return type || "Mua bán"
  }
}

export function ContractsList({
  contracts,
  users,
  lang,
  onDelete,
}: ContractsListProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/70 dark:bg-slate-900/40">
            <TableRow>
              <TableHead className="w-[180px]">Hợp đồng</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Nguồn phát sinh</TableHead>
              <TableHead>Loại hợp đồng</TableHead>
              <TableHead>Giá trị & Thanh toán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời hạn</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-16 text-muted-foreground"
                >
                  <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Không tìm thấy hợp đồng nào</p>
                  <p className="text-xs text-muted-foreground">Thử điều chỉnh lại từ khóa tìm kiếm hoặc bộ lọc trạng thái.</p>
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => {
                const userObj = users.find((u) => u.id === contract.userId)
                const isEkyc = Boolean(userObj?.isVerified)
                const meta = (contract.metadata || {}) as Record<string, any>
                const orderCode =
                  meta.orderCode ||
                  (contract.code?.startsWith("CTR-") ? contract.code.replace("CTR-", "ORD-") : null)
                const isOrderSource = Boolean(
                  meta.orderId || meta.orderCode || contract.contractType === "purchase_and_care"
                )
                const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3002"
                const pdfDownloadUrl = `${apiUrl}/public/contracts/${contract.code}/pdf`
                const traceUrl = `${webUrl}/trace/contract/${contract.code}`

                return (
                  <TableRow key={contract.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    {/* Contract Code & Title */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Link
                          href={`/${lang}/pages/contracts/${contract.id}`}
                          className="font-mono text-xs font-bold text-primary hover:underline"
                        >
                          {contract.code}
                        </Link>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                          {contract.title}
                        </span>
                      </div>
                    </TableCell>

                    {/* Customer */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {userObj?.name || contract.partyB || "Khách hàng"}
                          </span>
                          {isEkyc && (
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200" title="Đã xác thực eKYC CCCD">
                              <UserCheck className="w-3 h-3 mr-0.5" /> eKYC
                            </span>
                          )}
                        </div>
                        <span className="text-muted-foreground text-[11px] truncate max-w-[180px]">
                          {userObj?.email || "—"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Source (Order vs Manual) */}
                    <TableCell>
                      {isOrderSource ? (
                        <div className="flex flex-col gap-0.5">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-semibold w-max"
                          >
                            Đơn hàng {orderCode ? `#${orderCode}` : ""}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">Tự động khi thanh toán</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-semibold w-max"
                          >
                            Thủ công
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">Admin phát hành</span>
                        </div>
                      )}
                    </TableCell>

                    {/* Contract Type */}
                    <TableCell className="text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {getContractTypeLabel(contract.contractType)}
                      </span>
                    </TableCell>

                    {/* Value & Payment */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {formatVND(contract.contractValue)}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            contract.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {contract.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getStatusBadge(contract.status)}</TableCell>

                    {/* Expiration */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(contract.expiredAt).toLocaleDateString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/${lang}/pages/contracts/${contract.id}`}>
                          <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1">
                            <Eye className="w-3.5 h-3.5" /> Chi tiết
                          </Button>
                        </Link>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 text-xs">
                            <DropdownMenuItem asChild>
                              <a href={pdfDownloadUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer gap-2">
                                <FileDown className="w-4 h-4 text-primary" /> Tải bản PDF
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={traceUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer gap-2">
                                <QrCode className="w-4 h-4 text-emerald-600" /> Tra cứu QR
                              </a>
                            </DropdownMenuItem>
                            {contract.status !== "signed" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setDeleteConfirmId(contract.id)}
                                  className="text-red-600 focus:text-red-700 cursor-pointer gap-2"
                                >
                                  <Trash2 className="w-4 h-4" /> Xóa hợp đồng
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deleteConfirmId)}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hợp đồng này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa hợp đồng khỏi hệ thống quản lý. Thao tác không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  onDelete(deleteConfirmId)
                  setDeleteConfirmId(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa hợp đồng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
