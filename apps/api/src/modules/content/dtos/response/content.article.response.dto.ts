import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ContentArticleResponseDto {
    @ApiProperty({
        required: true,
        example: '60c72b2f9b1d8e001c3f5d5b',
    })
    @Expose()
    id: string;

    @ApiProperty({
        required: true,
        example: 'bao-chi-noi-ve-iwe-farm',
    })
    @Expose()
    slug: string;

    @ApiProperty({
        required: true,
        example: 'Báo chí nói gì về Sâm Ngọc Linh',
    })
    @Expose()
    title: string;

    @ApiProperty({
        required: true,
        example: 'news',
    })
    @Expose()
    category: string;

    @ApiProperty({
        required: true,
        example: new Date().toISOString(),
    })
    @Expose()
    publishedAt: string;

    @ApiProperty({
        required: true,
        example: 'Tổng hợp góc nhìn báo chí...',
    })
    @Expose()
    summary: string;

    @ApiProperty({
        required: false,
        example: 'https://image-url.com/image.jpg',
    })
    @Expose()
    image?: string;

    @ApiProperty({
        required: false,
        example: 'Sâm Ngọc Linh',
    })
    @Expose()
    author?: string;
}
