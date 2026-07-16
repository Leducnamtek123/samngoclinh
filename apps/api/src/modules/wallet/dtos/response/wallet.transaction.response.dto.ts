import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WalletTransactionResponseDto {
    @ApiProperty({
        required: true,
        example: '60c72b2f9b1d8e001c3f5d5b',
    })
    @Expose()
    id: string;

    @ApiProperty({
        required: true,
        example: 'txn-001',
    })
    @Expose()
    code: string;

    @ApiProperty({
        required: true,
        example: 'credit',
    })
    @Expose()
    type: string;

    @ApiProperty({
        required: true,
        example: 'Nạp điểm từ giao dịch thành công',
    })
    @Expose()
    title: string;

    @ApiProperty({
        required: true,
        example: 1000000,
    })
    @Expose()
    amount: number;

    @ApiProperty({
        required: false,
        example: 1000000,
    })
    @Expose()
    balanceAfter: number | null;

    @ApiProperty({
        required: true,
        example: 'success',
    })
    @Expose()
    status: string;

    @ApiProperty({
        required: true,
        example: new Date(),
    })
    @Expose()
    occurredAt: Date;
}
