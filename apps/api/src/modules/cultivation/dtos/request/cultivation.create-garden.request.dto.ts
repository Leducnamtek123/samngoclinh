import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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

    @ApiProperty({ required: false, example: 'Kon Tum' })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({ required: false, example: 'Vườn sâm công nghệ cao' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false, example: 500.5 })
    @IsOptional()
    @IsNumber()
    area?: number;

    @ApiProperty({ required: false, example: ['https://example.com/image.jpg'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiProperty({ required: false, example: 14.1234 })
    @IsOptional()
    @IsNumber()
    latitude?: number;

    @ApiProperty({ required: false, example: 107.5678 })
    @IsOptional()
    @IsNumber()
    longitude?: number;

    @ApiProperty({ required: false, example: 'Nguyễn Văn A' })
    @IsOptional()
    @IsString()
    managerName?: string;

    @ApiProperty({ required: false, example: '0987654321' })
    @IsOptional()
    @IsString()
    managerPhone?: string;

    @ApiProperty({ required: false, example: '2026-07-19T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    establishedAt?: string;

    @ApiProperty({ required: false, example: 100 })
    @IsOptional()
    @IsNumber()
    maxBeds?: number;
}
