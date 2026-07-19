import { Body, Controller, Get, Param, Post, Query, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, ResponsePaging } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected, UserCurrent } from '@modules/user/decorators/user.decorator';
import { IUser } from '@modules/user/interfaces/user.interface';
import { CultivationCareLog, CultivationGarden, EnumRoleType, GardenBooking, Prisma } from '@generated/prisma-client';
import { CultivationService } from '@modules/cultivation/services/cultivation.service';
import {
    CultivationUserBedsDoc,
    CultivationUserCreateBookingDoc,
    CultivationUserGardensDoc,
    CultivationUserListBookingsDoc,
    CultivationUserListCareLogsDoc,
    CultivationUserTreesDoc,
    CultivationUserGardenDetailDoc,
    CultivationUserBedDetailDoc,
    CultivationUserTreeDetailDoc,
} from '@modules/cultivation/docs/cultivation.user.doc';
import { CultivationCreateBookingRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-booking.request.dto';
import { IResponseReturn, IResponsePagingReturn } from '@common/response/interfaces/response.interface';
import { CultivationTreeResponseDto } from '@modules/cultivation/dtos/response/cultivation.tree.response.dto';
import { CultivationGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.garden.response.dto';
import { CultivationBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.bed.response.dto';
import { PaginationOffsetQuery, PaginationQueryFilterEqualString } from '@common/pagination/decorators/pagination.decorator';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';

@ApiTags('modules.user.cultivation')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/cultivation',
})
export class CultivationUserController {
    constructor(private readonly cultivationService: CultivationService) {}

    @CultivationUserTreesDoc()
    @Response('cultivation.trees')
    @RoleProtected(
        EnumRoleType.superAdmin,
        EnumRoleType.admin,
        EnumRoleType.provider,
        EnumRoleType.user
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/trees')
    async trees(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<CultivationTreeResponseDto[]>> {
        return this.cultivationService.trees(userId);
    }

    @CultivationUserGardensDoc()
    @Response('cultivation.gardens')
    @RoleProtected(
        EnumRoleType.superAdmin,
        EnumRoleType.admin,
        EnumRoleType.provider,
        EnumRoleType.user
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/gardens')
    async gardens(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<CultivationGardenResponseDto>> {
        return this.cultivationService.gardens(userId);
    }

    @Response('cultivation.gardens')
    @RoleProtected(
        EnumRoleType.superAdmin,
        EnumRoleType.admin,
        EnumRoleType.provider,
        EnumRoleType.user
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @ResponsePaging('cultivation.gardens')
    @RoleProtected(
        EnumRoleType.superAdmin,
        EnumRoleType.admin,
        EnumRoleType.provider,
        EnumRoleType.user
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/gardens/paginated')
    async gardensPaginated(
        @UserCurrent() user: IUser,
        @PaginationOffsetQuery({
            availableSearch: ['name', 'code', 'location'],
            availableOrderBy: ['createdAt', 'name', 'code', 'totalBeds', 'activeBeds', 'totalTrees'],
            defaultPerPage: 10,
        })
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationGardenSelect,
            Prisma.CultivationGardenWhereInput
        >
    ): Promise<IResponsePagingReturn<CultivationGarden>> {
        const isAdmin = user.role.type === EnumRoleType.admin || user.role.type === EnumRoleType.superAdmin;
        return this.cultivationService.gardensPaginated(user.id, isAdmin, pagination);
    }

    @Get('/gardens/list')
    async gardensList(
        @UserCurrent() user: IUser
    ): Promise<IResponseReturn<CultivationGarden[]>> {
        const isAdmin = user.role.type === EnumRoleType.admin || user.role.type === EnumRoleType.superAdmin;
        return this.cultivationService.gardensList(user.id, isAdmin);
    }

    @CultivationUserBedsDoc()
    @ResponsePaging('cultivation.beds')
    @RoleProtected(
        EnumRoleType.superAdmin,
        EnumRoleType.admin,
        EnumRoleType.provider,
        EnumRoleType.user
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/beds')
    async beds(
        @UserCurrent() user: IUser,
        @PaginationOffsetQuery({
            availableSearch: ['name', 'code', 'gardenCode'],
            availableOrderBy: ['createdAt', 'name', 'code', 'treeCount', 'ageYear'],
            defaultPerPage: 10,
        })
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationBedSelect,
            Prisma.CultivationBedWhereInput
        >,
        @PaginationQueryFilterEqualString('status')
        status?: Record<string, IPaginationEqual>,
        @PaginationQueryFilterEqualString('gardenCode')
        gardenCode?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CultivationBedResponseDto>> {
        const isAdmin = user.role.type === EnumRoleType.admin || user.role.type === EnumRoleType.superAdmin;
        return this.cultivationService.beds(user.id, isAdmin, pagination, status, gardenCode);
    }

    @CultivationUserListCareLogsDoc()
    @Response('cultivation.listCareLogs')
    @RoleProtected(
        EnumRoleType.superAdmin,
        EnumRoleType.admin,
        EnumRoleType.provider,
        EnumRoleType.user
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/logs')
    async listCareLogs(
        @Query('bedCode') bedCode?: string,
        @Query('treeCode') treeCode?: string
    ): Promise<IResponseReturn<CultivationCareLog[]>> {
        return this.cultivationService.listCareLogs(bedCode, treeCode);
    }

    @CultivationUserCreateBookingDoc()
    @Response('cultivation.createBooking')
    @RoleProtected(
        EnumRoleType.superAdmin,
        EnumRoleType.admin,
        EnumRoleType.provider,
        EnumRoleType.user
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/bookings')
    async createBooking(
        @AuthJwtPayload('userId') userId: string,
        @Body() body: CultivationCreateBookingRequestDto
    ): Promise<IResponseReturn<GardenBooking>> {
        return this.cultivationService.createBooking(userId, body);
    }

    @CultivationUserListBookingsDoc()
    @Response('cultivation.listBookings')
    @RoleProtected(
        EnumRoleType.superAdmin,
        EnumRoleType.admin,
        EnumRoleType.provider,
        EnumRoleType.user
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/bookings')
    async listBookings(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<GardenBooking[]>> {
        return this.cultivationService.listBookings(userId);
    }

    @CultivationUserGardenDetailDoc()
    @Response('cultivation.gardens')
    @RoleProtected(
        EnumRoleType.superAdmin,
        EnumRoleType.admin,
        EnumRoleType.provider,
        EnumRoleType.user
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/gardens/:id')
    async gardenDetail(
        @Param('id') id: string,
        @UserCurrent() user: IUser
    ): Promise<IResponseReturn<CultivationGarden>> {
        const isAdmin = user.role.type === EnumRoleType.admin || user.role.type === EnumRoleType.superAdmin;
        return this.cultivationService.gardenDetail(id, user.id, isAdmin);
    }

    @CultivationUserBedDetailDoc()
    @Response('cultivation.beds')
    @RoleProtected(
        EnumRoleType.superAdmin,
        EnumRoleType.admin,
        EnumRoleType.provider,
        EnumRoleType.user
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/beds/:id')
    async bedDetail(
        @Param('id') id: string,
        @UserCurrent() user: IUser
    ): Promise<IResponseReturn<any>> {
        const isAdmin = user.role.type === EnumRoleType.admin || user.role.type === EnumRoleType.superAdmin;
        return this.cultivationService.bedDetail(id, user.id, isAdmin);
    }

    @CultivationUserTreeDetailDoc()
    @Response('cultivation.trees')
    @RoleProtected(
        EnumRoleType.superAdmin,
        EnumRoleType.admin,
        EnumRoleType.provider,
        EnumRoleType.user
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/trees/:id')
    async treeDetail(
        @Param('id') id: string,
        @UserCurrent() user: IUser
    ): Promise<IResponseReturn<any>> {
        const isAdmin = user.role.type === EnumRoleType.admin || user.role.type === EnumRoleType.superAdmin;
        return this.cultivationService.treeDetail(id, user.id, isAdmin);
    }
}
