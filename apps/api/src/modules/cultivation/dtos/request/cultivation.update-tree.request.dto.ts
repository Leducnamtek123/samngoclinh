import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CultivationUpdateTreeRequestDto {
    @ApiProperty({ required: false, example: 'Sâm Ngọc Linh 4 năm' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false, example: 4 })
    @IsOptional()
    @IsNumber()
    ageYear?: number;

    @ApiProperty({ required: false, example: 1 })
    @IsOptional()
    @IsNumber()
    quantity?: number;

    @ApiProperty({ required: false, example: 'active' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
