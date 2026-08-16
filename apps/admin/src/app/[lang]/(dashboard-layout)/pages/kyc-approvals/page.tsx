"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { RefreshCw, UserCheck } from "lucide-react"
import { useParams } from "next/navigation"

import { useApiMutation } from "@/hooks/use-api-mutation"
import { useApiQuery } from "@/hooks/use-api-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleGuard } from "@/components/guards/rbac-guard"
import viKyc from "@/data/dictionaries/vi/kyc.json"
import enKyc from "@/data/dictionaries/en/kyc.json"
import { KycTable, type KYCRequest } from "./_components/kyc-table"
import { KycDetailsDialog } from "./_components/kyc-details-dialog"

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

const formatDateLocale = (dateStr?: string, lang: string = "vi") => {
  if (!dateStr) return "—"
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return "—"
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return lang === "en" ? `${month}/${day}/${year}` : `${day}/${month}/${year}`
  } catch {
    return "—"
  }
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
  } = useApiQuery<KYCRequest[] | { items?: KYCRequest[]; data?: KYCRequest[] }>(
    ["kyc-approvals", page, perPage],
    `/admin/user/kyc-list?page=${page}&limit=${perPage}`
  )

  const mutation = useApiMutation()

  const rawData = response?.data
  const kycList: KYCRequest[] = Array.isArray(rawData)
    ? rawData
    : (rawData as { items?: KYCRequest[]; data?: KYCRequest[] })?.items ||
      (rawData as { items?: KYCRequest[]; data?: KYCRequest[] })?.data ||
      []
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : dict.notifications.approveError
      toast.error(message)
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectReason) {
      toast.error(dict.notifications.requireReason)
    } else {
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
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : dict.notifications.rejectError
        toast.error(message)
      }
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {dict.loadingList}
        </div>
      )
    }
    if (isError) {
      return (
        <div className="py-8 text-center text-sm text-destructive">
          {lang === "en"
            ? "Unable to connect to server. Please try again later."
            : "Không thể kết nối đến hệ thống máy chủ. Vui lòng thử lại sau."}
        </div>
      )
    }
    if (kycList.length === 0) {
      return (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {dict.emptyList}
        </div>
      )
    }
    return (
      <KycTable
        kycList={kycList}
        metadata={metadata}
        onPageChange={(p) => setPage(p)}
        onReview={(kyc) => {
          setSelectedKyc(kyc)
          setShowRejectForm(false)
        }}
        dict={dict}
        lang={lang}
        formatDateLocale={formatDateLocale}
      />
    )
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
            {renderContent()}
          </CardContent>
        </Card>

        {selectedKyc && (
          <KycDetailsDialog
            selectedKyc={selectedKyc}
            onClose={() => setSelectedKyc(null)}
            dict={dict}
            lang={lang}
            showRejectForm={showRejectForm}
            setShowRejectForm={setShowRejectForm}
            rejectReason={rejectReason}
            setRejectReason={setRejectReason}
            onApprove={handleApprove}
            onReject={handleReject}
            getFullImageUrl={getFullImageUrl}
          />
        )}
      </div>
    </RoleGuard>
  )
}
