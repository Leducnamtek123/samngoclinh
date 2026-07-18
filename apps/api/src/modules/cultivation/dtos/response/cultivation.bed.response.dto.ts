import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CultivationBedResponseDto {
    @ApiProperty({
        required: true,
        example: 'bed-1',
    })
    @Expose()
    id: string;

    @ApiProperty({
        required: true,
        example: 'bed-01',
    })
    @Expose()
    code: string;

    @ApiProperty({
        required: true,
        example: 'garden-main',
    })
    @Expose()
    gardenCode: string;

    @ApiProperty({
        required: true,
        example: 'Luống 01',
    })
    @Expose()
    name: string;

    @ApiProperty({
        required: true,
        example: 2,
    })
    @Expose()
    ageYear: number;

    @ApiProperty({
        required: true,
        example: 120,
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
        example: new Date(),
    })
    @Expose()
    createdAt: Date;
}
