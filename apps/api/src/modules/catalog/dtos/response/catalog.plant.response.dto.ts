import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CatalogPlantResponseDto {
    @ApiProperty({
        required: true,
        example: 'plant-1y',
    })
    @Expose()
    id: string;

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
}
