import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { OrdersListResponseDto } from '@modules/orders/dtos/response/orders.list.response.dto';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';

export interface IOrdersService {
    list(userId: string): Promise<IResponseReturn<{ items: OrdersListResponseDto[] }>>;
    detail(id: string, userId: string): Promise<IResponseReturn<OrdersDetailResponseDto>>;
}
