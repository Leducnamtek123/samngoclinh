export interface IProfileSummary {
    id: string;
    fullName: string;
    email: string;
    role: string;
    referralCode: string;
    rank: string;
    verified: boolean;
    avatarUrl?: string | null;
}
