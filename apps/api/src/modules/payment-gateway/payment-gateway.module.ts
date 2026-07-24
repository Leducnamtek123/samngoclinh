import { Global, Module } from '@nestjs/common';
import { PaymentGatewayRegistry } from '@modules/payment-gateway/services/payment-gateway.registry';

@Global()
@Module({
    providers: [PaymentGatewayRegistry],
    exports: [PaymentGatewayRegistry],
})
export class PaymentGatewayModule {}
