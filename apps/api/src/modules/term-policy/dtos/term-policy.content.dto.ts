import { LocalStorageResponseDto } from '@common/file/dtos/file.local-storage.response.dto';
import { EnumMessageLanguage } from '@common/message/enums/message.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TermContentDto extends LocalStorageResponseDto {
    @ApiProperty({
        required: true,
        description: 'Language of the term document',
        example: EnumMessageLanguage.en,
        enum: EnumMessageLanguage,
    })
    @Expose()
    readonly language: EnumMessageLanguage;
}
