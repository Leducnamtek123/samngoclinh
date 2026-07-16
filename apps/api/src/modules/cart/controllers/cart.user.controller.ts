import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { CartService } from '@modules/cart/services/cart.service';
import { CartUserSummaryDoc } from '@modules/cart/docs/cart.user.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { CartSummaryResponseDto } from '@modules/cart/dtos/response/cart.summary.response.dto';

@ApiTags('modules.user.cart')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/cart',
})
export class CartUserController {
    constructor(private readonly cartService: CartService) {}

    @CartUserSummaryDoc()
    @Response('cart.summary')
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async summary(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<CartSummaryResponseDto>> {
        return this.cartService.summary(userId);
    }
}
