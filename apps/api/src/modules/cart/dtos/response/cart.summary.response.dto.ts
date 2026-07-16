import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CartSummaryResponseDto {
    @ApiProperty({
        required: true,
        example: 0,
    })
    @Expose()
    itemsCount: number;

    @ApiProperty({
        required: true,
        example: 0,
    })
    @Expose()
    total: number;

    @ApiProperty({
        required: true,
        example: true,
    })
    @Expose()
    empty: boolean;
}
