import { registerAs } from '@nestjs/config';

export interface IConfigSmtp {
    host: string | null;
    port: number;
    secure: boolean;
    username: string | null;
    password: string | null;
    from: string | null;
    fromName: string | null;
}

export default registerAs(
    'smtp',
    (): IConfigSmtp => ({
        host: process.env.SMTP_HOST ?? null,
        port: Number.parseInt(process.env.SMTP_PORT ?? '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        username: process.env.SMTP_USER ?? null,
        password: process.env.SMTP_PASSWORD ?? null,
        from: process.env.SMTP_FROM ?? null,
        fromName: process.env.SMTP_FROM_NAME ?? null,
    })
);
