import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '@modules/profile/repositories/profile.repository';
import { IProfileSummary } from '@modules/profile/interfaces/profile.interface';

@Injectable()
export class ProfileService {
    constructor(private readonly profileRepository: ProfileRepository) {}

    async me(userId: string): Promise<IResponseReturn<IProfileSummary>> {
        const profile = await this.profileRepository.me(userId);

        return {
            data: profile ?? {
                fullName: '',
                email: '',
                role: '',
                referralCode: '',
                rank: '',
                verified: false,
            },
        };
    }
}
