import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MarketplaceListingResponseDto {
    @ApiProperty({
        required: true,
        example: 'listing-plant-3y',
    })
    @Expose()
    id: string;

    @ApiProperty({
        required: true,
        example: 'Cây Sâm Ngọc Linh 3 năm',
    })
    @Expose()
    title: string;

    @ApiProperty({
        required: true,
        example: 869355,
    })
    @Expose()
    price: number;

    @ApiProperty({
        required: true,
        example: 140,
    })
    @Expose()
    quantity: number;

    @ApiProperty({
        required: true,
        example: 'provider',
    })
    @Expose()
    ownerType: string;
}
