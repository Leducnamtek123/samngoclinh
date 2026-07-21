import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class IdentityVerificationStatusResponseDto {
    @ApiProperty({
        required: true,
        example: 'pending',
        enum: ['pending', 'verified', 'rejected', 'unsubmitted'],
    })
    @Expose()
    status: string;

    @ApiProperty({
        required: true,
        example: ['cccd_front', 'cccd_back', 'face_video'],
    })
    @Expose()
    required: string[];

    @ApiProperty({
        required: false,
        example: 'Ảnh CCCD bị mờ, vui lòng chụp lại',
    })
    @Expose()
    rejectionReason?: string;
}
