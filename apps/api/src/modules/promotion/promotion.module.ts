import { Module } from '@nestjs/common';
import { PromotionRepository } from '@modules/promotion/repositories/promotion.repository';
import { PromotionService } from '@modules/promotion/services/promotion.service';

@Module({
    controllers: [],
    providers: [PromotionService, PromotionRepository],
    exports: [PromotionService],
    imports: [],
})
export class PromotionModule {}
