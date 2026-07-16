import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProfileSummaryResponseDto {
    @ApiProperty({
        required: true,
        example: 'CÔNG TY CỔ PHẦN DƯỢC LIỆU TRÀ LINH',
    })
    @Expose()
    fullName: string;

    @ApiProperty({
        required: true,
        example: 'provider@mail.com',
    })
    @Expose()
    email: string;

    @ApiProperty({
        required: true,
        example: 'provider',
    })
    @Expose()
    role: string;

    @ApiProperty({
        required: true,
        example: '90N9DT',
    })
    @Expose()
    referralCode: string;

    @ApiProperty({
        required: true,
        example: 'Hạng Đồng',
    })
    @Expose()
    rank: string;

    @ApiProperty({
        required: true,
        example: true,
    })
    @Expose()
    verified: boolean;
}
