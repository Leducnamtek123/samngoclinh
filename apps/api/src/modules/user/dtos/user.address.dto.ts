import { DatabaseResponseDto } from '@common/database/dtos/response/database.response.dto';
import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserAddressResponseDto extends DatabaseResponseDto {
    @ApiProperty({
        example: 'Home',
        required: false,
        nullable: true,
    })
    @Expose()
    label: string | null;

    @ApiProperty({
        example: faker.person.fullName(),
        required: false,
        nullable: true,
    })
    @Expose()
    recipient: string | null;

    @ApiProperty({
        example: faker.phone.number(),
        required: false,
        nullable: true,
    })
    @Expose()
    phone: string | null;

    @ApiProperty({
        example: faker.location.streetAddress(true),
        required: true,
    })
    @Expose()
    detail: string;

    @ApiProperty({
        example: false,
        required: true,
    })
    @Expose()
    isDefault: boolean;
}
