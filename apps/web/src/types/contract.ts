export type ContractStatus =
  | 'draft'
  | 'pending_signature'
  | 'pending'
  | 'signed'
  | 'expired'
  | 'cancelled'
  | string;

export interface EContractItem {
  id?: string;
  treeCode: string;
  treeName: string;
  ageYearAtSign: number;
  gardenCode?: string | null;
  bedCode?: string | null;
  unitPrice?: number;
}

export interface EContractData {
  id: string;
  code: string;
  userId?: string;
  orderId?: string | null;
  order?: { total?: number; totalAmount?: number; [key: string]: unknown } | null;
  title: string;
  content?: string;
  status: ContractStatus;
  contractValue?: number;
  totalAmount?: number;
  value?: number;
  paymentStatus?: string;
  signedAt?: string | null;
  expiredAt?: string;
  effectiveExpiredAt?: string;
  signatureUrl?: string | null;
  userSignatureUrl?: string | null;
  pdfUrl?: string | null;
  partyA?: string;
  partyB?: string;
  items?: EContractItem[];
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}


