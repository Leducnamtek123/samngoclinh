import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NotificationAdminSendRequestDto {
    @ApiProperty({
        required: true,
        example: 'all',
        description: 'Target User ID to send notification, or "all" to broadcast to everyone',
    })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({
        required: true,
        example: 'Thông báo bảo trì hệ thống',
        description: 'Notification title',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        required: true,
        example: 'Hệ thống sẽ bảo trì định kỳ từ 0h đến 2h sáng ngày mai.',
        description: 'Notification body content',
    })
    @IsNotEmpty()
    @IsString()
    body: string;

    @ApiProperty({
        required: false,
        example: 'normal',
        description: 'Priority of the notification: low, normal, or high',
    })
    @IsOptional()
    @IsString()
    priority?: string;
}
