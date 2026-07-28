import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class IdentityVerificationSubmitRequestDto {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    identityNumber?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    documentFiles?: string[];

    @IsString()
    @MinLength(1)
    frontImageUrl: string;

    @IsString()
    @MinLength(1)
    backImageUrl: string;
}
