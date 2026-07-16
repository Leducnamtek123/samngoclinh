import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CultivationCreateGardenRequestDto {
    @ApiProperty({
        required: true,
        example: 'Vườn Sâm Ngọc Linh A1',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        required: false,
        example: { location: 'Quảng Nam', acreage: '500m2' },
    })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
