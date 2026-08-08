import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class SepayPgIpnOrderDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    order_id?: string;

    @IsOptional()
    @IsString()
    order_status?: string;

    @IsOptional()
    @IsString()
    order_amount?: string;

    @IsOptional()
    @IsString()
    order_currency?: string;

    @IsOptional()
    @IsString()
    order_invoice_number?: string;
}

export class SepayPgIpnTransactionDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    transaction_id?: string;

    @IsOptional()
    @IsString()
    transaction_status?: string;

    @IsOptional()
    @IsString()
    payment_method?: string;
}

export class SepayPgIpnDto {
    @IsOptional()
    @IsString()
    notification_type?: string;

    @IsOptional()
    timestamp?: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => SepayPgIpnOrderDto)
    order?: SepayPgIpnOrderDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => SepayPgIpnTransactionDto)
    transaction?: SepayPgIpnTransactionDto;
}
