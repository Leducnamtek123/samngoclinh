import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { SystemSetting } from '@generated/prisma-client';

@Injectable()
export class SettingRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getSetting(key: string): Promise<SystemSetting | null> {
        return this.databaseService.systemSetting.findUnique({
            where: { key },
        });
    }

    async updateSetting(key: string, value: string): Promise<SystemSetting> {
        return this.databaseService.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

    async listSettings(): Promise<SystemSetting[]> {
        return this.databaseService.systemSetting.findMany({
            orderBy: { key: 'asc' },
        });
    }
}
