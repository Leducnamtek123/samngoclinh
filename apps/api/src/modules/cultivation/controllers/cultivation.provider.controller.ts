import { Body, Controller, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import {
    CultivationBed,
    CultivationGarden,
    CultivationTree,
    EnumRoleType,
} from '@generated/prisma-client';
import { CultivationService } from '@modules/cultivation/services/cultivation.service';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';
import {
    CultivationProviderCreateBedDoc,
    CultivationProviderCreateGardenDoc,
    CultivationProviderCreateTreeDoc,
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
    @RoleProtected(EnumRoleType.provider)
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
    @RoleProtected(EnumRoleType.provider)
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
    @RoleProtected(EnumRoleType.provider)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/trees')
    async createTree(
        @AuthJwtPayload('userId') userId: string,
        @Body() body: CultivationCreateTreeRequestDto
    ): Promise<IResponseReturn<CultivationTree>> {
        return this.cultivationService.createTree(userId, body);
    }
}
