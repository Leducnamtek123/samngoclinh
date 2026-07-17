import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CarePackageCreateRequestDto {
    @ApiProperty({ required: true, example: 'care-gold' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ required: true, example: 'Gói chăm sóc Vàng' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: true, example: 500000 })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ required: false, example: 'Bón phân hữu cơ và tưới nước thông minh định kỳ' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: true, example: 12, description: 'Duration of care package in months' })
    @IsNotEmpty()
    @IsNumber()
    durationMonths: number;
}

export class CarePackageUpdateRequestDto {
    @ApiProperty({ required: false, example: 'Gói chăm sóc Vàng (Cập nhật)' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false, example: 550000 })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ required: false, example: 'Bón phân hữu cơ và tưới nước nâng cao' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false, example: 12 })
    @IsOptional()
    @IsNumber()
    durationMonths?: number;

    @ApiProperty({ required: false, example: 'active', enum: ['active', 'inactive'] })
    @IsOptional()
    @IsString()
    status?: string;
}

export class ProtectionPackageCreateRequestDto {
    @ApiProperty({ required: true, example: 'prot-standard' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ required: true, example: 'Gói bảo hiểm Tiêu chuẩn' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: true, example: 300000 })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ required: false, example: 'Bảo vệ sâm khỏi các rủi ro thời tiết' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false, example: 'Đền bù 100% giá trị cây sâm nếu gặp thiên tai bão lũ' })
    @IsOptional()
    @IsString()
    coverage?: string;
}

export class ProtectionPackageUpdateRequestDto {
    @ApiProperty({ required: false, example: 'Gói bảo hiểm Tiêu chuẩn (Cập nhật)' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false, example: 350000 })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ required: false, example: 'Bảo vệ sâm nâng cao' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false, example: 'Đền bù tối đa 200% nếu có sự cố nông trại' })
    @IsOptional()
    @IsString()
    coverage?: string;

    @ApiProperty({ required: false, example: 'active', enum: ['active', 'inactive'] })
    @IsOptional()
    @IsString()
    status?: string;
}

export class PackageSubscribeRequestDto {
    @ApiProperty({ required: true, example: 'tree-01' })
    @IsNotEmpty()
    @IsString()
    treeCode: string;

    @ApiProperty({ required: true, example: 'care-gold' })
    @IsNotEmpty()
    @IsString()
    packageCode: string;

    @ApiProperty({ required: true, example: 'care', enum: ['care', 'protection'] })
    @IsNotEmpty()
    @IsEnum(['care', 'protection'])
    type: 'care' | 'protection';
}
