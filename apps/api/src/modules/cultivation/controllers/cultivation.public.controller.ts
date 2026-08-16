import { Controller, Get, Param, Query, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { CultivationService } from '@modules/cultivation/services/cultivation.service';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { CultivationPublicBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.public-bed.response.dto';
import { CultivationPublicBedDetailResponseDto } from '@modules/cultivation/dtos/response/cultivation.public-bed-detail.response.dto';
import { CultivationPublicGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.public-garden.response.dto';
import { CultivationPurchaseResponseDto } from '@modules/cultivation/dtos/response/cultivation.public-purchase.response.dto';
import {
    CultivationPublicBedDetailDoc,
    CultivationPublicGardenPurchaseDoc,
    CultivationPublicListBedsDoc,
    CultivationPublicListGardensDoc,
} from '@modules/cultivation/docs/cultivation.public.doc';

@ApiTags('modules.public.cultivation')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/cultivation',
})
export class CultivationPublicController {
    constructor(private readonly cultivationService: CultivationService) {}

    @CultivationPublicListGardensDoc()
    @Response('cultivation.publicGardens')
    @ApiKeyProtected()
    @Get('/gardens')
    async listGardens(): Promise<
        IResponseReturn<CultivationPublicGardenResponseDto[]>
    > {
        return this.cultivationService.publicGardens();
    }

    @CultivationPublicGardenPurchaseDoc()
    @Response('cultivation.publicGardenPurchase')
    @ApiKeyProtected()
    @Get('/gardens/:code/purchase')
    async gardenPurchase(
        @Param('code') code: string
    ): Promise<IResponseReturn<CultivationPurchaseResponseDto>> {
        return this.cultivationService.gardenPurchase(code);
    }

    @CultivationPublicListBedsDoc()
    @Response('cultivation.publicBeds')
    @ApiKeyProtected()
    @Get('/beds')
    async listBeds(
        @Query('ageYear') ageYear?: string
    ): Promise<IResponseReturn<CultivationPublicBedResponseDto[]>> {
        return this.cultivationService.publicBedsByAge(ageYear ? Number(ageYear) : null);
    }

    @CultivationPublicBedDetailDoc()
    @Response('cultivation.publicBedDetail')
    @ApiKeyProtected()
    @Get('/beds/:code')
    async bedDetail(
        @Param('code') code: string
    ): Promise<IResponseReturn<CultivationPublicBedDetailResponseDto>> {
        return this.cultivationService.publicBedDetail(code);
    }
}
