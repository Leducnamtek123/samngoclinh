import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

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
}
