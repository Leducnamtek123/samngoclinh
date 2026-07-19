import { Module } from '@nestjs/common';
import { BannerService } from './services/banner.service';
import { BannerPublicController } from './controllers/banner.public.controller';
import { BannerAdminController } from './controllers/banner.admin.controller';

@Module({
    controllers: [BannerPublicController, BannerAdminController],
    providers: [BannerService],
    exports: [BannerService],
})
export class BannerModule {}
