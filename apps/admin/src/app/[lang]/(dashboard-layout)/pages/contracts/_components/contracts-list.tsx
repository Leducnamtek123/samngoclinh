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
  Send,
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
  onIssue?: (id: string) => void
}

const formatVND = (value: number) => {
  return Number(value || 0).toLocaleString("vi-VN") + " đ"
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "draft":
    case "pending_issue":
      return (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 font-semibold gap-1 text-[11px]">
          <FileText className="w-3 h-3" /> Chờ BQL phát hành
        </Badge>
      )
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
          <Clock className="w-3 h-3" /> Chờ khách ký
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
  onIssue,
}: ContractsListProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

  return (
    <>
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent border-b border-border">
            <TableHead className="w-[220px] font-semibold text-xs text-muted-foreground">
              Mã HĐ & Tiêu đề
            </TableHead>
            <TableHead className="w-[200px] font-semibold text-xs text-muted-foreground">
              Khách hàng
            </TableHead>
            <TableHead className="w-[170px] font-semibold text-xs text-muted-foreground">
              Nguồn & Loại HĐ
            </TableHead>
            <TableHead className="w-[140px] font-semibold text-xs text-muted-foreground text-right">
              Giá trị hợp đồng
            </TableHead>
            <TableHead className="w-[130px] font-semibold text-xs text-muted-foreground text-center">
              Trạng thái
            </TableHead>
            <TableHead className="w-[110px] font-semibold text-xs text-muted-foreground">
              Thời hạn
            </TableHead>
            <TableHead className="w-[110px] font-semibold text-xs text-muted-foreground text-right">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-16 text-muted-foreground"
              >
                <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                  Không tìm thấy hợp đồng nào
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Thử điều chỉnh lại từ khóa tìm kiếm hoặc bộ lọc trạng thái.
                </p>
              </TableCell>
            </TableRow>
          ) : (
            contracts.map((contract) => {
              const userObj = users.find((u) => u.id === contract.userId)
              const isEkyc = Boolean(userObj?.isVerified)
              const meta = (contract.metadata || {}) as Record<string, unknown>
              const contractCode =
                contract.code ||
                contract.contractCode ||
                contract.contractNumber ||
                ""
              const orderCode =
                (meta.orderCode as string) ||
                (contractCode.startsWith("CTR-")
                  ? contractCode.replace("CTR-", "ORD-")
                  : null)
              const isOrderSource = Boolean(
                meta.orderId ||
                  meta.orderCode ||
                  contract.contractType === "purchase_and_care"
              )
              const webUrl =
                process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3002"
              const pdfDownloadUrl = `${apiUrl}/public/contracts/pdf?code=${encodeURIComponent(contractCode)}`
              const traceUrl = `${webUrl}/vi/trace/contract/${contractCode}`

              return (
                <TableRow
                  key={contract.id}
                  className="hover:bg-muted/30 transition-colors border-b border-border/50"
                >
                  {/* Contract Code & Title */}
                  <TableCell className="align-middle py-3">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/${lang}/pages/contracts/${contract.id}`}
                        className="font-mono text-xs font-bold text-primary hover:underline w-fit"
                      >
                        {contractCode}
                      </Link>
                      <span
                        className="text-xs font-medium text-foreground line-clamp-1"
                        title={contract.title}
                      >
                        {contract.title}
                      </span>
                    </div>
                  </TableCell>

                  {/* Customer */}
                  <TableCell className="align-middle py-3">
                    <div className="flex flex-col gap-0.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground truncate max-w-[150px]">
                          {userObj?.name ||
                            (typeof contract.partyB === "object"
                              ? contract.partyB?.name
                              : contract.partyB) ||
                            contract.customerName ||
                            "Khách hàng"}
                        </span>
                        {isEkyc && (
                          <span
                            className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-1 py-0.5 rounded border border-emerald-200 dark:border-emerald-800"
                            title="Đã xác thực eKYC CCCD"
                          >
                            <UserCheck className="w-3 h-3 mr-0.5" /> eKYC
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-[11px] truncate max-w-[170px]">
                        {userObj?.email || contract.customerEmail || "—"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Source & Contract Type */}
                  <TableCell className="align-middle py-3">
                    <div className="flex flex-col gap-1">
                      {isOrderSource ? (
                        <Badge
                          variant="outline"
                          className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800 text-[10px] font-medium w-max px-1.5 py-0"
                        >
                          Đơn #{orderCode || "Tự động"}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 text-[10px] font-medium w-max px-1.5 py-0"
                        >
                          Thủ công
                        </Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                        {getContractTypeLabel(contract.contractType)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Value & Payment */}
                  <TableCell className="align-middle py-3 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-bold text-xs text-foreground tabular-nums">
                        {formatVND(
                          contract.totalValue || contract.contractValue || 0
                        )}
                      </span>
                      <span
                        className={`text-[10px] font-medium ${
                          contract.paymentStatus === "paid"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {contract.paymentStatus === "paid"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="align-middle py-3 text-center">
                    {getStatusBadge(contract.status)}
                  </TableCell>

                  {/* Expiration */}
                  <TableCell className="align-middle py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(
                      contract.expiresAt ||
                        contract.expiredAt ||
                        contract.createdAt
                    ).toLocaleDateString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="align-middle py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {contract.status === "draft" && onIssue && (
                        <Button
                          size="sm"
                          onClick={() => onIssue(contract.id)}
                          className="h-8 px-2.5 text-xs gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" /> Phát hành
                        </Button>
                      )}

                      <Link href={`/${lang}/pages/contracts/${contract.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 text-xs gap-1 shadow-2xs hover:bg-accent"
                        >
                          <Eye className="w-3.5 h-3.5" /> Chi tiết
                        </Button>
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 text-xs shadow-md"
                        >
                          {contract.status !== "signed" && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/${lang}/pages/contracts/${contract.id}`}
                                className="text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-2 cursor-pointer"
                              >
                                <FileText className="w-4 h-4" />
                                Chỉnh sửa thông tin & HĐ
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {contract.status === "draft" && onIssue && (
                            <DropdownMenuItem
                              onClick={() => onIssue(contract.id)}
                              className="text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-2 cursor-pointer"
                            >
                              <Send className="w-4 h-4" />
                              Phát hành & Gửi khách
                            </DropdownMenuItem>
                          )}
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
