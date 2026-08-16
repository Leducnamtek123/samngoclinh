"use client"

import React from "react"
import { Eye } from "lucide-react"
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
import { Pagination } from "@/components/ui/app-pagination"

export interface KYCRequest {
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
  documentType?: string
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

import type { PaginationMeta } from "@/types"

interface KycTableProps {
  kycList: KYCRequest[]
  metadata: PaginationMeta | null
  onPageChange: (p: number) => void
  onReview: (kyc: KYCRequest) => void
  dict: Record<string, any>
  lang: string
  formatDateLocale: (dateStr?: string, lang?: string) => string
}

export function KycTable({
  kycList,
  metadata,
  onPageChange,
  onReview,
  dict,
  lang,
  formatDateLocale,
}: KycTableProps) {
  return (
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
            const docType = kyc.idType || kyc.documentType || "cccd"
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
                  {formatDateLocale(
                    kyc.submittedAt || kyc.createdAt,
                    lang
                  )}
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
                    onClick={() => onReview(kyc)}
                  >
                    <Eye className="w-4 h-4" /> {dict.actions.review}
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Pagination
        metadata={metadata}
        onPageChange={onPageChange}
      />
    </>
  )
}
