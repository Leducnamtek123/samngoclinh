import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CatalogProductResponseDto {
    @ApiProperty({
        required: true,
        example: 'product-wine-root',
    })
    @Expose()
    id: string;

    @ApiProperty({
        required: true,
        example: 'Rượu Sâm Ngọc Linh nguyên cây - nguyên củ',
    })
    @Expose()
    name: string;

    @ApiProperty({
        required: true,
        example: 7000000,
    })
    @Expose()
    price: number;

    @ApiProperty({
        required: true,
        example: 'chai',
    })
    @Expose()
    unit: string;

    @ApiProperty({
        required: true,
        example: 'beverage',
    })
    @Expose()
    category: string;
}
