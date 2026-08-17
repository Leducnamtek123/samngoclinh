"use client"

import React from "react"

import type { AdminUser, EContract } from "@/types"

import { ContractDetailAmendmentsCard } from "./contract-detail-amendments-card"
import { ContractDetailPartiesCard } from "./contract-detail-parties-card"
import { ContractDetailTermsCard } from "./contract-detail-terms-card"
import { ContractDetailVerificationCard } from "./contract-detail-verification-card"

interface ContractDetailMetadataProps {
  contract: EContract
  user: AdminUser | null
  meta: Record<string, unknown>
  isEkyc: boolean
  isSigned: boolean
  isOrderSource: boolean
  apiUrl: string
  documentHash: string
  copiedHash: boolean
  onCopyHash: () => void
  formatVND: (val: number) => string
  formatDateVi: (dateStr?: string | Date) => string
}

export function ContractDetailMetadata({
  contract,
  user,
  meta,
  isEkyc,
  isSigned,
  isOrderSource,
  apiUrl,
  documentHash,
  copiedHash,
  onCopyHash,
  formatVND,
  formatDateVi,
}: ContractDetailMetadataProps) {
  return (
    <div className="space-y-6">
      <ContractDetailPartiesCard
        contract={contract}
        user={user}
        isEkyc={isEkyc}
      />

      <ContractDetailTermsCard
        contract={contract}
        meta={meta}
        formatVND={formatVND}
      />

      <ContractDetailAmendmentsCard
        contract={contract}
        apiUrl={apiUrl}
        formatVND={formatVND}
        formatDateVi={formatDateVi}
      />

      <ContractDetailVerificationCard
        contract={contract}
        meta={meta}
        isOrderSource={isOrderSource}
        isSigned={isSigned}
        documentHash={documentHash}
        copiedHash={copiedHash}
        onCopyHash={onCopyHash}
      />
    </div>
  )
}
