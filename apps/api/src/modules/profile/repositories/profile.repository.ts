import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { IProfileSummary } from '@modules/profile/interfaces/profile.interface';

@Injectable()
export class ProfileRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async me(userId: string): Promise<IProfileSummary | null> {
        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                role: {
                    select: {
                        type: true,
                    },
                },
            },
        });

        if (!user) {
            return null;
        }

        const businessProfile =
            await this.databaseService.businessProfile.findUnique({
                where: { userId },
                select: {
                    fullName: true,
                    referralCode: true,
                    rank: true,
                    verified: true,
                },
            });

        return {
            fullName: businessProfile?.fullName ?? '',
            email: user.email,
            role: user.role.type,
            referralCode: businessProfile?.referralCode ?? '',
            rank: businessProfile?.rank ?? '',
            verified: businessProfile?.verified ?? false,
        };
    }

    async adminListBusinessProfiles(): Promise<any[]> {
        return this.databaseService.businessProfile.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateRank(id: string, rank: string): Promise<any> {
        return this.databaseService.businessProfile.update({
            where: { id },
            data: { rank },
        });
    }

    async getBusinessProfileByUserId(userId: string): Promise<any> {
        return this.databaseService.businessProfile.findUnique({
            where: { userId },
        });
    }
}
