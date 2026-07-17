import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
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

    async adminListBusinessProfiles(): Promise<IResponseReturn<{ items: any[] }>> {
        const items = await this.profileRepository.adminListBusinessProfiles();
        return {
            data: { items },
        };
    }

    async adminUpdateRank(id: string, rank: string): Promise<IResponseReturn<any>> {
        const updated = await this.profileRepository.updateRank(id, rank);
        if (!updated) {
            throw new NotFoundException('Business profile not found');
        }
        return {
            data: updated,
        };
    }

    async userBusinessProfile(userId: string): Promise<IResponseReturn<any>> {
        const profile = await this.profileRepository.getBusinessProfileByUserId(userId);
        if (!profile) {
            throw new NotFoundException('Business profile not found');
        }
        return {
            data: profile,
        };
    }
}
