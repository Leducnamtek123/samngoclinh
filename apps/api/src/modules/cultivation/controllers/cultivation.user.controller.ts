import { Body, Controller, Get, Post, Query, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { CultivationCareLog, EnumRoleType, GardenBooking } from '@generated/prisma-client';
import { CultivationService } from '@modules/cultivation/services/cultivation.service';
import {
    CultivationUserBedsDoc,
    CultivationUserCreateBookingDoc,
    CultivationUserGardensDoc,
    CultivationUserListBookingsDoc,
    CultivationUserListCareLogsDoc,
    CultivationUserTreesDoc,
} from '@modules/cultivation/docs/cultivation.user.doc';
import { CultivationCreateBookingRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-booking.request.dto';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { CultivationTreeResponseDto } from '@modules/cultivation/dtos/response/cultivation.tree.response.dto';
import { CultivationGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.garden.response.dto';
import { CultivationBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.bed.response.dto';

@ApiTags('modules.user.cultivation')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/cultivation',
})
export class CultivationUserController {
    constructor(private readonly cultivationService: CultivationService) {}

    @CultivationUserTreesDoc()
    @Response('cultivation.trees')
    @RoleProtected(EnumRoleType.user)
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
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/gardens')
    async gardens(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<CultivationGardenResponseDto>> {
        return this.cultivationService.gardens(userId);
    }

    @CultivationUserBedsDoc()
    @Response('cultivation.beds')
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/beds')
    async beds(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<{ items: CultivationBedResponseDto[] }>> {
        return this.cultivationService.beds(userId);
    }

    @CultivationUserListCareLogsDoc()
    @Response('cultivation.listCareLogs')
    @RoleProtected(EnumRoleType.user)
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
    @RoleProtected(EnumRoleType.user)
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
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/bookings')
    async listBookings(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<GardenBooking[]>> {
        return this.cultivationService.listBookings(userId);
    }
}
