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
        example: 1235716,
    })
    @Expose()
    totalAmount?: number;

    @ApiProperty({
        required: false,
        example: 'Giao hàng tận nơi',
    })
    @Expose()
    shippingMethod?: string;

    @ApiProperty({
        required: false,
        example: 'bank_transfer',
    })
    @Expose()
    paymentMethod: string | null;

    @ApiProperty({
        required: false,
        example: 1152000,
    })
    @Expose()
    vat?: number;

    @ApiProperty({
        required: false,
        example: 'shipping',
    })
    @Expose()
    deliveryType?: string;

    @ApiProperty({
        required: false,
        example: '68 Nguyễn Huệ, Quận 1, TP.HCM',
    })
    @Expose()
    shippingAddress?: string | null;

    @ApiProperty({
        required: false,
        example: 'Nguyễn Văn A',
    })
    @Expose()
    customerName?: string | null;

    @ApiProperty({
        required: false,
        example: '0900000000',
    })
    @Expose()
    customerPhone?: string | null;

    @ApiProperty({
        required: false,
        example: 'khach@gmail.com',
    })
    @Expose()
    customerEmail?: string | null;

    @ApiProperty({
        required: true,
        example: [
            {
                code: 'plant-3y',
                name: 'Cây Sâm Ngọc Linh 3 năm',
                quantity: 1,
                price: 1162894,
            },
        ],
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

    @ApiProperty({
        required: false,
        example: {
            fullName: 'Nguyễn Văn A',
            email: 'user@mail.com',
            phone: '0847234234',
        },
    })
    @Expose()
    user?: {
        fullName: string;
        email: string;
        phone: string;
    };

    @ApiProperty({
        required: false,
        example: {
            qrUrl: 'https://qr.sepay.vn/img?acc=038100012345&bank=MBBank&amount=1235716&des=ORD1784128470037624&template=compact',
            accountNumber: '038100012345',
            accountName: 'CONG TY CP SAM NGOC LINH',
            bankBrand: 'MBBank',
            amount: 1235716,
            orderCode: 'ORD1784128470037624',
        },
    })
    @Expose()
    paymentQr?: {
        qrUrl: string;
        accountNumber?: string;
        accountName?: string;
        bankBrand?: string;
        amount: number;
        orderCode: string;
        redirectUrl?: string;
    };
}

