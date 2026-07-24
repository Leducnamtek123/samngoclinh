import { registerAs } from '@nestjs/config';

export interface IConfigPayment {
    webhookSecret: string | null;
}

export default registerAs(
    'payment',
    (): IConfigPayment => ({
        webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET ?? null,
    })
);
