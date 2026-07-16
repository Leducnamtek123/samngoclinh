import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BackofficeOverviewResponseDto {
    @ApiProperty({
        required: true,
        example: ['catalog', 'content', 'promotion', 'marketplace', 'wallet', 'orders', 'cultivation'],
    })
    @Expose()
    domains: string[];

    @ApiProperty({
        required: true,
        example: 10,
    })
    @Expose()
    totalPendingApprovals: number;

    @ApiProperty({
        required: true,
        example: 1,
    })
    @Expose()
    totalActiveProviders: number;

    @ApiProperty({
        required: true,
        example: 8,
    })
    @Expose()
    totalArticles: number;
}
