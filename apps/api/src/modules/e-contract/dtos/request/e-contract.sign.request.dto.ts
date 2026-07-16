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
    })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
