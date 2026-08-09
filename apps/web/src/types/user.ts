import type { AddressItem } from './address';

export interface UserProfile {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  rank?: string;
  referralCode?: string;
  mobileNumber?: string;
  gender?: string;
  birthDate?: string;
  verified?: boolean;
  isVerified?: boolean;
  emailVerified?: boolean;
  isEmailVerified?: boolean;
  countryId?: string;
  country?: {
    id: string;
    phoneCode?: string[];
  };
  mobileNumbers?: Array<{
    id: string;
    number: string;
  }>;
  addresses?: AddressItem[];
}

export interface UserBusiness {
  id: string;
  phone?: string;
  companyName?: string;
}

export interface IdentityVerificationStatus {
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNSUBMITTED';
  rejectedReason?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}

export interface WalletSummary {
  totalTrees?: number;
  totalPoints?: number;
  balance?: number;
  pendingTrees?: number;
}

