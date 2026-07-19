import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsArray, IsDateString, Min } from 'class-validator';

export class CultivationCreateTreeRequestDto {
    @ApiProperty({
        required: false,
        example: 'bed-01',
        description: 'Code of the bed where trees are planted',
    })
    @IsOptional()
    @IsString()
    bedCode?: string;

    @ApiProperty({
        required: true,
        example: 'Sâm Ngọc Linh Kon Tum',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        required: true,
        example: 3,
        description: 'Age in years',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    ageYear: number;

    @ApiProperty({
        required: true,
        example: 10,
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({
        required: false,
        example: { health: 'Tốt' },
    })
    @IsOptional()
    metadata?: Record<string, unknown>;

    @ApiProperty({ required: false, example: '2026-07-19T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    plantedAt?: string;

    @ApiProperty({ required: false, example: 'healthy' })
    @IsOptional()
    @IsString()
    healthStatus?: string;

    @ApiProperty({ required: false, example: '2026-07-19T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    lastCareDate?: string;

    @ApiProperty({ required: false, example: '2026-07-26T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    nextCareDate?: string;

    @ApiProperty({ required: false, example: '2031-07-19T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    expectedHarvestAt?: string;

    @ApiProperty({ required: false, example: ['https://example.com/tree.jpg'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiProperty({ required: false, example: 5000000 })
    @IsOptional()
    @IsInt()
    @Min(0)
    priceBought?: number;

    @ApiProperty({ required: false, example: 'user-uuid-123' })
    @IsOptional()
    @IsString()
    ownerUserId?: string;
}
