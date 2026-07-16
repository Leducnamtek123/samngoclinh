import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { CartSummaryResponseDto } from '@modules/cart/dtos/response/cart.summary.response.dto';
import { CartAddItemRequestDto } from '@modules/cart/dtos/request/cart.add-item.request.dto';
import { CartUpdateItemRequestDto } from '@modules/cart/dtos/request/cart.update-item.request.dto';

export interface ICartService {
    summary(userId: string): Promise<IResponseReturn<CartSummaryResponseDto>>;
    addItem(
        userId: string,
        payload: CartAddItemRequestDto
    ): Promise<IResponseReturn<CartSummaryResponseDto>>;
    updateItem(
        userId: string,
        productId: string,
        payload: CartUpdateItemRequestDto
    ): Promise<IResponseReturn<CartSummaryResponseDto>>;
    removeItem(
        userId: string,
        productId: string
    ): Promise<IResponseReturn<CartSummaryResponseDto>>;
    clear(userId: string): Promise<IResponseReturn<CartSummaryResponseDto>>;
}
