import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class MarketplaceCreateListingRequestDto {
    @ApiProperty({
        required: true,
        example: 'Đặc sản rượu sâm Ngọc Linh rừng',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        required: true,
        example: 'rượu_sâm',
        description: 'Category name',
    })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({
        required: true,
        example: 1500000,
        description: 'Price in VND',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    price: number;

    @ApiProperty({
        required: true,
        example: 10,
        description: 'Available quantity',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({
        required: false,
        example: { agingYears: 5, vol: '40%' },
        description: 'JSON metadata',
    })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
