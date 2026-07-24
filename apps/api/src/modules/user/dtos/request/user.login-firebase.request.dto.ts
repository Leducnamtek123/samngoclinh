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

export class UserLoginFirebaseRequestDto {
    @ApiProperty({
        description: 'Firebase ID token obtained from client-side phone auth',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    idToken: string;

    @ApiProperty({
        description: 'from where the user is logging in',
        enum: EnumUserLoginFrom,
        example: EnumUserLoginFrom.mobile,
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
