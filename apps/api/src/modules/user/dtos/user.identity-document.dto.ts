import { DatabaseResponseDto } from '@common/database/dtos/response/database.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserIdentityDocumentResponseDto extends DatabaseResponseDto {
    @ApiProperty({ required: true })
    @Expose()
    userId: string;

    @ApiProperty({ required: true })
    @Expose()
    frontImageUrl: string;

    @ApiProperty({ required: true })
    @Expose()
    backImageUrl: string;

    @ApiProperty({ required: false, default: 'PENDING' })
    @Expose()
    status: string;

    @ApiProperty({ required: false })
    @Expose()
    rejectionReason?: string;

    @ApiProperty({ required: false })
    @Expose()
    idCardNumber?: string;

    @ApiProperty({ required: false })
    @Expose()
    fullName?: string;

    @ApiProperty({ required: false })
    @Expose()
    reviewedAt?: Date;

    @ApiProperty({ required: false })
    @Expose()
    reviewedBy?: string;
}

export class UserIdentityHistoryResponseDto extends DatabaseResponseDto {
    @ApiProperty({ required: true })
    @Expose()
    userId: string;

    @ApiProperty({ required: true })
    @Expose()
    frontImageUrl: string;

    @ApiProperty({ required: true })
    @Expose()
    backImageUrl: string;

    @ApiProperty({ required: true })
    @Expose()
    status: string;

    @ApiProperty({ required: false })
    @Expose()
    rejectionReason?: string;

    @ApiProperty({ required: false })
    @Expose()
    reviewedAt?: Date;

    @ApiProperty({ required: false })
    @Expose()
    reviewedBy?: string;
}
