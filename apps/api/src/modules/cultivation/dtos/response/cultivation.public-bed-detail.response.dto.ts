import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CultivationPublicCareLogDto {
    @ApiProperty({
        required: true,
        example: 'log-01',
    })
    @Expose()
    code: string;

    @ApiProperty({
        required: true,
        example: 'watering',
    })
    @Expose()
    action: string;

    @ApiProperty({
        required: true,
        example: 'Tưới nước định kỳ',
    })
    @Expose()
    title: string;

    @ApiProperty({
        required: false,
        example: 'Đã tưới nước và kiểm tra độ ẩm đất vào buổi sáng.',
    })
    @Expose()
    description: string | null;

    @ApiProperty({
        required: true,
        example: 'done',
    })
    @Expose()
    status: string;

    @ApiProperty({
        required: true,
        type: [String],
        example: [],
    })
    @Expose()
    images: string[];

    @ApiProperty({
        required: true,
        example: new Date(),
    })
    @Expose()
    loggedAt: Date;
}

export class CultivationPublicBedDetailResponseDto {
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
        example: 'active',
    })
    @Expose()
    status: string;

    @ApiProperty({
        required: true,
        example: 91140,
    })
    @Expose()
    price: number;

    @ApiProperty({
        required: false,
        example: new Date(),
    })
    @Expose()
    plantedAt: Date | null;

    @ApiProperty({
        required: false,
        example: 'healthy',
    })
    @Expose()
    healthStatus: string | null;

    @ApiProperty({
        required: true,
        type: [String],
        example: ['/images/kon_tum_ginseng.png'],
    })
    @Expose()
    images: string[];

    @ApiProperty({
        required: false,
        example: 'Cây sâm 1 năm dành cho người mới tham gia.',
    })
    @Expose()
    description: string | null;

    @ApiProperty({
        required: true,
        type: [CultivationPublicCareLogDto],
    })
    @Expose()
    @Type(() => CultivationPublicCareLogDto)
    careLogs: CultivationPublicCareLogDto[];
}
