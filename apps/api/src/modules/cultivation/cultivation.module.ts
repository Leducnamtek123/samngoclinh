import { Module } from '@nestjs/common';
import { CultivationRepository } from '@modules/cultivation/repositories/cultivation.repository';
import { CultivationService } from '@modules/cultivation/services/cultivation.service';

@Module({
    controllers: [],
    providers: [CultivationService, CultivationRepository],
    exports: [CultivationService, CultivationRepository],
    imports: [],
})
export class CultivationModule {}
