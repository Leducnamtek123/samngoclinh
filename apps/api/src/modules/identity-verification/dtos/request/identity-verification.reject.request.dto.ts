import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class IdentityVerificationRejectRequestDto {
    @ApiProperty({
        required: false,
        example: 'Image is blurry or invalid',
        description: 'Reason for rejection',
    })
    @IsOptional()
    @IsString()
    note?: string;
}
