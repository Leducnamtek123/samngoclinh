import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { IdentityVerificationStatusResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.status.response.dto';
import { IdentityVerificationSubmitRequestDto } from '@modules/identity-verification/dtos/request/identity-verification.submit.request.dto';
import { IdentityVerificationSubmitResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.submit.response.dto';

export interface IIdentityVerificationService {
    status(userId: string): Promise<IResponseReturn<IdentityVerificationStatusResponseDto>>;
    submit(userId: string, payload: IdentityVerificationSubmitRequestDto): Promise<IResponseReturn<IdentityVerificationSubmitResponseDto>>;
}
