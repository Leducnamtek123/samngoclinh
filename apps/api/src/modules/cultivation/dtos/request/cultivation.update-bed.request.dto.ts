import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CultivationUpdateBedRequestDto {
    @ApiProperty({ required: false, example: 'Luống 1 (Cập nhật)' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false, example: 4 })
    @IsOptional()
    @IsNumber()
    ageYear?: number;

    @ApiProperty({ required: false, example: 100 })
    @IsOptional()
    @IsNumber()
    treeCount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
