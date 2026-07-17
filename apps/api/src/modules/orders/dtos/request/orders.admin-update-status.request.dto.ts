import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class OrdersAdminUpdateStatusRequestDto {
    @ApiProperty({
        required: true,
        example: 'shipping',
        description: 'New status for the order',
        enum: ['pending', 'paid', 'shipping', 'completed', 'cancelled', 'refunded'],
    })
    @IsNotEmpty()
    @IsString()
    @IsIn(['pending', 'paid', 'shipping', 'completed', 'cancelled', 'refunded'])
    status: string;
}
