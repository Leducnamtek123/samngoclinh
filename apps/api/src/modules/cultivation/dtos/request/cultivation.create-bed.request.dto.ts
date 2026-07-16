import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CultivationCreateBedRequestDto {
    @ApiProperty({
        required: true,
        example: 'garden-main',
        description: 'Code of the parent garden',
    })
    @IsNotEmpty()
    @IsString()
    gardenCode: string;

    @ApiProperty({
        required: true,
        example: 'Luống Sâm 01',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        required: true,
        example: 3,
        description: 'Age in years of the plant batch inside the bed',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    ageYear: number;

    @ApiProperty({
        required: true,
        example: 50,
        description: 'Total number of trees inside this bed',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    treeCount: number;

    @ApiProperty({
        required: false,
        example: { soilType: 'Red Basalt' },
    })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
