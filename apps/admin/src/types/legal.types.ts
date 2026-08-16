export type KycStatus = "pending" | "approved" | "rejected"
export type ContractStatus = "draft" | "pending_signature" | "signed" | "expired" | "cancelled"
export type ContactStatus = "pending" | "processing" | "responded" | "closed"

export interface KycRequest {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  fullName: string
  idNumber: string
  idType?: string
  idIssueDate?: string
  idIssuePlace?: string
  frontImageUrl?: string
  backImageUrl?: string
  portraitImageUrl?: string
  status: KycStatus | string
  rejectionReason?: string
  verifiedAt?: string | null
  verifiedBy?: string | null
  createdAt: string
  updatedAt?: string
}

export interface ContractAmendment {
  id: string
  contractId: string
  amendmentNumber: string
  title: string
  reason?: string
  content?: string
  status: string
  previousExpiredAt?: string
  newExpiredAt?: string
  extendedMonths?: number
  amendmentValue?: number
  documentHash?: string
  createdAt: string
}

export interface EContract {
  id: string
  contractNumber?: string
  contractCode?: string
  code?: string
  title: string
  contractType?: string
  status: ContractStatus | string
  userId: string
  userName?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  signedAt?: string | null
  expiresAt?: string | null
  expiredAt?: string | null
  effectiveExpiredAt?: string | null
  contentHtml?: string
  content?: string
  pdfUrl?: string
  signatureUrl?: string
  treeCodes?: string[]
  treeCode?: string
  gardenCode?: string
  totalValue?: number
  contractValue?: number
  paymentStatus?: string
  isReminderSent?: boolean
  reminderSentAt?: string
  terms?: string
  items?: Array<{ treeCode?: string; treeName?: string; price?: number; quantity?: number }>
  partyA?: string
  partyB?: string | {
    name?: string
    phone?: string
    idNumber?: string
    address?: string
    email?: string
    cccd?: string
  }
  metadata?: Record<string, unknown>
  amendments?: ContractAmendment[]
  signatures?: Array<Record<string, unknown>>
  hash?: string
  createdAt: string
  updatedAt?: string
}

export interface ContractTemplate {
  id: string
  code: string
  title: string
  version: string
  description?: string
  templateContent?: string
  variables?: string[]
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ContactRequest {
  id: string
  fullName: string
  email: string
  phone?: string
  phoneNumber?: string
  subject: string
  message: string
  status: ContactStatus | string
  isRead?: boolean
  responseNotes?: string
  respondedAt?: string | null
  respondedBy?: string | null
  createdAt: string
}
