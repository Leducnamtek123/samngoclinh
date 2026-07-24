import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SepayWebhookDto {
    @ApiProperty({
        required: true,
        example: 123456,
        description: 'ID giao dịch trên hệ thống SePay',
    })
    @IsNotEmpty()
    id: number | string;

    @ApiProperty({
        required: true,
        example: 'MBBank',
        description: 'Tên thương hiệu ngân hàng',
    })
    @IsNotEmpty()
    @IsString()
    gateway: string;

    @ApiProperty({
        required: false,
        example: '2024-07-24 15:30:00',
        description: 'Thời gian phát sinh giao dịch',
    })
    @IsOptional()
    @IsString()
    transactionDate?: string;

    @ApiProperty({
        required: true,
        example: '038100012345',
        description: 'Số tài khoản ngân hàng nhận',
    })
    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @ApiProperty({
        required: false,
        example: null,
        description: 'Mã thanh toán SePay nếu sử dụng',
    })
    @IsOptional()
    code?: string | null;

    @ApiProperty({
        required: false,
        example: 'ORD17218000001234 Thanh toan don hang',
        description: 'Nội dung chuyển khoản từ ngân hàng',
    })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({
        required: false,
        example: 'ORD17218000001234 Thanh toan don hang',
        description: 'Alias nội dung chuyển khoản',
    })
    @IsOptional()
    @IsString()
    transactionContent?: string;

    @ApiProperty({
        required: false,
        example: 'in',
        description: 'Loại giao dịch: in (tiền vào) hoặc out (tiền ra)',
    })
    @IsOptional()
    @IsString()
    transferType?: string;

    @ApiProperty({
        required: false,
        example: 500000,
        description: 'Số tiền chuyển',
    })
    @IsOptional()
    transferAmount?: number;

    @ApiProperty({
        required: false,
        example: 500000,
        description: 'Số tiền vào',
    })
    @IsOptional()
    amountIn?: number;

    @ApiProperty({
        required: false,
        example: 0,
        description: 'Số tiền ra',
    })
    @IsOptional()
    amountOut?: number;

    @ApiProperty({
        required: false,
        example: 10500000,
        description: 'Số dư tích lũy sau giao dịch',
    })
    @IsOptional()
    accumulated?: number;

    @ApiProperty({
        required: false,
        example: 'FT24206849503',
        description: 'Mã tham chiếu ngân hàng',
    })
    @IsOptional()
    @IsString()
    referenceCode?: string;

    @ApiProperty({
        required: false,
        example: 'Thanh toan don hang ORD17218000001234',
        description: 'Mô tả chi tiết',
    })
    @IsOptional()
    @IsString()
    description?: string;
}
