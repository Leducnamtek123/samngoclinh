import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginSendOtpRequestDto {
    @ApiProperty({
        description: 'Phone number to send OTP to',
        required: true,
        example: '0847234234',
    })
    @IsString()
    @IsNotEmpty()
    phone: string;
}
