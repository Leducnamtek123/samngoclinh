import { DatabaseResponseDto } from '@common/database/dtos/response/database.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserIdentityDocumentResponseDto extends DatabaseResponseDto {
    @ApiProperty({ required: true })
    @Expose()
    frontImageUrl: string;

    @ApiProperty({ required: true })
    @Expose()
    backImageUrl: string;
}
