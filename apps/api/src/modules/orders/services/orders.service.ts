import { Injectable, NotFoundException } from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { IOrdersService } from '@modules/orders/interfaces/orders.service.interface';
import { OrdersRepository } from '@modules/orders/repositories/orders.repository';
import { OrdersListResponseDto } from '@modules/orders/dtos/response/orders.list.response.dto';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';

@Injectable()
export class OrdersService implements IOrdersService {
    constructor(private readonly ordersRepository: OrdersRepository) {}

    async list(userId: string): Promise<IResponseReturn<{ items: OrdersListResponseDto[] }>> {
        const items = await this.ordersRepository.getList(userId);

        return {
            data: {
                items,
            },
        };
    }

    async detail(id: string, userId: string): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        const order = await this.ordersRepository.getDetail(id, userId);

        if (!order) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'order.error.notFound',
            });
        }

        return {
            data: order,
        };
    }
}
