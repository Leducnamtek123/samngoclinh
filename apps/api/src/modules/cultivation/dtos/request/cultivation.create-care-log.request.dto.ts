import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CultivationCreateCareLogRequestDto {
    @ApiProperty({
        required: false,
        example: 'bed-01',
        description: 'Optional bed code to link care history to a specific bed',
    })
    @IsOptional()
    @IsString()
    bedCode?: string;

    @ApiProperty({
        required: false,
        example: 'tree-01',
        description: 'Optional tree code to link care history to a specific tree batch',
    })
    @IsOptional()
    @IsString()
    treeCode?: string;

    @ApiProperty({
        required: true,
        example: 'watering',
        description: 'Type of care action, e.g. watering, fertilizing, weeding, growth_status',
    })
    @IsNotEmpty()
    @IsString()
    action: string;

    @ApiProperty({
        required: true,
        example: 'Tưới nước định kỳ',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        required: false,
        example: 'Đã tưới nước và kiểm tra độ ẩm đất vào buổi sáng.',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        required: true,
        example: 'good',
        description: 'Status of the plants, e.g. good, warning',
    })
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({
        required: false,
        example: ['https://example.com/photo.jpg'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}
