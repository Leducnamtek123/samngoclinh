import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { IdentityVerificationStatusResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.status.response.dto';
import { IdentityVerificationSubmitRequestDto } from '@modules/identity-verification/dtos/request/identity-verification.submit.request.dto';
import { IdentityVerificationSubmitResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.submit.response.dto';
import { IdentityVerificationRejectRequestDto } from '@modules/identity-verification/dtos/request/identity-verification.reject.request.dto';
import { IdentityVerificationRequest } from '@generated/prisma-client';

export interface IIdentityVerificationService {
    status(
        userId: string
    ): Promise<IResponseReturn<IdentityVerificationStatusResponseDto>>;
    submit(
        userId: string,
        payload: IdentityVerificationSubmitRequestDto
    ): Promise<IResponseReturn<IdentityVerificationSubmitResponseDto>>;
    adminListPending(): Promise<
        IResponseReturn<{ items: IdentityVerificationRequest[] }>
    >;
    adminApprove(id: string): Promise<IResponseReturn<{ success: boolean }>>;
    adminReject(
        id: string,
        payload: IdentityVerificationRejectRequestDto
    ): Promise<IResponseReturn<{ success: boolean }>>;
}
