import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ContractAmendmentSignRequestDto {
    @ApiProperty({
        required: true,
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        description: 'Chữ ký điện tử dạng Base64 PNG hoặc URL ảnh',
    })
    @IsNotEmpty()
    @IsString()
    signatureData: string;

    @ApiPropertyOptional({
        example: '123456',
        description: 'Mã xác thực OTP gửi qua SMS/Email',
    })
    @IsOptional()
    @IsString()
    otpCode?: string;
}
