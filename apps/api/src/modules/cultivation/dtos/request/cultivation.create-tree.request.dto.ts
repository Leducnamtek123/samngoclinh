import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CultivationCreateTreeRequestDto {
    @ApiProperty({
        required: false,
        example: 'bed-01',
        description: 'Code of the bed where trees are planted',
    })
    @IsOptional()
    @IsString()
    bedCode?: string;

    @ApiProperty({
        required: true,
        example: 'Sâm Ngọc Linh Kon Tum',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        required: true,
        example: 3,
        description: 'Age in years',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    ageYear: number;

    @ApiProperty({
        required: true,
        example: 10,
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({
        required: false,
        example: { status: 'healthy' },
    })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
