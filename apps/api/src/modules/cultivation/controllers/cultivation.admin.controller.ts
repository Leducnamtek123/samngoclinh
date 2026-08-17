import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    Response,
    ResponsePaging,
} from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import {
    CultivationBed,
    CultivationBedLocation,
    CultivationCareLog,
    CultivationGarden,
    CultivationTree,
    EnumRoleType,
    GardenBooking,
    Prisma,
} from '@generated/prisma-client';
import { CultivationService } from '@modules/cultivation/services/cultivation.service';
import { CultivationUpdateBookingStatusRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-booking-status.request.dto';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';
import { CultivationCreateCareLogRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-care-log.request.dto';
import { CultivationUpdateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-garden.request.dto';
import { CultivationUpdateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-bed.request.dto';
import { CultivationUpdateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-tree.request.dto';
import {
    CultivationAdminListBookingsDoc,
    CultivationAdminUpdateBookingStatusDoc,
} from '@modules/cultivation/docs/cultivation.admin.doc';
import {
    IResponsePagingReturn,
    IResponseReturn,
} from '@common/response/interfaces/response.interface';
import {
    PaginationOffsetQuery,
    PaginationQueryFilterEqualString,
} from '@common/pagination/decorators/pagination.decorator';
import {
    IPaginationEqual,
    IPaginationQueryOffsetParams,
} from '@common/pagination/interfaces/pagination.interface';
import { ICultivationBedLocationsGenerateResult } from '@modules/cultivation/interfaces/cultivation.interface';

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
        return this.cultivationService.listAllTreesAdminPaginated(
            pagination,
            status,
            health,
            ownerUserId,
            ageYear
        );
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

    @Response('cultivation.createGarden')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/gardens')
    async createGarden(
        @AuthJwtPayload('userId') userId: string,
        @Body() body: CultivationCreateGardenRequestDto
    ): Promise<IResponseReturn<CultivationGarden>> {
        return this.cultivationService.createGarden(userId, body);
    }

    @Response('cultivation.createBed')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/beds')
    async createBed(
        @AuthJwtPayload('userId') userId: string,
        @Body() body: CultivationCreateBedRequestDto
    ): Promise<IResponseReturn<CultivationBed>> {
        return this.cultivationService.createBed(userId, body);
    }

    @Response('cultivation.createTree')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/trees')
    async createTree(
        @AuthJwtPayload('userId') userId: string,
        @Body() body: CultivationCreateTreeRequestDto
    ): Promise<IResponseReturn<CultivationTree>> {
        return this.cultivationService.createTree(userId, body);
    }

    @Response('cultivation.createCareLog')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/logs')
    async createCareLog(
        @AuthJwtPayload('userId') userId: string,
        @Body() body: CultivationCreateCareLogRequestDto
    ): Promise<IResponseReturn<CultivationCareLog>> {
        return this.cultivationService.createCareLog(userId, body);
    }

    @Response('cultivation.updateGarden')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/gardens/:id')
    async updateGarden(
        @Param('id') id: string,
        @Body() body: CultivationUpdateGardenRequestDto
    ): Promise<IResponseReturn<CultivationGarden>> {
        return this.cultivationService.updateGarden(id, body);
    }

    @Response('cultivation.deleteGarden')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/gardens/:id')
    async deleteGarden(
        @Param('id') id: string
    ): Promise<IResponseReturn<void>> {
        return this.cultivationService.deleteGarden(id);
    }

    @Response('cultivation.updateBed')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/beds/:id')
    async updateBed(
        @Param('id') id: string,
        @Body() body: CultivationUpdateBedRequestDto
    ): Promise<IResponseReturn<CultivationBed>> {
        return this.cultivationService.updateBed(id, body);
    }

    @Response('cultivation.deleteBed')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/beds/:id')
    async deleteBed(
        @Param('id') id: string
    ): Promise<IResponseReturn<void>> {
        return this.cultivationService.deleteBed(id);
    }

    @Response('cultivation.updateTree')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/trees/:id')
    async updateTree(
        @Param('id') id: string,
        @Body() body: CultivationUpdateTreeRequestDto
    ): Promise<IResponseReturn<CultivationTree>> {
        return this.cultivationService.updateTree(id, body);
    }

    @Response('cultivation.deleteTree')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/trees/:id')
    async deleteTree(
        @Param('id') id: string
    ): Promise<IResponseReturn<void>> {
        return this.cultivationService.deleteTree(id);
    }

    @Response('cultivation.bedLocations')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/beds/:bedCode/locations')
    async getBedLocations(
        @Param('bedCode') bedCode: string
    ): Promise<IResponseReturn<CultivationBedLocation[]>> {
        return this.cultivationService.getBedLocations(bedCode);
    }

    @Response('cultivation.generateLocations')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/beds/:bedCode/locations/generate')
    async generateBedLocations(
        @Param('bedCode') bedCode: string,
        @Body() body: { rows: number; cols: number }
    ): Promise<IResponseReturn<ICultivationBedLocationsGenerateResult>> {
        return this.cultivationService.generateBedLocations(
            bedCode,
            body.rows,
            body.cols
        );
    }

    @Response('cultivation.updateLocation')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/beds/locations/:id')
    async updateBedLocation(
        @Param('id') id: string,
        @Body() body: { status: string; treeCode?: string }
    ): Promise<IResponseReturn<CultivationBedLocation>> {
        return this.cultivationService.updateBedLocation(
            id,
            body.status,
            body.treeCode
        );
    }

    @Response('cultivation.deleteLocation')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/beds/locations/:id')
    async deleteBedLocation(
        @Param('id') id: string
    ): Promise<IResponseReturn<void>> {
        return this.cultivationService.deleteBedLocation(id);
    }
}
