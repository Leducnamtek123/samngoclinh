import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CultivationUpdateBookingStatusRequestDto {
    @ApiProperty({
        required: true,
        example: 'approved',
        enum: ['approved', 'rejected'],
    })
    @IsNotEmpty()
    @IsString()
    @IsIn(['approved', 'rejected'])
    status: string;

    @ApiProperty({
        required: false,
        example: 'Lịch hẹn đã được xác nhận, vui lòng mang theo CCCD khi đi thăm vườn.',
    })
    @IsOptional()
    @IsString()
    adminNote?: string;
}
