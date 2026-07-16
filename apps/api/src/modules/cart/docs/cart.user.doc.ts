import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { CartSummaryResponseDto } from '@modules/cart/dtos/response/cart.summary.response.dto';
import { CartAddItemRequestDto } from '@modules/cart/dtos/request/cart.add-item.request.dto';
import { CartUpdateItemRequestDto } from '@modules/cart/dtos/request/cart.update-item.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function CartUserSummaryDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get user shopping cart summary',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cart.summary', {
            dto: CartSummaryResponseDto,
        })
    );
}

export function CartUserAddItemDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Add item to user shopping cart',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: CartAddItemRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cart.addItem', {
            dto: CartSummaryResponseDto,
        })
    );
}

export function CartUserUpdateItemDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update item quantity in shopping cart',
        }),
        DocRequest({
            params: [
                {
                    name: 'productId',
                    description: 'Product Catalog ID',
                    required: true,
                    type: 'string',
                },
            ],
            bodyType: EnumDocRequestBodyType.json,
            dto: CartUpdateItemRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cart.updateItem', {
            dto: CartSummaryResponseDto,
        })
    );
}

export function CartUserRemoveItemDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Remove item from shopping cart',
        }),
        DocRequest({
            params: [
                {
                    name: 'productId',
                    description: 'Product Catalog ID',
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
        DocResponse('cart.removeItem', {
            dto: CartSummaryResponseDto,
        })
    );
}

export function CartUserClearDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Clear all items from shopping cart',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cart.clear', {
            dto: CartSummaryResponseDto,
        })
    );
}
