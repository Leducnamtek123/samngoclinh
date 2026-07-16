import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CartAddItemRequestDto {
    @ApiProperty({
        required: true,
        example: '65f123456789abcdef012345',
        description: 'Product Catalog ID',
    })
    @IsNotEmpty()
    @IsString()
    productId: string;

    @ApiProperty({
        required: true,
        example: 1,
        description: 'Quantity to add',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;
}
