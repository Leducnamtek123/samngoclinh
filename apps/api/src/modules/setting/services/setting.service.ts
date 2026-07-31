import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SettingRepository } from '@modules/setting/repositories/setting.repository';
import { SettingDefault } from '@modules/setting/constants/setting.constant';
import { SystemSetting } from '@generated/prisma-client';

@Injectable()
export class SettingService {
    constructor(private readonly settingRepository: SettingRepository) {}

    async getSetting(key: string): Promise<IResponseReturn<SystemSetting>> {
        const setting = await this.settingRepository.getSetting(key);
        if (setting) {
            return { data: setting };
        }

        const fallback = SettingDefault[key];
        if (fallback !== undefined) {
            const now = new Date();
            return {
                data: {
                    id: key,
                    key,
                    value: fallback,
                    createdAt: now,
                    updatedAt: now,
                },
            };
        }

        throw new NotFoundException(`Setting with key "${key}" not found`);
    }

    async updateSetting(key: string, value: string): Promise<IResponseReturn<SystemSetting>> {
        const setting = await this.settingRepository.updateSetting(key, value);
        return { data: setting };
    }

    async listSettings(): Promise<IResponseReturn<{ items: SystemSetting[] }>> {
        const items = await this.settingRepository.listSettings();
        return {
            data: { items },
        };
    }
}
