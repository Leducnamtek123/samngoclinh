import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SettingAdminUpdateRequestDto {
    @ApiProperty({
        required: true,
        example: '30000',
        description: 'Value of the configuration setting',
    })
    @IsNotEmpty()
    @IsString()
    value: string;
}
