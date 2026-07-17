import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class PromotionAdminUpdateRequestDto {
    @ApiProperty({
        required: false,
        example: 'Chiến dịch tặng sâm Ngọc Linh giống - Cập nhật',
        description: 'Campaign title',
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        required: false,
        example: 'Cập nhật điều kiện nhận sâm',
        description: 'Campaign description',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        required: false,
        example: 'Cần nạp cọc tối thiểu',
        description: 'Optional campaign note',
    })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({
        required: false,
        example: 'inactive',
        description: 'Campaign status',
    })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({
        required: false,
        example: 'SAM_NGOC_LINH_5Y',
        description: 'Catalog Plant code associated',
    })
    @IsOptional()
    @IsString()
    plantCode?: string;

    @ApiProperty({
        required: false,
        example: true,
        description: 'Whether KYC required',
    })
    @IsOptional()
    @IsBoolean()
    requiredVerified?: boolean;

    @ApiProperty({
        required: false,
        example: true,
        description: 'Whether deposit required',
    })
    @IsOptional()
    @IsBoolean()
    requiredDeposit?: boolean;

    @ApiProperty({
        required: false,
        example: 50,
        description: 'Remaining slots available',
    })
    @IsOptional()
    @IsInt()
    remainingSlots?: number;
}
