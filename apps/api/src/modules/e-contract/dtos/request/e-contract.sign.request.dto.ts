import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EContractSignRequestDto {
    @ApiProperty({
        required: true,
        example: 'data:image/png;base64,iVBORw0KGgo...',
        description: 'Base64 signature image or drawing signature',
    })
    @IsNotEmpty()
    @IsString()
    signatureData: string;

    @ApiProperty({
        required: false,
        example: '123456',
        description: 'OTP code for contract signature verification',
    })
    @IsOptional()
    @IsString()
    otpCode?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
