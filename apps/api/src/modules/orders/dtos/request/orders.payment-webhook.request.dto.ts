import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

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
}
