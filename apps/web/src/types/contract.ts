export type ContractStatus =
  | 'draft'
  | 'pending_signature'
  | 'pending'
  | 'signed'
  | 'expired'
  | 'cancelled'
  | string;

export type EContractItem = {
  id?: string;
  treeCode: string;
  treeName: string;
  ageYearAtSign: number;
  gardenCode?: string | null;
  bedCode?: string | null;
  unitPrice?: number;
};

export type EContractData = {
  id: string;
  code: string;
  userId?: string;
  userName?: string;
  userIdentityNumber?: string;
  customerIdentity?: string;
  userAddress?: string;
  userPhone?: string;
  userEmail?: string;
  user?: {
    id?: string;
    name?: string;
    fullName?: string;
    email?: string;
    mobileNumbers?: { number: string }[];
  } | null;
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
};
