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

import type { AdminUser, EContract } from "@/types"
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
  users: AdminUser[]
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
    case "pending_signature":
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 font-semibold gap-1 text-[11px]">
          <Clock className="w-3 h-3" /> Chờ ký
        </Badge>
      )
    case "expired":
      return (
        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-semibold gap-1 text-[11px]">
          <AlertTriangle className="w-3 h-3" /> Hết hạn
        </Badge>
      )
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-300 font-semibold gap-1 text-[11px]">
          Đã hủy
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-slate-600 font-medium text-[11px]">
          {status}
        </Badge>
      )
  }
}

const getContractTypeLabel = (type?: string) => {
  switch (type) {
    case "custody":
    case "purchase_and_care":
      return "Ký gửi chăm sóc"
    case "purchase":
      return "Mua cây / Sở hữu"
    case "investment":
      return "Đầu tư vườn sâm"
    default:
      return type || "Hợp đồng ký gửi"
  }
}

export function ContractsList({
  contracts,
  users,
  lang,
  onDelete,
}: ContractsListProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

  return (
    <>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs bg-white dark:bg-slate-950">
        <Table>
          <TableHeader className="bg-slate-50/75 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="w-[180px]">Mã HĐ / Tiêu đề</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Nguồn phát hành</TableHead>
              <TableHead>Loại hợp đồng</TableHead>
              <TableHead>Giá trị hợp đồng</TableHead>
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
                const meta = (contract.metadata || {}) as Record<string, unknown>
                const contractCode = contract.code || contract.contractCode || contract.contractNumber || ""
                const orderCode =
                  (meta.orderCode as string) ||
                  (contractCode.startsWith("CTR-") ? contractCode.replace("CTR-", "ORD-") : null)
                const isOrderSource = Boolean(
                  meta.orderId || meta.orderCode || contract.contractType === "purchase_and_care"
                )
                const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3002"
                const pdfDownloadUrl = `${apiUrl}/public/contracts/${contractCode}/pdf`
                const traceUrl = `${webUrl}/trace/contract/${contractCode}`

                return (
                  <TableRow key={contract.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    {/* Contract Code & Title */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Link
                          href={`/${lang}/pages/contracts/${contract.id}`}
                          className="font-mono text-xs font-bold text-primary hover:underline"
                        >
                          {contractCode}
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
                            {userObj?.name || (typeof contract.partyB === "object" ? contract.partyB?.name : contract.partyB) || contract.customerName || "Khách hàng"}
                          </span>
                          {isEkyc && (
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200" title="Đã xác thực eKYC CCCD">
                              <UserCheck className="w-3 h-3 mr-0.5" /> eKYC
                            </span>
                          )}
                        </div>
                        <span className="text-muted-foreground text-[11px] truncate max-w-[180px]">
                          {userObj?.email || contract.customerEmail || "—"}
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
                          {formatVND(contract.totalValue || contract.contractValue || 0)}
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
                      {new Date(contract.expiresAt || contract.expiredAt || contract.createdAt).toLocaleDateString("vi-VN", {
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
                              <a
                                href={pdfDownloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <FileDown className="w-4 h-4 text-slate-600" />
                                Tải bản PDF chính thức
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a
                                href={traceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <QrCode className="w-4 h-4 text-emerald-600" />
                                Tra cứu QR Code Web
                                <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteTargetId(contract.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa hợp đồng
                            </DropdownMenuItem>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hợp đồng?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa hợp đồng khỏi hệ thống quản lý. Bạn có chắc chắn muốn tiếp tục không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTargetId) {
                  onDelete(deleteTargetId)
                  setDeleteTargetId(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
