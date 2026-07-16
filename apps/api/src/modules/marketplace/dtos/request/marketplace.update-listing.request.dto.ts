import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class MarketplaceUpdateListingRequestDto {
    @ApiProperty({
        required: false,
        example: 'Đặc sản rượu sâm Ngọc Linh rừng hảo hạng',
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        required: false,
        example: 1600000,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    price?: number;

    @ApiProperty({
        required: false,
        example: 15,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    quantity?: number;

    @ApiProperty({
        required: false,
        example: { agingYears: 5, vol: '42%' },
    })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
