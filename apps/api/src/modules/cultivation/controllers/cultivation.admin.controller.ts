import { Body, Controller, Get, Param, Patch, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, ResponsePaging } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { CultivationTree, EnumRoleType, GardenBooking, Prisma } from '@generated/prisma-client';
import { CultivationService } from '@modules/cultivation/services/cultivation.service';
import { CultivationUpdateBookingStatusRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-booking-status.request.dto';
import {
    CultivationAdminListBookingsDoc,
    CultivationAdminUpdateBookingStatusDoc,
} from '@modules/cultivation/docs/cultivation.admin.doc';
import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { PaginationOffsetQuery, PaginationQueryFilterEqualString } from '@common/pagination/decorators/pagination.decorator';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';

@ApiTags('modules.admin.cultivation')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/cultivation',
})
export class CultivationAdminController {
    constructor(private readonly cultivationService: CultivationService) {}

    @CultivationAdminListBookingsDoc()
    @Response('cultivation.adminListBookings')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/bookings')
    async listAllBookings(): Promise<IResponseReturn<GardenBooking[]>> {
        return this.cultivationService.listBookings();
    }

    @CultivationAdminUpdateBookingStatusDoc()
    @ResponsePaging('cultivation.adminListTrees')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/trees')
    async listAllTreesAdmin(
        @PaginationOffsetQuery({
            availableSearch: ['code', 'name'],
            availableOrderBy: ['createdAt', 'code', 'ageYear', 'quantity'],
            defaultPerPage: 10,
        })
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationTreeSelect,
            Prisma.CultivationTreeWhereInput
        >,
        @PaginationQueryFilterEqualString('status')
        status?: Record<string, IPaginationEqual>,
        @PaginationQueryFilterEqualString('healthStatus')
        health?: Record<string, IPaginationEqual>,
        @PaginationQueryFilterEqualString('ownerUserId')
        ownerUserId?: Record<string, IPaginationEqual>,
        @PaginationQueryFilterEqualString('ageYear')
        ageYear?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CultivationTree>> {
        return this.cultivationService.listAllTreesAdminPaginated(pagination, status, health, ownerUserId, ageYear);
    }

    @CultivationAdminUpdateBookingStatusDoc()
    @Response('cultivation.adminUpdateBookingStatus')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Patch('/bookings/:id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() body: CultivationUpdateBookingStatusRequestDto
    ): Promise<IResponseReturn<GardenBooking>> {
        return this.cultivationService.updateBookingStatus(id, body);
    }
}
