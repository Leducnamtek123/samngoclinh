import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CartUpdateItemRequestDto {
    @ApiProperty({
        required: true,
        example: 2,
        description: 'New quantity of the product',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;
}
