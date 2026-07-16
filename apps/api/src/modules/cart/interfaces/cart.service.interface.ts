import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { CartSummaryResponseDto } from '@modules/cart/dtos/response/cart.summary.response.dto';

export interface ICartService {
    summary(userId: string): Promise<IResponseReturn<CartSummaryResponseDto>>;
}
