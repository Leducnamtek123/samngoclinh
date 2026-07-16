import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PromotionFreeTreeItemDto {
    @ApiProperty({
        required: true,
        example: 'free-tree-2026',
    })
    @Expose()
    id: string;

    @ApiProperty({
        required: true,
        example: 'Tặng cây sâm 1 năm',
    })
    @Expose()
    plantName: string;

    @ApiProperty({
        required: true,
        example: 0,
    })
    @Expose()
    price: number;

    @ApiProperty({
        required: true,
        example: true,
    })
    @Expose()
    eligible: boolean;

    @ApiProperty({
        required: true,
        example: 24,
    })
    @Expose()
    remainingSlots: number;
}

export class PromotionFreeTreeResponseDto {
    @ApiProperty({
        required: true,
        type: [PromotionFreeTreeItemDto],
    })
    @Expose()
    @Type(() => PromotionFreeTreeItemDto)
    items: PromotionFreeTreeItemDto[];

    @ApiProperty({
        required: true,
        example: 'Cần gói chăm sóc và bảo vệ.',
    })
    @Expose()
    note: string;
}
