import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WalletSummaryResponseDto {
    @ApiProperty({
        required: true,
        example: 1000000,
    })
    @Expose()
    balancePoint: number;

    @ApiProperty({
        required: true,
        example: 5,
    })
    @Expose()
    treesOwned: number;

    @ApiProperty({
        required: true,
        example: 10,
    })
    @Expose()
    transactions: number;
}
