import { IsBoolean, IsOptional } from 'class-validator';

export class OrdersUserCheckoutRequestDto {
    @IsOptional()
    @IsBoolean()
    usePoints?: boolean;
}
