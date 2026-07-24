import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserForgotPasswordRequestDto {
    @ApiProperty({
        description: 'Email hoặc số điện thoại của tài khoản',
        required: true,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => value.trim().toLowerCase())
    email: string;
}
