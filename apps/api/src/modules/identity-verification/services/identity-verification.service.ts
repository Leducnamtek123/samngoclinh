import { Injectable } from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { IIdentityVerificationService } from '@modules/identity-verification/interfaces/identity-verification.service.interface';
import { IdentityVerificationRepository } from '@modules/identity-verification/repositories/identity-verification.repository';
import { IdentityVerificationSubmitRequestDto } from '@modules/identity-verification/dtos/request/identity-verification.submit.request.dto';
import { IdentityVerificationStatusResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.status.response.dto';
import { IdentityVerificationSubmitResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.submit.response.dto';

@Injectable()
export class IdentityVerificationService implements IIdentityVerificationService {
    constructor(
        private readonly identityVerificationRepository: IdentityVerificationRepository
    ) {}

    async status(userId: string): Promise<IResponseReturn<IdentityVerificationStatusResponseDto>> {
        const latest = await this.identityVerificationRepository.getLatestRequest(userId);

        return {
            data: {
                status: latest ? (latest.status as 'pending' | 'verified' | 'rejected') : 'unsubmitted',
                required: ['cccd_front', 'cccd_back', 'face_video'],
            },
        };
    }

    async submit(
        userId: string,
        payload: IdentityVerificationSubmitRequestDto
    ): Promise<IResponseReturn<IdentityVerificationSubmitResponseDto>> {
        const request = await this.identityVerificationRepository.createRequest(userId, payload);

        return {
            data: {
                accepted: true,
                code: request.code,
            },
        };
    }
}
