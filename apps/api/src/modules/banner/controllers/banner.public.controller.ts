import { Controller, Get, Param, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { BannerService } from '../services/banner.service';
import { IResponseReturn } from '@common/response/interfaces/response.interface';

@ApiTags('modules.public.banner')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/banners',
})
export class BannerPublicController {
    constructor(private readonly bannerService: BannerService) {}

    @Response('banner.get')
    @ApiKeyProtected()
    @Get('/:pageKey')
    async getBanner(
        @Param('pageKey') pageKey: string
    ): Promise<IResponseReturn<any>> {
        const data = await this.bannerService.getBanner(pageKey);
        return { data };
    }
}
