import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EContractCreateRequestDto {
    @ApiProperty({
        required: true,
        example: '6523a123f123456789012345',
        description: 'ID of the customer signing the contract',
    })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({
        required: false,
        example: 'tree-01',
        description: 'Optional tree code linked to the contract',
    })
    @IsOptional()
    @IsString()
    treeCode?: string;

    @ApiProperty({
        required: true,
        example: 'Hợp đồng ký gửi chăm sóc sâm Ngọc Linh',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        required: true,
        example: 'Nội dung điều khoản hợp đồng...',
    })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({
        required: true,
        example: '2027-07-16T00:00:00.000Z',
    })
    @IsNotEmpty()
    @IsDateString()
    expiredAt: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    metadata?: Record<string, unknown>;
}
