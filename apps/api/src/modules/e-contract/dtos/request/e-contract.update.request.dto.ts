import { OmitType, PartialType } from '@nestjs/swagger';
import { EContractCreateRequestDto } from './e-contract.create.request.dto';

export class EContractUpdateRequestDto extends PartialType(
    OmitType(EContractCreateRequestDto, ['paymentStatus', 'userId'] as const)
) {}
