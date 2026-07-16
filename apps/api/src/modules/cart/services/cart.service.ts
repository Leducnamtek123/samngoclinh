import { Injectable } from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ICartService } from '@modules/cart/interfaces/cart.service.interface';
import { CartSummaryResponseDto } from '@modules/cart/dtos/response/cart.summary.response.dto';

@Injectable()
export class CartService implements ICartService {
    async summary(_userId: string): Promise<IResponseReturn<CartSummaryResponseDto>> {
        return {
            data: {
                itemsCount: 0,
                total: 0,
                empty: true,
            },
        };
    }
}
