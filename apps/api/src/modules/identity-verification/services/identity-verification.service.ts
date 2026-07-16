import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { IIdentityVerificationService } from '@modules/identity-verification/interfaces/identity-verification.service.interface';
import { IdentityVerificationRepository } from '@modules/identity-verification/repositories/identity-verification.repository';
import { IdentityVerificationSubmitRequestDto } from '@modules/identity-verification/dtos/request/identity-verification.submit.request.dto';
import { IdentityVerificationStatusResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.status.response.dto';
import { IdentityVerificationSubmitResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.submit.response.dto';
import { IdentityVerificationRejectRequestDto } from '@modules/identity-verification/dtos/request/identity-verification.reject.request.dto';
import { DatabaseService } from '@common/database/services/database.service';
import { IdentityVerificationRequest } from '@generated/prisma-client';

@Injectable()
export class IdentityVerificationService implements IIdentityVerificationService {
    constructor(
        private readonly identityVerificationRepository: IdentityVerificationRepository,
        private readonly databaseService: DatabaseService
    ) {}

    async status(
        userId: string
    ): Promise<IResponseReturn<IdentityVerificationStatusResponseDto>> {
        const latest =
            await this.identityVerificationRepository.getLatestRequest(userId);

        return {
            data: {
                status: latest
                    ? (latest.status as 'pending' | 'verified' | 'rejected')
                    : 'unsubmitted',
                required: ['cccd_front', 'cccd_back', 'face_video'],
            },
        };
    }

    async submit(
        userId: string,
        payload: IdentityVerificationSubmitRequestDto
    ): Promise<IResponseReturn<IdentityVerificationSubmitResponseDto>> {
        const request = await this.identityVerificationRepository.createRequest(
            userId,
            payload
        );

        return {
            data: {
                accepted: true,
                code: request.code,
            },
        };
    }

    async adminListPending(): Promise<
        IResponseReturn<{ items: IdentityVerificationRequest[] }>
    > {
        const items =
            await this.identityVerificationRepository.listPendingRequests();

        return {
            data: {
                items,
            },
        };
    }

    async adminApprove(
        id: string
    ): Promise<IResponseReturn<{ success: boolean }>> {
        const request =
            await this.identityVerificationRepository.getRequestById(id);

        if (!request) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'Identity verification request not found',
            });
        }

        if (request.status !== 'pending') {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Request is already processed',
            });
        }

        const providerRole = await this.databaseService.role.findFirst({
            where: { type: 'provider' },
        });

        if (!providerRole) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'Provider role not found',
            });
        }

        await this.databaseService.$transaction(async tx => {
            // 1. Update verification request status
            await tx.identityVerificationRequest.update({
                where: { id },
                data: {
                    status: 'verified',
                    reviewedAt: new Date(),
                },
            });

            // 2. Upgrade user's role to provider
            await tx.user.update({
                where: { id: request.userId },
                data: {
                    roleId: providerRole.id,
                },
            });

            // 3. Create a default business profile for the provider
            const referralCode =
                'REF' +
                Math.random().toString(36).substring(2, 8).toUpperCase();
            await tx.businessProfile.upsert({
                where: { userId: request.userId },
                create: {
                    userId: request.userId,
                    fullName: request.fullName,
                    referralCode,
                    rank: 'Bronze',
                    verified: true,
                },
                update: {
                    verified: true,
                    fullName: request.fullName,
                },
            });
        });

        return {
            data: {
                success: true,
            },
        };
    }

    async adminReject(
        id: string,
        payload: IdentityVerificationRejectRequestDto
    ): Promise<IResponseReturn<{ success: boolean }>> {
        const request =
            await this.identityVerificationRepository.getRequestById(id);

        if (!request) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'Identity verification request not found',
            });
        }

        if (request.status !== 'pending') {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Request is already processed',
            });
        }

        await this.identityVerificationRepository.updateStatus(
            id,
            'rejected',
            payload.note
        );

        return {
            data: {
                success: true,
            },
        };
    }
}
