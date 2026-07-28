"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { CheckCircle2, Eye, RefreshCw, UserCheck, XCircle } from "lucide-react"

import { useApiMutation } from "@/hooks/use-api-mutation"
import { useApiQuery } from "@/hooks/use-api-query"
import { Pagination } from "@/components/ui/app-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { RoleGuard } from "@/components/guards/rbac-guard"

interface KYCRequest {
  id: string
  userId: string
  fullName?: string
  user?: {
    id: string
    email: string
    name?: string
  }
  idNumber?: string
  idType?: string
  idFrontUrl?: string
  idBackUrl?: string
  selfieUrl?: string
  frontImage?: string
  backImage?: string
  portraitImage?: string
  status: string
  createdAt?: string
  submittedAt?: string
}

export default function KycApprovalsPage() {
  const [selectedKyc, setSelectedKyc] = useState<KYCRequest | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 10

  const {
    data: response,
    isLoading,
    refetch,
    isError,
  } = useApiQuery<any>(
    ["kyc-approvals", page],
    `/admin/identity-verification?page=${page}&perPage=${perPage}`
  )

  const mutation = useApiMutation()

  const rawData = response?.data
  const kycList: KYCRequest[] = Array.isArray(rawData)
    ? rawData
    : (rawData as any)?.items || (rawData as any)?.data || []
  const metadata = response?.metadata || null

  const handleApprove = async (id: string) => {
    try {
      await mutation.mutateAsync({
        endpoint: `/admin/identity-verification/${id}/approve`,
        method: "PATCH",
      })
      toast.success("Phê duyệt eKYC thành công")
      setSelectedKyc(null)
      refetch()
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi phê duyệt eKYC")
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectReason) {
      toast.error("Vui lòng nhập lý do từ chối")
      return
    }
    try {
      await mutation.mutateAsync({
        endpoint: `/admin/identity-verification/${id}/reject`,
        data: { note: rejectReason },
        method: "PATCH",
      })
      toast.success("Đã từ chối hồ sơ eKYC")
      setSelectedKyc(null)
      setShowRejectForm(false)
      setRejectReason("")
      refetch()
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi từ chối eKYC")
    }
  }

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-emerald-600" />
              Duyệt Định danh eKYC Khách hàng & Nhà đầu tư
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Xác minh thông tin giấy tờ và chân dung nhà đầu tư Sâm Ngọc Linh
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Làm mới
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Danh sách Yêu cầu Duyệt eKYC
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Đang tải danh sách hồ sơ eKYC...
              </div>
            ) : isError ? (
              <div className="py-8 text-center text-sm text-destructive">
                Không thể kết nối đến hệ thống máy chủ. Vui lòng thử lại sau.
              </div>
            ) : kycList.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Chưa có yêu cầu duyệt eKYC nào đang chờ xử lý.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khách Hàng</TableHead>
                      <TableHead>Số Giấy Tờ (CCCD/CMND)</TableHead>
                      <TableHead>Ngày Gửi</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead className="text-right">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kycList.map((kyc) => (
                      <TableRow key={kyc.id}>
                        <TableCell className="font-medium">
                          {kyc.fullName ||
                            kyc.user?.name ||
                            kyc.user?.email ||
                            kyc.userId}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {kyc.idNumber || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {kyc.submittedAt || kyc.createdAt
                            ? new Date(
                                kyc.submittedAt || kyc.createdAt!
                              ).toLocaleDateString("vi-VN")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              kyc.status === "APPROVED"
                                ? "default"
                                : kyc.status === "PENDING"
                                  ? "outline"
                                  : "destructive"
                            }
                            className={
                              kyc.status === "APPROVED"
                                ? "bg-emerald-600 text-white"
                                : kyc.status === "PENDING"
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : ""
                            }
                          >
                            {kyc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                            onClick={() => {
                              setSelectedKyc(kyc)
                              setShowRejectForm(false)
                            }}
                          >
                            <Eye className="w-4 h-4" /> Xem Hồ Sơ
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination metadata={metadata} onPageChange={(p) => setPage(p)} />
              </>
            )}
          </CardContent>
        </Card>

        {selectedKyc && (
          <Dialog
            open={!!selectedKyc}
            onOpenChange={() => setSelectedKyc(null)}
          >
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>
                  Chi tiết Hồ sơ eKYC -{" "}
                  {selectedKyc.fullName ||
                    selectedKyc.user?.email ||
                    selectedKyc.id}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4">
                  <div>
                    <span className="text-muted-foreground">Khách hàng:</span>
                    <p className="font-semibold">
                      {selectedKyc.fullName || selectedKyc.user?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Số CCCD/CMND:</span>
                    <p className="font-semibold font-mono">
                      {selectedKyc.idNumber || "—"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Mặt trước CCCD
                    </span>
                    <img
                      src={
                        selectedKyc.idFrontUrl ||
                        selectedKyc.frontImage ||
                        "/images/placeholder.png"
                      }
                      alt="Mặt trước CCCD"
                      className="w-full h-32 object-cover rounded border bg-muted"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Mặt sau CCCD
                    </span>
                    <img
                      src={
                        selectedKyc.idBackUrl ||
                        selectedKyc.backImage ||
                        "/images/placeholder.png"
                      }
                      alt="Mặt sau CCCD"
                      className="w-full h-32 object-cover rounded border bg-muted"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Ảnh chân dung
                    </span>
                    <img
                      src={
                        selectedKyc.selfieUrl ||
                        selectedKyc.portraitImage ||
                        "/images/placeholder.png"
                      }
                      alt="Chân dung"
                      className="w-full h-32 object-cover rounded border bg-muted"
                    />
                  </div>
                </div>

                {showRejectForm ? (
                  <div className="space-y-3 pt-3 border-t">
                    <Textarea
                      placeholder="Nhập lý do từ chối hồ sơ eKYC này..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRejectForm(false)}
                      >
                        Hủy
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(selectedKyc.id)}
                      >
                        Xác nhận Từ chối
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 gap-1"
                      onClick={() => setShowRejectForm(true)}
                    >
                      <XCircle className="w-4 h-4" /> Từ chối Hồ sơ
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                      onClick={() => handleApprove(selectedKyc.id)}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Phê duyệt eKYC
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </RoleGuard>
  )
}
