import type { AddressItem } from './address';

export type UserMobileNumber = {
  id?: string;
  number: string;
  phoneCode?: string;
  countryId?: string;
};

export type UserProfile = {
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
  mobileNumbers?: UserMobileNumber[];
  addresses?: AddressItem[];
};

export type UserBusiness = {
  id: string;
  phone?: string;
  companyName?: string;
};

export type IdentityVerificationStatus = {
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED' | 'UNSUBMITTED' | string;
  rejectedReason?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
};

export type WalletSummary = {
  totalTrees?: number;
  totalPoints?: number;
  balance?: number;
  pendingTrees?: number;
};
