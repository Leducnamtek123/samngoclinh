import { registerAs } from '@nestjs/config';

export interface IConfigSepay {
    bankBrand: string;
    bankAccount: string | null;
    accountName: string | null;
    webhookApiKey: string | null;
}

export default registerAs(
    'sepay',
    (): IConfigSepay => ({
        bankBrand: process.env.SEPAY_BANK_BRAND || 'MBBank',
        bankAccount: process.env.SEPAY_BANK_ACCOUNT ?? null,
        accountName: process.env.SEPAY_ACCOUNT_NAME ?? null,
        webhookApiKey: process.env.SEPAY_WEBHOOK_API_KEY ?? null,
    })
);
