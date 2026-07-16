import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class IdentityVerificationSubmitResponseDto {
    @ApiProperty({
        required: true,
        example: true,
    })
    @Expose()
    accepted: boolean;

    @ApiProperty({
        required: true,
        example: 'kyc-xyz123',
    })
    @Expose()
    code: string;
}
