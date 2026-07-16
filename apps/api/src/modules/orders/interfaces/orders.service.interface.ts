import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { OrdersListResponseDto } from '@modules/orders/dtos/response/orders.list.response.dto';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';
import { OrdersPaymentWebhookRequestDto } from '@modules/orders/dtos/request/orders.payment-webhook.request.dto';

export interface IOrdersService {
    list(
        userId: string
    ): Promise<IResponseReturn<{ items: OrdersListResponseDto[] }>>;
    detail(
        id: string,
        userId: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>>;
    checkout(userId: string): Promise<IResponseReturn<OrdersDetailResponseDto>>;
    handlePaymentWebhook(
        payload: OrdersPaymentWebhookRequestDto
    ): Promise<IResponseReturn<OrdersDetailResponseDto>>;
}
