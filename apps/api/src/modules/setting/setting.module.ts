import { Module } from '@nestjs/common';
import { SettingRepository } from '@modules/setting/repositories/setting.repository';
import { SettingService } from '@modules/setting/services/setting.service';

@Module({
    providers: [SettingService, SettingRepository],
    exports: [SettingService, SettingRepository],
    imports: [],
})
export class SettingModule {}
