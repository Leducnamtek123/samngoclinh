import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import {
    ICultivationBedItem,
    ICultivationGardenSummary,
    ICultivationTreeAgeItem,
} from '@modules/cultivation/interfaces/cultivation.interface';

@Injectable()
export class CultivationRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getTreeAgeGroups(userId: string): Promise<ICultivationTreeAgeItem[]> {
        const groups = await this.databaseService.cultivationTree.groupBy({
            by: ['ageYear'],
            where: { ownerUserId: userId },
            _sum: {
                quantity: true,
            },
            orderBy: {
                ageYear: 'asc',
            },
        });

        return groups.map(g => ({
            ageYear: g.ageYear,
            count: g._sum.quantity ?? 0,
        }));
    }

    async getGardenSummary(userId: string): Promise<ICultivationGardenSummary> {
        const count = await this.databaseService.cultivationGarden.count({
            where: { ownerUserId: userId },
        });

        const aggregate = await this.databaseService.cultivationGarden.aggregate({
            where: { ownerUserId: userId },
            _sum: {
                activeBeds: true,
            },
        });

        return {
            total: count,
            activeBeds: aggregate._sum.activeBeds ?? 0,
        };
    }

    async getBeds(userId: string): Promise<ICultivationBedItem[]> {
        const beds = await this.databaseService.cultivationBed.findMany({
            where: { ownerUserId: userId },
            select: {
                id: true,
                name: true,
                status: true,
            },
        });

        return beds.map(b => ({
            id: b.id,
            name: b.name,
            status: b.status,
        }));
    }
}
