import { Body, Controller, Delete, Param, Post, Put, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { CultivationBed, CultivationCareLog, CultivationGarden, CultivationTree, EnumRoleType } from '@generated/prisma-client';
import { CultivationService } from '@modules/cultivation/services/cultivation.service';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';
import { CultivationCreateCareLogRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-care-log.request.dto';
import { CultivationUpdateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-garden.request.dto';
import { CultivationUpdateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-bed.request.dto';
import { CultivationUpdateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-tree.request.dto';
import {
    CultivationProviderCreateBedDoc,
    CultivationProviderCreateCareLogDoc,
    CultivationProviderCreateGardenDoc,
    CultivationProviderCreateTreeDoc,
    CultivationProviderDeleteBedDoc,
    CultivationProviderDeleteGardenDoc,
    CultivationProviderDeleteTreeDoc,
    CultivationProviderUpdateBedDoc,
    CultivationProviderUpdateGardenDoc,
    CultivationProviderUpdateTreeDoc,
} from '@modules/cultivation/docs/cultivation.provider.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';

@ApiTags('modules.provider.cultivation')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/cultivation',
})
export class CultivationProviderController {
    constructor(private readonly cultivationService: CultivationService) {}

    @CultivationProviderCreateGardenDoc()
    @Response('cultivation.createGarden')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.admin, EnumRoleType.superAdmin)
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

    @CultivationProviderCreateBedDoc()
    @Response('cultivation.createBed')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.admin, EnumRoleType.superAdmin)
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

    @CultivationProviderCreateTreeDoc()
    @Response('cultivation.createTree')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.admin, EnumRoleType.superAdmin)
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

    @CultivationProviderCreateCareLogDoc()
    @Response('cultivation.createCareLog')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.admin, EnumRoleType.superAdmin)
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

    @CultivationProviderUpdateGardenDoc()
    @Response('cultivation.updateGarden')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.admin, EnumRoleType.superAdmin)
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

    @CultivationProviderDeleteGardenDoc()
    @Response('cultivation.deleteGarden')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/gardens/:id')
    async deleteGarden(
        @Param('id') id: string
    ): Promise<IResponseReturn<void>> {
        return this.cultivationService.deleteGarden(id);
    }

    @CultivationProviderUpdateBedDoc()
    @Response('cultivation.updateBed')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.admin, EnumRoleType.superAdmin)
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

    @CultivationProviderDeleteBedDoc()
    @Response('cultivation.deleteBed')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/beds/:id')
    async deleteBed(
        @Param('id') id: string
    ): Promise<IResponseReturn<void>> {
        return this.cultivationService.deleteBed(id);
    }

    @CultivationProviderUpdateTreeDoc()
    @Response('cultivation.updateTree')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.admin, EnumRoleType.superAdmin)
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

    @CultivationProviderDeleteTreeDoc()
    @Response('cultivation.deleteTree')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/trees/:id')
    async deleteTree(
        @Param('id') id: string
    ): Promise<IResponseReturn<void>> {
        return this.cultivationService.deleteTree(id);
    }
}
