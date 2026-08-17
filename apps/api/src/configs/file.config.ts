import { registerAs } from '@nestjs/config';

export interface IConfigFile {
    storageDriver: string;
}

export default registerAs(
    'file',
    (): IConfigFile => ({
        storageDriver: 'local',
    })
);
