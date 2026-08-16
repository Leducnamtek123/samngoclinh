import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateIf,
    ValidateNested,
} from 'class-validator';

export class CartCheckoutItemDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export class OrdersUserCheckoutRequestDto {
    @IsOptional()
    @IsBoolean()
    usePoints?: boolean;

    @IsNotEmpty()
    @IsString()
    customerName: string;

    @IsNotEmpty()
    @IsString()
    customerPhone: string;

    @IsOptional()
    @IsString()
    customerEmail?: string;

    @IsIn(['pickup', 'shipping'])
    deliveryType: string;

    @ValidateIf(o => o.deliveryType === 'shipping')
    @IsNotEmpty()
    @IsString()
    shippingAddress?: string;

    @IsIn(['online', 'cod'])
    paymentMethod: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartCheckoutItemDto)
    items?: CartCheckoutItemDto[];

    @IsOptional()
    @IsString()
    identityNumber?: string;

    @IsOptional()
    @IsString()
    signatureData?: string;

    @IsOptional()
    @IsString()
    legalName?: string;

    @IsOptional()
    metadata?: Record<string, any>;
}

