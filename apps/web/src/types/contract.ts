export interface EContractData {
  id: string;
  code?: string;
  contractNumber?: string;
  title?: string;
  status: 'DRAFT' | 'PENDING_SIGNATURE' | 'SIGNED' | 'EXPIRED' | string;
  value?: number;
  totalAmount?: number;
  pdfUrl?: string;
  signedAt?: string;
  createdAt?: string;
}
