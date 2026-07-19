import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CultivationCreateTreeRequestDto } from './cultivation.create-tree.request.dto';

export class CultivationUpdateTreeRequestDto extends PartialType(CultivationCreateTreeRequestDto) {
    @ApiProperty({ required: false, example: 'active' })
    @IsOptional()
    @IsString()
    status?: string;
}
