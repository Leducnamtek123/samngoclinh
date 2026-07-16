import { Module } from '@nestjs/common';
import { ProfileRepository } from '@modules/profile/repositories/profile.repository';
import { ProfileService } from '@modules/profile/services/profile.service';

@Module({
    controllers: [],
    providers: [ProfileService, ProfileRepository],
    exports: [ProfileService],
    imports: [],
})
export class ProfileModule {}
