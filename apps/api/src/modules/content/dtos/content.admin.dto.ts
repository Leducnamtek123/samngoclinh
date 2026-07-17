import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ContentArticleCreateDto {
    @ApiProperty({ required: true, example: 'tin-tuc-sam-ngoc-linh-2026' })
    @IsNotEmpty()
    @IsString()
    slug: string;

    @ApiProperty({ required: true, example: 'Bản tin sâm Ngọc Linh năm 2026' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ required: true, example: 'news' })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({ required: true, example: 'Tóm tắt các hoạt động trồng và thu hoạch sâm...' })
    @IsNotEmpty()
    @IsString()
    summary: string;

    @ApiProperty({ required: false, example: 'Chi tiết nội dung bài viết về sâm Ngọc Linh...' })
    @IsOptional()
    @IsString()
    body?: string;

    @ApiProperty({ required: true, example: 'published' })
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({ required: false, example: 0 })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;

    @ApiProperty({ required: false, example: 'https://cdn.samngoclinh.com/cover.jpg' })
    @IsOptional()
    @IsString()
    coverImage?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    metadata?: Record<string, unknown>;
}

export class ContentArticleUpdateDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    summary?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    body?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    coverImage?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
