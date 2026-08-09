import { registerAs } from '@nestjs/config';

export interface IConfigSepay {
    bankBrand: string;
    bankAccount: string | null;
    accountName: string | null;
    webhookApiKey: string | null;
    pgEnv: 'sandbox' | 'production';
    pgMerchantId: string | null;
    pgSecretKey: string | null;
}

export default registerAs(
    'sepay',
    (): IConfigSepay => ({
        bankBrand: process.env.SEPAY_BANK_BRAND ?? '',
        bankAccount: process.env.SEPAY_BANK_ACCOUNT ?? null,
        accountName: process.env.SEPAY_ACCOUNT_NAME ?? null,
        webhookApiKey: process.env.SEPAY_WEBHOOK_API_KEY ?? null,
        pgEnv:
            process.env.SEPAY_PG_ENV === 'production' ? 'production' : 'sandbox',
        pgMerchantId: process.env.SEPAY_PG_MERCHANT_ID ?? null,
        pgSecretKey: process.env.SEPAY_PG_SECRET_KEY ?? null,
    })
);
