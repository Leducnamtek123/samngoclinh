import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProviderDashboardOverviewResponseDto {
    @ApiProperty({
        required: true,
        example: 130,
    })
    @Expose()
    plantsOnHand: number;

    @ApiProperty({
        required: true,
        example: 10,
    })
    @Expose()
    pendingApprovals: number;

    @ApiProperty({
        required: true,
        example: 12,
    })
    @Expose()
    gardens: number;

    @ApiProperty({
        required: true,
        example: 129,
    })
    @Expose()
    beds: number;

    @ApiProperty({
        required: true,
        example: 91,
    })
    @Expose()
    relatedOrders: number;

    @ApiProperty({
        required: true,
        example: 5000000,
    })
    @Expose()
    revenue: number;
}
