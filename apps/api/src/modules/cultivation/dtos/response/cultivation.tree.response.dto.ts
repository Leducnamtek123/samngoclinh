import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CultivationTreeResponseDto {
    @ApiProperty({
        required: true,
        example: 1,
    })
    @Expose()
    ageYear: number;

    @ApiProperty({
        required: true,
        example: 6454,
    })
    @Expose()
    count: number;
}
