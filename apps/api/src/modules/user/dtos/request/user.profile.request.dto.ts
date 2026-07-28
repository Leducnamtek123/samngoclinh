import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserCreateRequestDto } from '@modules/user/dtos/request/user.create.request.dto';
import { EnumUserGender } from '@generated/prisma-client';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AwsS3PresignRequestDto } from '@common/aws/dtos/request/aws.s3-presign.request.dto';

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
}

export class UserUpdateProfilePhotoRequestDto extends PickType(
    AwsS3PresignRequestDto,
    ['size']
) {
    @ApiProperty({
        required: true,
        description: 'photo path key',
        example: 'user/profile/unique-photo-key.jpg',
    })
    @IsString()
    @IsNotEmpty()
    photoKey: string;
}
