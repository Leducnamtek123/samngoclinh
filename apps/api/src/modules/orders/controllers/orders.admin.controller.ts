import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { OrdersService } from '@modules/orders/services/orders.service';
import {
    OrdersAdminDetailDoc,
    OrdersAdminListDoc,
    OrdersAdminUpdateStatusDoc,
} from '@modules/orders/docs/orders.admin.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { OrdersListResponseDto } from '@modules/orders/dtos/response/orders.list.response.dto';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';
import { OrdersAdminUpdateStatusRequestDto } from '@modules/orders/dtos/request/orders.admin-update-status.request.dto';

@ApiTags('modules.admin.orders')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/admin/orders',
})
export class OrdersAdminController {
    constructor(private readonly ordersService: OrdersService) {}

    @OrdersAdminListDoc()
    @Response('orders.list')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async list(): Promise<IResponseReturn<{ items: OrdersListResponseDto[] }>> {
        return this.ordersService.adminList();
    }

    @OrdersAdminDetailDoc()
    @Response('orders.detail')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/:id')
    async detail(
        @Param('id') id: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        return this.ordersService.adminDetail(id);
    }

    @OrdersAdminUpdateStatusDoc()
    @Response('orders.detail')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Patch('/:id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() body: OrdersAdminUpdateStatusRequestDto
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        return this.ordersService.adminUpdateStatus(id, body.status);
    }
}
