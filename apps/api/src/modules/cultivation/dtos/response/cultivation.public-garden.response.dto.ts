import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CultivationPublicGardenResponseDto {
    @ApiProperty({
        required: true,
        example: 'garden-main',
    })
    @Expose()
    code: string;

    @ApiProperty({
        required: true,
        example: 'Noàng Sâm 2026 Số 1',
    })
    @Expose()
    name: string;
}
