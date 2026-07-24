import { registerAs } from '@nestjs/config';

export interface IConfigCloudinary {
    cloudName: string | null;
    apiKey: string | null;
    apiSecret: string | null;
}

export default registerAs(
    'cloudinary',
    (): IConfigCloudinary => ({
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? null,
        apiKey: process.env.CLOUDINARY_API_KEY ?? null,
        apiSecret: process.env.CLOUDINARY_API_SECRET ?? null,
    })
);
