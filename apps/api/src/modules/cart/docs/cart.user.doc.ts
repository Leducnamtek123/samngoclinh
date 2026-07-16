import {
    Doc,
    DocAuth,
    DocGuard,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { CartSummaryResponseDto } from '@modules/cart/dtos/response/cart.summary.response.dto';

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
