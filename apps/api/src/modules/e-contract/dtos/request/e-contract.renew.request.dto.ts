import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class EContractRenewRequestDto {
    @ApiProperty({
        required: true,
        example: 12,
        description: 'Number of months to extend/renew the contract',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    months: number;

    @ApiPropertyOptional({
        example: 'data:image/png;base64,...',
        description: 'Optional signature data to sign amendment immediately',
    })
    @IsOptional()
    @IsString()
    signatureData?: string;

    @ApiPropertyOptional({
        example: 1500000,
        description: 'Optional renewal care service fee',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    amendmentValue?: number;
}
