import { IFile } from '@common/file/interfaces/file.interface';
import { EnumMessageLanguage } from '@common/message/enums/message.enum';
import { TermPolicyAcceptRequestDto } from '@modules/term-policy/dtos/request/term-policy.accept.request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TermPolicyUploadContentRequestDto extends TermPolicyAcceptRequestDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Term policy content file',
    })
    file: IFile;

    @ApiProperty({
        required: true,
        description: 'Language of the term document',
        example: EnumMessageLanguage.en,
        enum: EnumMessageLanguage,
    })
    @IsString()
    @IsEnum(EnumMessageLanguage)
    @IsNotEmpty()
    readonly language: EnumMessageLanguage;

    @ApiProperty({
        description: 'Version of the terms policy',
        example: 1,
        required: true,
    })
    @Type(() => Number)
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    @IsNotEmpty()
    readonly version: number;
}
