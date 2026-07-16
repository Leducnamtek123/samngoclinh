import { Module } from '@nestjs/common';
import { MarketplaceRepository } from '@modules/marketplace/repositories/marketplace.repository';
import { MarketplaceService } from '@modules/marketplace/services/marketplace.service';

@Module({
    controllers: [],
    providers: [MarketplaceService, MarketplaceRepository],
    exports: [MarketplaceService],
    imports: [],
})
export class MarketplaceModule {}
