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
        example: 'Luống 01',
    })
    @Expose()
    name: string;

    @ApiProperty({
        required: true,
        example: 'active',
    })
    @Expose()
    status: string;
}
