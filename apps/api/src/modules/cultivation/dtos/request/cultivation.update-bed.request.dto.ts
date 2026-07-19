import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CultivationCreateBedRequestDto } from './cultivation.create-bed.request.dto';

export class CultivationUpdateBedRequestDto extends PartialType(CultivationCreateBedRequestDto) {
    @ApiProperty({ required: false, example: 'active' })
    @IsOptional()
    @IsString()
    status?: string;
}
