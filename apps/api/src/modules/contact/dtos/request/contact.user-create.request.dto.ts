import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ContactUserCreateRequestDto {
    @ApiProperty({
        required: true,
        example: 'Nguyễn Văn A',
        description: 'Sender full name',
    })
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @ApiProperty({
        required: true,
        example: 'nguyenvana@gmail.com',
        description: 'Sender email address',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        required: true,
        example: '0987654321',
        description: 'Sender phone number',
    })
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @ApiProperty({
        required: true,
        example: 'Yêu cầu tư vấn mua sâm Ngọc Linh',
        description: 'Message subject',
    })
    @IsNotEmpty()
    @IsString()
    subject: string;

    @ApiProperty({
        required: true,
        example: 'Tôi muốn tư vấn mua gói bảo hiểm sâm kiểng 5 năm cho đại lý mới.',
        description: 'Message content body',
    })
    @IsNotEmpty()
    @IsString()
    message: string;
}
