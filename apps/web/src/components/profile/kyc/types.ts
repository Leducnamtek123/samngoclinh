export type IdentityDocumentType = 'cccd' | 'passport' | 'driver_license';

export type DocumentOption = {
  value: IdentityDocumentType;
  label: string;
  frontTitle: string;
  frontDescription: string;
  backTitle: string;
  backDescription: string;
  isBackRequired: boolean;
  notes: string[];
};

export type KycHistoryItem = {
  id?: string;
  documentType?: string;
  status?: string;
  createdAt?: string;
  idCardNumber?: string;
  rejectionReason?: string;
  adminNote?: string;
};

export type KycSubmissionData = {
  id?: string;
  status?: string;
  documentType?: IdentityDocumentType | string;
  idCardNumber?: string;
  fullName?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  rejectionReason?: string;
  adminNote?: string;
  verifiedAt?: string;
  createdAt?: string;
  [key: string]: unknown;
};
