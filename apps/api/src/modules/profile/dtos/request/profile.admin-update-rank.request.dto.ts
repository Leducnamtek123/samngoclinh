import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileAdminUpdateRankRequestDto {
    @ApiProperty({
        required: true,
        example: 'Silver',
        description: 'New rank status for the distributor/CTV',
    })
    @IsNotEmpty()
    @IsString()
    rank: string;
}
