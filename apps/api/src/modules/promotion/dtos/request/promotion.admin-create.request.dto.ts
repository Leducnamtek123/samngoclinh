import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PromotionAdminCreateRequestDto {
    @ApiProperty({
        required: true,
        example: 'FREE_GINSENG_2026',
        description: 'Unique campaign code',
    })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({
        required: true,
        example: 'Chiến dịch tặng sâm Ngọc Linh giống',
        description: 'Campaign title',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        required: true,
        example: 'Chương trình ưu đãi nhận sâm giống miễn phí dành cho Đại lý mới',
        description: 'Campaign description',
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        required: false,
        example: 'Đại lý cần KYC để nhận sâm',
        description: 'Optional campaign note',
    })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({
        required: false,
        example: 'active',
        description: 'Campaign status (active or inactive)',
    })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({
        required: false,
        example: 'SAM_NGOC_LINH_5Y',
        description: 'Catalog Plant code associated with the campaign',
    })
    @IsOptional()
    @IsString()
    plantCode?: string;

    @ApiProperty({
        required: false,
        example: true,
        description: 'Whether distributor profile must be KYC verified',
    })
    @IsOptional()
    @IsBoolean()
    requiredVerified?: boolean;

    @ApiProperty({
        required: false,
        example: false,
        description: 'Whether distributor must have deposit balance',
    })
    @IsOptional()
    @IsBoolean()
    requiredDeposit?: boolean;

    @ApiProperty({
        required: false,
        example: 100,
        description: 'Total number of remaining slots for this campaign',
    })
    @IsOptional()
    @IsInt()
    remainingSlots?: number;
}
