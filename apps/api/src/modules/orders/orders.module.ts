import { Module } from '@nestjs/common';
import { OrdersRepository } from '@modules/orders/repositories/orders.repository';
import { OrdersService } from '@modules/orders/services/orders.service';
import { OrdersExpirationService } from '@modules/orders/services/orders-expiration.service';
import { EContractModule } from '@modules/e-contract/e-contract.module';

@Module({
    controllers: [],
    providers: [OrdersService, OrdersRepository, OrdersExpirationService],
    exports: [OrdersService, OrdersRepository, OrdersExpirationService],
    imports: [EContractModule],
})
export class OrdersModule {}

