import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CatalogPlantCreateDto {
    @ApiProperty({ required: true, example: 'plant-sam-5y' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ required: true, example: 'Sâm Ngọc Linh 5 năm tuổi' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: true, example: 5 })
    @IsNotEmpty()
    @IsNumber()
    ageYear: number;

    @ApiProperty({ required: true, example: 3500000 })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ required: true, example: 50 })
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @ApiProperty({ required: true, example: 'active' })
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({ required: false, type: [String], example: ['https://cdn.samngoclinh.com/image.jpg'] })
    @IsOptional()
    images?: string[];

    @ApiProperty({ required: false, example: 'Sâm Ngọc Linh trồng trọt tự nhiên' })
    @IsOptional()
    @IsString()
    description?: string;
}

export class CatalogPlantUpdateDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    ageYear?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    stock?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    images?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;
}

export class CatalogProductCreateDto {
    @ApiProperty({ required: true, example: 'prod-fertilizer' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ required: true, example: 'Phân bón hữu cơ sinh học' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: true, example: 'supplies' })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({ required: true, example: 'kg' })
    @IsNotEmpty()
    @IsString()
    unit: string;

    @ApiProperty({ required: true, example: 120000 })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ required: true, example: 200 })
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @ApiProperty({ required: true, example: 'active' })
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({ required: false, example: false })
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    images?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;
}

export class CatalogProductUpdateDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    unit?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    stock?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    images?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
