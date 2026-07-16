import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    VERSION_NEUTRAL,
} from '@nestjs/common';
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
import {
    CartUserAddItemDoc,
    CartUserClearDoc,
    CartUserRemoveItemDoc,
    CartUserSummaryDoc,
    CartUserUpdateItemDoc,
} from '@modules/cart/docs/cart.user.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { CartSummaryResponseDto } from '@modules/cart/dtos/response/cart.summary.response.dto';
import { CartAddItemRequestDto } from '@modules/cart/dtos/request/cart.add-item.request.dto';
import { CartUpdateItemRequestDto } from '@modules/cart/dtos/request/cart.update-item.request.dto';

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

    @CartUserAddItemDoc()
    @Response('cart.addItem')
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/items')
    async addItem(
        @AuthJwtPayload('userId') userId: string,
        @Body() body: CartAddItemRequestDto
    ): Promise<IResponseReturn<CartSummaryResponseDto>> {
        return this.cartService.addItem(userId, body);
    }

    @CartUserUpdateItemDoc()
    @Response('cart.updateItem')
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/items/:productId')
    async updateItem(
        @AuthJwtPayload('userId') userId: string,
        @Param('productId') productId: string,
        @Body() body: CartUpdateItemRequestDto
    ): Promise<IResponseReturn<CartSummaryResponseDto>> {
        return this.cartService.updateItem(userId, productId, body);
    }

    @CartUserRemoveItemDoc()
    @Response('cart.removeItem')
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/items/:productId')
    async removeItem(
        @AuthJwtPayload('userId') userId: string,
        @Param('productId') productId: string
    ): Promise<IResponseReturn<CartSummaryResponseDto>> {
        return this.cartService.removeItem(userId, productId);
    }

    @CartUserClearDoc()
    @Response('cart.clear')
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/')
    async clear(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<CartSummaryResponseDto>> {
        return this.cartService.clear(userId);
    }
}
