import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from '@modules/profile/repositories/profile.repository';
import { IProfileSummary } from '@modules/profile/interfaces/profile.interface';
import { BusinessProfile } from '@generated/prisma-client';

@Injectable()
export class ProfileService {
    constructor(private readonly profileRepository: ProfileRepository) {}

    async me(userId: string): Promise<IResponseReturn<IProfileSummary>> {
        const profile = await this.profileRepository.me(userId);

        return {
            data: profile ?? {
                id: userId,
                fullName: '',
                email: '',
                role: '',
                referralCode: '',
                rank: '',
                verified: false,
                avatarUrl: null,
            },
        };
    }

    async adminListBusinessProfiles(): Promise<
        IResponseReturn<{ items: BusinessProfile[] }>
    > {
        const items = await this.profileRepository.adminListBusinessProfiles();
        return {
            data: { items },
        };
    }

    async adminUpdateRank(
        id: string,
        rank: string
    ): Promise<IResponseReturn<BusinessProfile>> {
        const updated = await this.profileRepository.updateRank(id, rank);
        if (!updated) {
            throw new NotFoundException('Business profile not found');
        }
        return {
            data: updated,
        };
    }

    async userBusinessProfile(
        userId: string
    ): Promise<IResponseReturn<BusinessProfile>> {
        const profile = await this.profileRepository.getBusinessProfileByUserId(userId);
        return {
            data: profile || null,
        };
    }
}
