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

export function OrdersUserListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get user order list',
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

export function OrdersUserDetailDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get user order detail by ID',
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
