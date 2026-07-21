import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrdersPaymentWebhookRequestDto {
    @ApiProperty({
        required: true,
        example: 'ORD1784128470037624',
        description: 'Unique order code',
    })
    @IsNotEmpty()
    @IsString()
    orderCode: string;

    @ApiProperty({
        required: true,
        example: 1230000,
        description: 'Amount paid in VND',
    })
    @IsNotEmpty()
    @IsInt()
    amount: number;

    @ApiProperty({
        required: true,
        example: 'SUCCESS',
        description: 'Status of payment (SUCCESS/FAILED)',
    })
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({
        required: true,
        example: 'vnpay_txn_123456',
        description: 'Gateway transaction reference code',
    })
    @IsNotEmpty()
    @IsString()
    gatewayRef: string;

    @ApiProperty({
        required: false,
        example: 'a6f9c94b7e8d2e1a3b5c7d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
        description: 'HMAC SHA256 signature for webhook authenticity verification',
    })
    @IsOptional()
    @IsString()
    signature?: string;
}
