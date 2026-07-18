import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CatalogProductResponseDto {
    @ApiProperty({
        required: true,
        example: 'product-id-123',
    })
    @Expose()
    id: string;

    @ApiProperty({
        required: false,
        example: 'product-wine-root',
    })
    @Expose()
    code?: string;

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

    @ApiProperty({
        required: false,
        example: 100,
    })
    @Expose()
    stock?: number;

    @ApiProperty({
        required: false,
        example: 'active',
    })
    @Expose()
    status?: string;

    @ApiProperty({
        required: false,
        example: false,
    })
    @Expose()
    featured?: boolean;

    @ApiProperty({
        required: false,
        example: ['/images/logo_ruou_sam.png'],
    })
    @Expose()
    images?: string[];

    @ApiProperty({
        required: false,
        example: 'Mô tả rượu sâm ngọc linh',
    })
    @Expose()
    description?: string;
}
