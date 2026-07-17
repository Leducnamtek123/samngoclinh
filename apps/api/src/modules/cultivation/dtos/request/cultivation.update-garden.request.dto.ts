import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CultivationUpdateGardenRequestDto {
    @ApiProperty({ required: false, example: 'Khu A (Cập nhật)' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
