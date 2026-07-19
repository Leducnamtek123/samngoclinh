import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BackofficeOverviewResponseDto {
    @ApiProperty({
        required: true,
        example: [
            'catalog',
            'content',
            'promotion',
            'marketplace',
            'wallet',
            'orders',
            'cultivation',
        ],
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

    @ApiProperty({ required: true, example: 5 })
    @Expose()
    totalGardens: number;

    @ApiProperty({ required: true, example: 12 })
    @Expose()
    totalBeds: number;

    @ApiProperty({ required: true, example: 350 })
    @Expose()
    totalTrees: number;

    @ApiProperty({ required: true, example: 45 })
    @Expose()
    totalOrders: number;

    @ApiProperty({ required: true, example: 150000000 })
    @Expose()
    totalRevenue: number;

    @ApiProperty({ required: true, example: 20 })
    @Expose()
    totalContracts: number;

    @ApiProperty({ required: true, example: 15 })
    @Expose()
    totalSignedContracts: number;

    @ApiProperty({ required: true, example: 100 })
    @Expose()
    totalUsers: number;

    @ApiProperty({ required: false })
    @Expose()
    monthlyRevenue?: any[];

    @ApiProperty({ required: false })
    @Expose()
    trafficSources?: any[];

    @ApiProperty({ required: false })
    @Expose()
    newVsReturning?: any;

    @ApiProperty({ required: false })
    @Expose()
    visitorsByCountry?: any[];

    @ApiProperty({ required: false })
    @Expose()
    engagementByDevice?: any[];
}
