import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class MarketplaceAdminUpdateStatusRequestDto {
    @ApiProperty({
        required: true,
        example: 'active',
        description: 'New status for the marketplace listing',
        enum: ['pending_approval', 'active', 'rejected', 'sold', 'archived'],
    })
    @IsNotEmpty()
    @IsString()
    @IsIn(['pending_approval', 'active', 'rejected', 'sold', 'archived'])
    status: string;
}
