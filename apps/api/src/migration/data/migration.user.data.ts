import { EnumAppEnvironment } from '@app/enums/app.enum';

const userData: {
    country: string;
    email: Lowercase<string>;
    name: string;
    role: string;
    password: string;
}[] = [
    {
        country: 'VN',
        email: 'superadmin@mail.com',
        name: 'Super Admin',
        role: 'superadmin',
        password: 'aaAA@123',
    },
    {
        country: 'VN',
        email: 'admin@mail.com',
        name: 'Admin',
        role: 'admin',
        password: 'aaAA@123',
    },
    {
        country: 'VN',
        email: 'provider@mail.com',
        name: 'Provider',
        role: 'provider',
        password: 'aaAA@123',
    },
];

export const migrationUserData: Record<
    EnumAppEnvironment,
    {
        country: string;
        email: string;
        name: string;
        role: string;
        password: string;
    }[]
> = {
    [EnumAppEnvironment.local]: [
        ...userData,
        {
            country: 'VN',
            email: 'user@mail.com',
            name: 'User',
            role: 'user',
            password: 'aaAA@123',
        },
    ],
    [EnumAppEnvironment.development]: userData,
    [EnumAppEnvironment.staging]: userData,
    [EnumAppEnvironment.production]: userData,
};
