import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpsertBannerDto {
    @ApiProperty({
        required: true,
        example: 'products',
    })
    @IsString()
    @IsNotEmpty()
    pageKey: string;

    @ApiProperty({
        required: true,
        example: 'Trồng sâm giống',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        required: true,
        example: 'Trải nghiệm mô hình trồng sâm cùng Rượu Sâm Ngọc Linh',
    })
    @IsString()
    @IsNotEmpty()
    subtitle: string;

    @ApiProperty({
        required: true,
        example: '/assets/images/banner_bg.png',
    })
    @IsString()
    @IsNotEmpty()
    image: string;

    @ApiProperty({
        required: true,
        example: 0,
    })
    @IsNumber()
    order: number;
}
