"use client"

import React from "react"
import Image from "next/image"
import { CheckCircle2, PenTool, XCircle } from "lucide-react"

import type { KYCRequest } from "./kyc-table"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface KycDetailsDialogProps {
  selectedKyc: KYCRequest | null
  onClose: () => void
  dict: Record<string, any>
  lang: string
  showRejectForm: boolean
  setShowRejectForm: (show: boolean) => void
  rejectReason: string
  setRejectReason: (reason: string) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  getFullImageUrl: (url?: string) => string
}

export function KycDetailsDialog({
  selectedKyc,
  onClose,
  dict,
  lang,
  showRejectForm,
  setShowRejectForm,
  rejectReason,
  setRejectReason,
  onApprove,
  onReject,
  getFullImageUrl,
}: KycDetailsDialogProps) {
  if (!selectedKyc) return null

  const targetId = selectedKyc.id || selectedKyc.userId

  return (
    <Dialog open={!!selectedKyc} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {dict.modal.title} -{" "}
            {selectedKyc.fullName || selectedKyc.user?.email || selectedKyc.id}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-3 gap-3 text-sm border-b pb-4">
            <div>
              <span className="text-muted-foreground text-xs block">
                {dict.modal.fullName}
              </span>
              <p className="font-semibold text-sm">
                {selectedKyc.fullName || selectedKyc.user?.name || "—"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs block">
                {dict.modal.documentType ||
                  (lang === "en" ? "Document Type:" : "Loại giấy tờ:")}
              </span>
              <p className="font-semibold text-sm">
                {(selectedKyc.idType || selectedKyc.documentType) === "passport"
                  ? lang === "en"
                    ? "Passport"
                    : "Hộ chiếu"
                  : (selectedKyc.idType || selectedKyc.documentType) ===
                      "driver_license"
                    ? lang === "en"
                      ? "Driver's License"
                      : "Bằng lái xe"
                    : lang === "en"
                      ? "Citizen ID (CCCD)"
                      : "Căn cước công dân"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs block">
                {dict.modal.idNumber}
              </span>
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
                <div className="relative w-full h-40 rounded border bg-muted p-1">
                  <Image
                    src={
                      getFullImageUrl(
                        selectedKyc.idFrontUrl || selectedKyc.frontImage
                      ) || ""
                    }
                    alt={dict.modal.frontImage}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
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
                <div className="relative w-full h-40 rounded border bg-muted p-1">
                  <Image
                    src={
                      getFullImageUrl(
                        selectedKyc.idBackUrl || selectedKyc.backImage
                      ) || ""
                    }
                    alt={dict.modal.backImage}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs text-gray-400 font-medium">
                  {(selectedKyc.idType || selectedKyc.documentType) ===
                  "passport"
                    ? lang === "en"
                      ? "Passport Photo"
                      : "Ảnh Hộ Chiếu"
                    : lang === "en"
                      ? "Front Side"
                      : "Mặt Trước CCCD"}
                </div>
              )}
            </div>
          </div>

          {/* Digital Signature section */}
          <div className="space-y-1 pt-2 border-t">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-emerald-600" />
              {dict.modal.digitalSignature}
            </span>
            {getFullImageUrl(
              selectedKyc.signatureUrl ||
                selectedKyc.digitalSignatureUrl ||
                selectedKyc.digitalSignature
            ) ? (
              <div className="p-2 border rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-center">
                <Image
                  src={
                    getFullImageUrl(
                      selectedKyc.signatureUrl ||
                        selectedKyc.digitalSignatureUrl ||
                        selectedKyc.digitalSignature
                    ) || ""
                  }
                  alt={dict.modal.digitalSignature}
                  width={200}
                  height={100}
                  className="max-h-28 w-auto object-contain"
                  unoptimized
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
                  {Object.values(
                    (dict.modal?.presets || {}) as Record<string, string>
                  ).map((preset: string) => (
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
                  onClick={() => onReject(targetId)}
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
                onClick={() => onApprove(targetId)}
              >
                <CheckCircle2 className="w-4 h-4" /> {dict.actions.approve}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
