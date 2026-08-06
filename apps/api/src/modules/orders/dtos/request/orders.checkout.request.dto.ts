import {
    IsBoolean,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf,
} from 'class-validator';

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
}
