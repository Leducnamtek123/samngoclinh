import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OrdersDetailResponseDto {
    @ApiProperty({
        required: true,
        example: '60c72b2f9b1d8e001c3f5d5b',
    })
    @Expose()
    id: string;

    @ApiProperty({
        required: true,
        example: 'ORD1784128470037624',
    })
    @Expose()
    code: string;

    @ApiProperty({
        required: true,
        example: 'cancelled',
    })
    @Expose()
    status: string;

    @ApiProperty({
        required: true,
        example: 'VND',
    })
    @Expose()
    currency: string;

    @ApiProperty({
        required: true,
        example: 1162894,
    })
    @Expose()
    subtotal: number;

    @ApiProperty({
        required: true,
        example: 72822,
    })
    @Expose()
    shippingFee: number;

    @ApiProperty({
        required: true,
        example: 0,
    })
    @Expose()
    discount: number;

    @ApiProperty({
        required: true,
        example: 1235716,
    })
    @Expose()
    total: number;

    @ApiProperty({
        required: false,
        example: 'bank_transfer',
    })
    @Expose()
    paymentMethod: string | null;

    @ApiProperty({
        required: true,
        example: [{ code: 'plant-3y', name: 'Cây Sâm Ngọc Linh 3 năm', quantity: 1, price: 1162894 }],
    })
    @Expose()
    items: unknown;

    @ApiProperty({
        required: false,
        example: null,
    })
    @Expose()
    paidAt: Date | null;

    @ApiProperty({
        required: false,
        example: new Date(),
    })
    @Expose()
    cancelledAt: Date | null;

    @ApiProperty({
        required: true,
        example: new Date(),
    })
    @Expose()
    createdAt: Date;
}
