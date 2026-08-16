import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CultivationPurchaseLineResponseDto {
    @ApiProperty({ required: true, example: 5 })
    @Expose()
    ageYear: number;

    @ApiProperty({ required: true, example: 149 })
    @Expose()
    treeCount: number;

    @ApiProperty({ required: true, example: 5058281 })
    @Expose()
    pricePerTree: number;

    @ApiProperty({ required: true, example: 753683869 })
    @Expose()
    lineTotal: number;
}

export class CultivationPurchaseSplitResponseDto {
    @ApiProperty({ required: true, example: 1 })
    @Expose()
    index: number;

    @ApiProperty({ required: true, example: 91 })
    @Expose()
    treeCount: number;

    @ApiProperty({ required: true, example: 497133910 })
    @Expose()
    amount: number;
}

export class CultivationPurchaseScopeResponseDto {
    @ApiProperty({ required: true, example: 'all' })
    @Expose()
    key: string;

    @ApiProperty({ required: false, example: 'Luống 2' })
    @Expose()
    bedName: string | null;

    @ApiProperty({ required: true, example: 'Noàng Sâm 2022.1' })
    @Expose()
    gardenName: string;

    @ApiProperty({ required: true, example: 149 })
    @Expose()
    treeCount: number;

    @ApiProperty({ required: true, type: [CultivationPurchaseLineResponseDto] })
    @Expose()
    @Type(() => CultivationPurchaseLineResponseDto)
    lines: CultivationPurchaseLineResponseDto[];

    @ApiProperty({ required: true, example: 753683869 })
    @Expose()
    subtotal: number;

    @ApiProperty({ required: true, example: 60294709 })
    @Expose()
    vat: number;

    @ApiProperty({ required: true, example: 813978578 })
    @Expose()
    total: number;

    @ApiProperty({ required: true, type: [CultivationPurchaseSplitResponseDto] })
    @Expose()
    @Type(() => CultivationPurchaseSplitResponseDto)
    split: CultivationPurchaseSplitResponseDto[];
}

export class CultivationPurchaseGardenResponseDto {
    @ApiProperty({ required: true, example: 'garden-main' })
    @Expose()
    code: string;

    @ApiProperty({ required: true, example: 'Noàng Sâm 2022.1' })
    @Expose()
    name: string;
}

export class CultivationPurchaseResponseDto {
    @ApiProperty({ required: true, type: CultivationPurchaseGardenResponseDto })
    @Expose()
    @Type(() => CultivationPurchaseGardenResponseDto)
    garden: CultivationPurchaseGardenResponseDto;

    @ApiProperty({ required: true, type: [CultivationPurchaseScopeResponseDto] })
    @Expose()
    @Type(() => CultivationPurchaseScopeResponseDto)
    scopes: CultivationPurchaseScopeResponseDto[];
}
