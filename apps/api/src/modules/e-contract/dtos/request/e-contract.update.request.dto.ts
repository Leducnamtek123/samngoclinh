import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { EContractCreateRequestDto } from './e-contract.create.request.dto';

export class EContractUpdateRequestDto extends PartialType(EContractCreateRequestDto) {
    @ApiProperty({
        required: false,
        example: 'signed',
        enum: ['pending', 'signed', 'expired', 'terminated'],
    })
    @IsOptional()
    @IsString()
    status?: string;
}
