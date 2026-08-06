import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CartItemDetailResponseDto {
    @ApiProperty({
        required: true,
        example: '65f123456789abcdef012345',
    })
    @Expose()
    productId: string;

    @ApiProperty({
        required: true,
        example: 'Cây Sâm Ngọc Linh 3 năm tuổi',
    })
    @Expose()
    productName: string;

    @ApiProperty({
        required: true,
        example: 1200000,
    })
    @Expose()
    price: number;

    @ApiProperty({
        required: true,
        example: 2,
    })
    @Expose()
    quantity: number;

    @ApiProperty({
        required: true,
        example: 2400000,
    })
    @Expose()
    totalPrice: number;

    @ApiProperty({
        required: false,
        example: 'https://vismarttech.com/logo.png',
    })
    @Expose()
    imageUrl?: string;

    @ApiProperty({
        required: false,
        example: 108,
    })
    @Expose()
    stock?: number;

    @ApiProperty({
        required: false,
        example: 'beverage',
    })
    @Expose()
    category?: string;

    @ApiProperty({
        required: false,
        type: [String],
        example: ['/images/products/wine_root.png'],
    })
    @Expose()
    images?: string[];
}

export class CartSummaryResponseDto {
    @ApiProperty({
        required: true,
        example: 2,
    })
    @Expose()
    itemsCount: number;

    @ApiProperty({
        required: true,
        example: 2400000,
    })
    @Expose()
    total: number;

    @ApiProperty({
        required: true,
        example: false,
    })
    @Expose()
    empty: boolean;

    @ApiProperty({
        required: true,
        type: [CartItemDetailResponseDto],
    })
    @Expose()
    @Type(() => CartItemDetailResponseDto)
    items: CartItemDetailResponseDto[];
}
