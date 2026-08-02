import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CultivationPublicBedResponseDto {
    @ApiProperty({
        required: true,
        example: 'bed-01',
    })
    @Expose()
    code: string;

    @ApiProperty({
        required: true,
        example: 'Luống 11',
    })
    @Expose()
    name: string;

    @ApiProperty({
        required: true,
        example: 'garden-main',
    })
    @Expose()
    gardenCode: string;

    @ApiProperty({
        required: true,
        example: 'Noàng Sâm 2026 Số 1',
    })
    @Expose()
    gardenName: string;

    @ApiProperty({
        required: true,
        example: 1,
    })
    @Expose()
    ageYear: number;

    @ApiProperty({
        required: true,
        example: 54,
    })
    @Expose()
    treeCount: number;

    @ApiProperty({
        required: true,
        example: 91140,
    })
    @Expose()
    price: number;

    @ApiProperty({
        required: true,
        type: [String],
        example: ['/images/kon_tum_ginseng.png'],
    })
    @Expose()
    images: string[];

    @ApiProperty({
        required: true,
        example: 'active',
    })
    @Expose()
    status: string;
}
