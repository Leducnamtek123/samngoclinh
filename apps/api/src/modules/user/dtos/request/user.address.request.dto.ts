import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UserAddAddressRequestDto {
    @ApiProperty({
        example: faker.location.streetAddress(true),
        required: true,
        maxLength: 255,
        minLength: 1,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    detail: string;

    @ApiProperty({
        example: 'Home',
        required: false,
        maxLength: 100,
    })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    label?: string;

    @ApiProperty({
        example: faker.person.fullName(),
        required: false,
        maxLength: 100,
    })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    recipient?: string;

    @ApiProperty({
        example: `0${faker.string.fromCharacters('123456789', {
            min: 8,
            max: 9,
        })}`,
        required: false,
        maxLength: 20,
    })
    @IsString()
    @IsOptional()
    @MaxLength(20)
    phone?: string;

    @ApiProperty({
        example: false,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}
