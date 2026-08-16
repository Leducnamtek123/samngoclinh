"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import {
  CheckCircle2,
  Eye,
  PenTool,
  RefreshCw,
  UserCheck,
  XCircle,
} from "lucide-react"

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
import { useParams } from "next/navigation"
import viKyc from "@/data/dictionaries/vi/kyc.json"
import enKyc from "@/data/dictionaries/en/kyc.json"

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
  signatureUrl?: string
  digitalSignatureUrl?: string
  digitalSignature?: string
  status: string
  createdAt?: string
  submittedAt?: string
}

const getFullImageUrl = (url?: string) => {
  if (!url) return ""
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  )
    return url
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  ).replace(/\/api\/?$/, "")
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`
}

export default function KycApprovalsPage() {
  const params = useParams()
  const lang = (params?.lang || "vi") as string
  const dict = lang === "en" ? enKyc : viKyc

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
  } = useApiQuery<any>(["kyc-approvals"], `/admin/user/kyc-list`)

  const mutation = useApiMutation()

  const rawData = response?.data
  const kycList: KYCRequest[] = Array.isArray(rawData)
    ? rawData
    : (rawData as any)?.items || (rawData as any)?.data || []
  const metadata = response?.metadata || null

  const handleApprove = async (id: string) => {
    try {
      await mutation.mutateAsync({
        endpoint: `/admin/user/kyc/${id}/approve`,
        method: "POST",
      })
      toast.success(dict.notifications.approveSuccess)
      setSelectedKyc(null)
      refetch()
    } catch (error: any) {
      toast.error(error?.message || dict.notifications.approveError)
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectReason) {
      toast.error(dict.notifications.requireReason)
      return
    }
    try {
      await mutation.mutateAsync({
        endpoint: `/admin/user/kyc/${id}/reject`,
        data: { reason: rejectReason, note: rejectReason },
        method: "POST",
      })
      toast.success(dict.notifications.rejectSuccess)
      setSelectedKyc(null)
      setShowRejectForm(false)
      setRejectReason("")
      refetch()
    } catch (error: any) {
      toast.error(error?.message || dict.notifications.rejectError)
    }
  }

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-emerald-600" />
              {dict.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {dict.subtitle}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" /> {lang === "en" ? "Refresh" : "Làm mới"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {dict.requestListTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {dict.loadingList}
              </div>
            ) : isError ? (
              <div className="py-8 text-center text-sm text-destructive">
                {lang === "en"
                  ? "Unable to connect to server. Please try again later."
                  : "Không thể kết nối đến hệ thống máy chủ. Vui lòng thử lại sau."}
              </div>
            ) : kycList.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {dict.emptyList}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dict.columns.user}</TableHead>
                      <TableHead>{dict.columns.documentType || (lang === 'en' ? 'Document Type' : 'Loại giấy tờ')}</TableHead>
                      <TableHead>{dict.columns.idCardNumber}</TableHead>
                      <TableHead>{dict.columns.submitDate}</TableHead>
                      <TableHead>{dict.columns.status}</TableHead>
                      <TableHead className="text-right">{dict.columns.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kycList.map((kyc) => {
                      const docType = kyc.idType || (kyc as any).documentType || "cccd";
                      return (
                        <TableRow key={kyc.id}>
                          <TableCell className="font-medium">
                            {kyc.fullName ||
                              kyc.user?.name ||
                              kyc.user?.email ||
                              kyc.userId}
                          </TableCell>
                          <TableCell>
                            {docType === "passport" ? (
                              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-bold text-[11px]">
                                {lang === "en" ? "Passport" : "Hộ chiếu"}
                              </Badge>
                            ) : docType === "driver_license" ? (
                              <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 font-bold text-[11px]">
                                {lang === "en" ? "Driver's License" : "Bằng lái xe"}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[11px]">
                                {lang === "en" ? "Citizen ID" : "CCCD"}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs font-semibold">
                            {kyc.idNumber || "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {kyc.submittedAt || kyc.createdAt
                              ? new Date(
                                  kyc.submittedAt || kyc.createdAt!
                                ).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN")
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                kyc.status === "APPROVED" ? "default" : "outline"
                              }
                              className={
                                kyc.status === "APPROVED"
                                  ? "bg-emerald-600 text-white font-bold"
                                  : kyc.status === "REJECTED"
                                  ? "bg-rose-100 text-rose-800 border-rose-300 font-bold"
                                  : "bg-amber-100 text-amber-800 border-amber-300 font-bold"
                              }
                            >
                              {kyc.status === "APPROVED"
                                ? dict.status.approved
                                : kyc.status === "REJECTED"
                                ? dict.status.rejected
                                : dict.status.pending}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 font-bold cursor-pointer"
                              onClick={() => {
                                setSelectedKyc(kyc)
                                setShowRejectForm(false)
                              }}
                            >
                              <Eye className="w-4 h-4" /> {dict.actions.review}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <Pagination
                  metadata={metadata}
                  onPageChange={(p) => setPage(p)}
                />
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
                  {dict.modal.title} -{" "}
                  {selectedKyc.fullName ||
                    selectedKyc.user?.email ||
                    selectedKyc.id}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-3 text-sm border-b pb-4">
                  <div>
                    <span className="text-muted-foreground text-xs block">{dict.modal.fullName}</span>
                    <p className="font-semibold text-sm">
                      {selectedKyc.fullName || selectedKyc.user?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">{dict.modal.documentType || (lang === 'en' ? 'Document Type:' : 'Loại giấy tờ:')}</span>
                    <p className="font-semibold text-sm">
                      {(selectedKyc.idType || (selectedKyc as any).documentType) === "passport"
                        ? (lang === "en" ? "Passport" : "Hộ chiếu")
                        : (selectedKyc.idType || (selectedKyc as any).documentType) === "driver_license"
                        ? (lang === "en" ? "Driver's License" : "Bằng lái xe")
                        : (lang === "en" ? "Citizen ID (CCCD)" : "Căn cước công dân")}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">{dict.modal.idNumber}</span>
                    <p className="font-semibold font-mono text-sm">
                      {selectedKyc.idNumber || "—"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground block">
                      {dict.modal.frontImage}
                    </span>
                    {getFullImageUrl(
                      selectedKyc.idFrontUrl || selectedKyc.frontImage
                    ) ? (
                      <img
                        src={getFullImageUrl(
                          selectedKyc.idFrontUrl || selectedKyc.frontImage
                        )}
                        alt={dict.modal.frontImage}
                        className="w-full h-40 object-contain rounded border bg-muted p-1"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs text-gray-400 font-medium">
                        {lang === "en" ? "No photo" : "Chưa có ảnh"}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground block">
                      {dict.modal.backImage}
                    </span>
                    {getFullImageUrl(
                      selectedKyc.idBackUrl || selectedKyc.backImage
                    ) ? (
                      <img
                        src={getFullImageUrl(
                          selectedKyc.idBackUrl || selectedKyc.backImage
                        )}
                        alt={dict.modal.backImage}
                        className="w-full h-40 object-contain rounded border bg-muted p-1"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs text-gray-400 font-medium">
                        {(selectedKyc.idType || (selectedKyc as any).documentType) === "passport"
                          ? (lang === "en" ? "Not applicable" : "Không bắt buộc (Hộ chiếu)")
                          : (lang === "en" ? "No photo" : "Chưa có ảnh")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Digital Signature section */}
                <div className="space-y-1 pt-2 border-t">
                  <span className="text-xs font-medium text-muted-foreground block flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-emerald-600" />
                    {dict.modal.digitalSignature}
                  </span>
                  {getFullImageUrl(
                    selectedKyc.signatureUrl ||
                      selectedKyc.digitalSignatureUrl ||
                      selectedKyc.digitalSignature
                  ) ? (
                    <div className="p-2 border rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-center">
                      <img
                        src={getFullImageUrl(
                          selectedKyc.signatureUrl ||
                            selectedKyc.digitalSignatureUrl ||
                            selectedKyc.digitalSignature
                        )}
                        alt={dict.modal.digitalSignature}
                        className="max-h-28 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-20 bg-gray-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs text-gray-400 font-medium">
                      {dict.modal.noSignature}
                    </div>
                  )}
                </div>

                {showRejectForm ? (
                  <div className="space-y-3 pt-3 border-t">
                    <div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        {dict.modal.rejectReasonTitle}
                      </span>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {Object.values(dict.modal.presets).map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setRejectReason(preset)}
                            className="text-[11px] px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-rose-50 hover:text-rose-700 border border-gray-200 dark:border-gray-700 text-gray-600 transition-colors text-left font-medium cursor-pointer"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                      <Textarea
                        placeholder={dict.modal.rejectReasonPlaceholder}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRejectForm(false)}
                      >
                        {dict.actions.cancel}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleReject(selectedKyc.id || selectedKyc.userId)
                        }
                      >
                        {dict.actions.confirmReject}
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
                      <XCircle className="w-4 h-4" /> {dict.actions.reject}
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                      onClick={() =>
                        handleApprove(selectedKyc.id || selectedKyc.userId)
                      }
                    >
                      <CheckCircle2 className="w-4 h-4" /> {dict.actions.approve}
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
