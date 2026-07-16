export interface IIdentityVerificationStatus {
    status: 'pending' | 'verified' | 'rejected' | 'unsubmitted';
    required: string[];
}

export interface IIdentityVerificationSubmitResult {
    accepted: boolean;
    code: string;
}
