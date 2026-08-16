import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserCreateRequestDto } from '@modules/user/dtos/request/user.create.request.dto';
import { EnumUserGender } from '@generated/prisma-client';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UserUpdateProfileRequestDto extends PickType(
    UserCreateRequestDto,
    ['name', 'countryId'] as const
) {
    @ApiProperty({
        required: true,
        enum: EnumUserGender,
        example: EnumUserGender.male,
    })
    @IsEnum(EnumUserGender)
    @IsNotEmpty()
    gender: EnumUserGender;

    @ApiProperty({
        required: false,
        example: '1990-01-01',
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    birthDate?: Date;

    @ApiProperty({
        required: false,
        example: '079090000123',
        description: 'Số CCCD (12 số) hoặc CMND (9 số)',
    })
    @IsOptional()
    @IsString()
    @Matches(/^\d{9}$|^\d{12}$/)
    identityNumber?: string;
}
