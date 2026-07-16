import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CultivationCreateBookingRequestDto {
    @ApiProperty({
        required: true,
        example: 'garden-01',
    })
    @IsNotEmpty()
    @IsString()
    gardenCode: string;

    @ApiProperty({
        required: true,
        example: '2026-08-01T09:00:00.000Z',
    })
    @IsNotEmpty()
    @IsDateString()
    visitDate: string;

    @ApiProperty({
        required: true,
        example: 2,
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    guestCount: number;

    @ApiProperty({
        required: true,
        example: '0901234567',
    })
    @IsNotEmpty()
    @IsString()
    contactPhone: string;
}
