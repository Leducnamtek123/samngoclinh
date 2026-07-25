import { Injectable, Logger } from '@nestjs/common';
import { IPaymentGatewayProvider } from '@modules/payment-gateway/interfaces/payment-gateway.interface';

@Injectable()
export class PaymentGatewayRegistry {
    private readonly providers = new Map<string, IPaymentGatewayProvider>();
    private readonly logger = new Logger(PaymentGatewayRegistry.name);

    registerProvider(provider: IPaymentGatewayProvider): void {
        this.providers.set(provider.name.toLowerCase(), provider);
        this.logger.log(`Registered payment gateway provider: [${provider.name}]`);
    }

    getProvider(name?: string): IPaymentGatewayProvider | undefined {
        if (!name) {
            return this.providers.get('sepay');
        }
        return this.providers.get(name.toLowerCase()) || this.providers.get('sepay');
    }
}
