import { DeviceRequestDto } from '@modules/device/dtos/requests/device.request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EnumUserLoginFrom } from '@generated/prisma-client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    IsString,
    ValidateNested,
} from 'class-validator';

export class UserLoginVerifyOtpRequestDto {
    @ApiProperty({
        description: 'Phone number to verify OTP for',
        required: true,
        example: '0847234234',
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        description: 'OTP code sent to the phone number',
        required: true,
        example: '123456',
    })
    @IsString()
    @IsNotEmpty()
    otp: string;

    @ApiProperty({
        description: 'from where the user is logging in',
        enum: EnumUserLoginFrom,
        example: EnumUserLoginFrom.website,
        required: true,
    })
    @IsNotEmpty()
    @IsEnum(EnumUserLoginFrom)
    from: EnumUserLoginFrom;

    @ApiProperty({
        description: 'Device information',
        required: true,
        type: DeviceRequestDto,
    })
    @Type(() => DeviceRequestDto)
    @IsNotEmpty()
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    device: DeviceRequestDto;
}
