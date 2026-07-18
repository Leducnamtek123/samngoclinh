import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CatalogPlantResponseDto {
    @ApiProperty({
        required: true,
        example: 'plant-id-123',
    })
    @Expose()
    id: string;

    @ApiProperty({
        required: false,
        example: 'plant-1y',
    })
    @Expose()
    code?: string;

    @ApiProperty({
        required: true,
        example: 'Cây Sâm Ngọc Linh 1 năm',
    })
    @Expose()
    name: string;

    @ApiProperty({
        required: true,
        example: 1,
    })
    @Expose()
    ageYear: number;

    @ApiProperty({
        required: true,
        example: 83942,
    })
    @Expose()
    price: number;

    @ApiProperty({
        required: true,
        example: 144,
    })
    @Expose()
    stock: number;

    @ApiProperty({
        required: true,
        example: 'available',
    })
    @Expose()
    status: string;

    @ApiProperty({
        required: false,
        example: 'Mô tả sâm ngọc linh',
    })
    @Expose()
    description?: string;

    @ApiProperty({
        required: false,
        example: ['/images/logo_ruou_sam.png'],
    })
    @Expose()
    images?: string[];
}
