import { Controller, Get, Param, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { OrdersService } from '@modules/orders/services/orders.service';
import {
    OrdersUserDetailDoc,
    OrdersUserListDoc,
} from '@modules/orders/docs/orders.user.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { OrdersListResponseDto } from '@modules/orders/dtos/response/orders.list.response.dto';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';

@ApiTags('modules.user.orders')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/orders',
})
export class OrdersUserController {
    constructor(private readonly ordersService: OrdersService) {}

    @OrdersUserListDoc()
    @Response('orders.list')
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async list(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<{ items: OrdersListResponseDto[] }>> {
        return this.ordersService.list(userId);
    }

    @OrdersUserDetailDoc()
    @Response('orders.detail')
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/:id')
    async detail(
        @Param('id') id: string,
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        return this.ordersService.detail(id, userId);
    }
}
