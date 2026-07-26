import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CultivationCreateBedRequestDto {
    @ApiProperty({
        required: true,
        example: 'garden-main',
        description: 'Code of the parent garden',
    })
    @IsNotEmpty()
    @IsString()
    gardenCode: string;

    @ApiProperty({
        required: true,
        example: 'Luống Sâm 01',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        required: true,
        example: 3,
        description: 'Age in years of the plant batch inside the bed',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    ageYear: number;

    @ApiProperty({
        required: true,
        example: 50,
        description: 'Total number of trees inside this bed',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    treeCount: number;

    @ApiProperty({
        required: false,
        example: { soilType: 'Red Basalt' },
    })
    @IsOptional()
    metadata?: Record<string, unknown>;

    @ApiProperty({ required: false, example: 100 })
    @IsOptional()
    @IsInt()
    @Min(0)
    maxTrees?: number;

    @ApiProperty({ required: false, example: 1.2 })
    @IsOptional()
    @IsNumber()
    width?: number;

    @ApiProperty({ required: false, example: 10.5 })
    @IsOptional()
    @IsNumber()
    length?: number;

    @ApiProperty({ required: false, example: 'Đất đỏ Ba Gian' })
    @IsOptional()
    @IsString()
    soilType?: string;

    @ApiProperty({ required: false, example: '2026-07-19T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    lastFertilizedAt?: string;

    @ApiProperty({ required: false, example: '2026-07-19T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    lastWateredAt?: string;

    @ApiProperty({ required: false, example: 'Luống gieo trồng sâm giống' })
    @IsOptional()
    @IsString()
    description?: string;
}
