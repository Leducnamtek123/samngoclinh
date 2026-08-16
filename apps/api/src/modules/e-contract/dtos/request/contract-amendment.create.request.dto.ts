import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ContractAmendmentCreateRequestDto {
    @ApiProperty({
        required: true,
        example: 12,
        description: 'Số tháng gia hạn dịch vụ chăm sóc',
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    extendedMonths: number;

    @ApiPropertyOptional({
        example: 1500000,
        description: 'Phí dịch vụ gia hạn chăm sóc (VNĐ)',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    amendmentValue?: number;

    @ApiPropertyOptional({
        example: 'Gia hạn dịch vụ chăm sóc năm thứ 3',
        description: 'Tiêu đề phụ lục',
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        example: 'Nội dung điều khoản bổ sung nếu có',
        description: 'Nội dung phụ lục',
    })
    @IsOptional()
    @IsString()
    content?: string;
}
