import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { OrdersListResponseDto } from '@modules/orders/dtos/response/orders.list.response.dto';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';
import { OrdersAdminUpdateStatusRequestDto } from '@modules/orders/dtos/request/orders.admin-update-status.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function OrdersAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List all orders in the system',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('orders.list', {
            dto: OrdersListResponseDto,
        })
    );
}

export function OrdersAdminDetailDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get details of any order',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Order ID',
                    required: true,
                    type: 'string',
                },
            ],
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('orders.detail', {
            dto: OrdersDetailResponseDto,
        })
    );
}

export function OrdersAdminUpdateStatusDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update status of an order',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Order ID',
                    required: true,
                    type: 'string',
                },
            ],
            bodyType: EnumDocRequestBodyType.json,
            dto: OrdersAdminUpdateStatusRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('orders.detail', {
            dto: OrdersDetailResponseDto,
        })
    );
}
