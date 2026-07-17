import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class WalletAdminAdjustRequestDto {
    @ApiProperty({
        required: true,
        example: '65239a58cbfab8e8334bcdef',
        description: 'Target User ID to adjust points',
    })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({
        required: true,
        example: 50,
        description: 'Amount of points to increment (positive) or decrement (negative)',
    })
    @IsNotEmpty()
    @IsInt()
    amount: number;

    @ApiProperty({
        required: true,
        example: 'Thưởng chiến dịch CTV xuất sắc tháng 7',
        description: 'Reason / Title for the transaction log',
    })
    @IsNotEmpty()
    @IsString()
    title: string;
}
