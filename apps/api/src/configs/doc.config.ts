import { registerAs } from '@nestjs/config';

export interface IConfigDoc {
    name: string;
    prefix: string;
    version: string;
}

export default registerAs(
    'doc',
    (): IConfigDoc => ({
        name: `${process.env.APP_NAME!.toUpperCase()} APIS SPECIFICATION`,
        prefix: '/docs',
        version: '3.1.0',
    })
);
