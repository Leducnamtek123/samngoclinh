import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CultivationGardenResponseDto {
    @ApiProperty({
        required: true,
        example: 12,
    })
    @Expose()
    total: number;

    @ApiProperty({
        required: true,
        example: 129,
    })
    @Expose()
    activeBeds: number;
}
