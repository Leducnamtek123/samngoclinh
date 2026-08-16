import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { OrdersListResponseDto } from '@modules/orders/dtos/response/orders.list.response.dto';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';
import { OrdersPaymentWebhookRequestDto } from '@modules/orders/dtos/request/orders.payment-webhook.request.dto';

import { OrdersUserCheckoutRequestDto } from '@modules/orders/dtos/request/orders.checkout.request.dto';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';
import { Prisma } from '@prisma/client';

export interface IOrdersService {
    list(
        userId: string
    ): Promise<IResponseReturn<{ items: OrdersListResponseDto[] }>>;
    userListPaginated(
        userId: string,
        pagination: IPaginationQueryOffsetParams<
            Prisma.OrderSelect,
            Prisma.OrderWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<OrdersListResponseDto>>;
    detail(
        id: string,
        userId: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>>;
    cancel(
        id: string,
        userId: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>>;
    checkout(
        userId: string,
        dto: OrdersUserCheckoutRequestDto
    ): Promise<IResponseReturn<OrdersDetailResponseDto>>;
    handlePaymentWebhook(
        payload: OrdersPaymentWebhookRequestDto
    ): Promise<IResponseReturn<OrdersDetailResponseDto>>;
    adminList(): Promise<IResponseReturn<{ items: OrdersListResponseDto[] }>>;
    adminListPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.OrderSelect,
            Prisma.OrderWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<OrdersListResponseDto>>;
    adminDetail(id: string): Promise<IResponseReturn<OrdersDetailResponseDto>>;
    adminUpdateStatus(
        id: string,
        status: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>>;
}

