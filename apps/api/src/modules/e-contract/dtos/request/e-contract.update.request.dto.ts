import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class EContractUpdateRequestDto {
    @ApiProperty({
        required: false,
        example: 'Hợp đồng gia hạn sâm Trà My',
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        required: false,
        example: 'Nội dung điều khoản mới...',
    })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({
        required: false,
        example: 'signed',
        enum: ['pending', 'signed', 'expired', 'terminated'],
    })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({
        required: false,
        example: '2028-07-16T00:00:00.000Z',
    })
    @IsOptional()
    @IsDateString()
    expiredAt?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
