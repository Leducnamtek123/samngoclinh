import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserConfirmEmailVerificationRequestDto {
    @ApiProperty({
        description: 'OTP code sent to the account email',
        required: true,
        example: '123456',
    })
    @IsString()
    @IsNotEmpty()
    @Length(4, 8)
    otp: string;
}
