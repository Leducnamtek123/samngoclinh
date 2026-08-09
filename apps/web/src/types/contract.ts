export interface EContractData {
  id: string;
  contractNumber: string;
  title: string;
  status: 'DRAFT' | 'PENDING_SIGNATURE' | 'SIGNED' | 'EXPIRED';
  pdfUrl?: string;
  signedAt?: string;
  createdAt: string;
}
