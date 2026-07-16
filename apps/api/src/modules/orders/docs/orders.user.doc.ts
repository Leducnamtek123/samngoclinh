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
import { OrdersPaymentWebhookRequestDto } from '@modules/orders/dtos/request/orders.payment-webhook.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

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

export function OrdersUserCheckoutDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Checkout user shopping cart to create order',
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

export function OrdersUserPaymentWebhookDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Webhook callback to process order payment from gateway',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: OrdersPaymentWebhookRequestDto,
        }),
        DocResponse('orders.detail', {
            dto: OrdersDetailResponseDto,
        })
    );
}
