import { Module } from '@nestjs/common';
import { OrdersModule } from '@modules/orders/orders.module';
import { SepayPublicController } from '@modules/sepay/controllers/sepay.public.controller';
import { SepayService } from '@modules/sepay/services/sepay.service';

@Module({
    imports: [OrdersModule],
    controllers: [SepayPublicController],
    providers: [SepayService],
    exports: [SepayService],
})
export class SepayModule {}
