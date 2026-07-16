import { Module } from '@nestjs/common';
import { OrdersRepository } from '@modules/orders/repositories/orders.repository';
import { OrdersService } from '@modules/orders/services/orders.service';

@Module({
    controllers: [],
    providers: [OrdersService, OrdersRepository],
    exports: [OrdersService, OrdersRepository],
    imports: [],
})
export class OrdersModule {}
