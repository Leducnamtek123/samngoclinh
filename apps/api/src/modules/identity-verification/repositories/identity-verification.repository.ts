import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { IdentityVerificationSubmitRequestDto } from '@modules/identity-verification/dtos/request/identity-verification.submit.request.dto';
import { IdentityVerificationRequest } from '@generated/prisma-client';

@Injectable()
export class IdentityVerificationRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getLatestRequest(
        userId: string
    ): Promise<IdentityVerificationRequest | null> {
        return this.databaseService.identityVerificationRequest.findFirst({
            where: { userId },
            orderBy: { submittedAt: 'desc' },
        });
    }

    async createRequest(
        userId: string,
        payload: IdentityVerificationSubmitRequestDto
    ): Promise<IdentityVerificationRequest> {
        const code = 'kyc-' + Math.random().toString(36).substring(2, 11);
        return this.databaseService.identityVerificationRequest.create({
            data: {
                code,
                userId,
                fullName: payload.fullName,
                identityNumber: payload.identityNumber,
                status: 'pending',
                frontImageUrl: payload.frontImageUrl,
                backImageUrl: payload.backImageUrl,
                documentFiles: payload.documentFiles ?? [],
                note: null,
                metadata: {},
            },
        });
    }

    async listPendingRequests(): Promise<IdentityVerificationRequest[]> {
        return this.databaseService.identityVerificationRequest.findMany({
            where: { status: 'pending' },
            orderBy: { submittedAt: 'asc' },
        });
    }

    async getRequestById(
        id: string
    ): Promise<IdentityVerificationRequest | null> {
        return this.databaseService.identityVerificationRequest.findUnique({
            where: { id },
        });
    }

    async updateStatus(
        id: string,
        status: string,
        note?: string | null
    ): Promise<IdentityVerificationRequest> {
        return this.databaseService.identityVerificationRequest.update({
            where: { id },
            data: {
                status,
                note: note ?? null,
                reviewedAt: new Date(),
            },
        });
    }
}
