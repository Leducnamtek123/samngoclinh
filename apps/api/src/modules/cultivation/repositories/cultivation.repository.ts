import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
    ICultivationBedItem,
    ICultivationGardenSummary,
    ICultivationTreeAgeItem,
} from '@modules/cultivation/interfaces/cultivation.interface';
import {
    CultivationBed,
    CultivationGarden,
    CultivationTree,
} from '@generated/prisma-client';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';

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

        const aggregate =
            await this.databaseService.cultivationGarden.aggregate({
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

    async createGarden(
        userId: string,
        payload: CultivationCreateGardenRequestDto
    ): Promise<CultivationGarden> {
        const code = 'garden-' + Math.random().toString(36).substring(2, 11);
        return this.databaseService.cultivationGarden.create({
            data: {
                code,
                name: payload.name,
                ownerUserId: userId,
                status: 'active',
                totalBeds: 0,
                activeBeds: 0,
                totalTrees: 0,
                metadata: (payload.metadata ?? {}) as Prisma.InputJsonValue,
            },
        });
    }

    async createBed(
        userId: string,
        payload: CultivationCreateBedRequestDto
    ): Promise<CultivationBed> {
        const code = 'bed-' + Math.random().toString(36).substring(2, 11);
        return this.databaseService.$transaction(async tx => {
            const bed = await tx.cultivationBed.create({
                data: {
                    code,
                    gardenCode: payload.gardenCode,
                    name: payload.name,
                    ageYear: payload.ageYear,
                    treeCount: payload.treeCount,
                    status: 'active',
                    ownerUserId: userId,
                    metadata: (payload.metadata ?? {}) as Prisma.InputJsonValue,
                },
            });

            await tx.cultivationGarden.update({
                where: { code: payload.gardenCode },
                data: {
                    totalBeds: { increment: 1 },
                    activeBeds: { increment: 1 },
                    totalTrees: { increment: payload.treeCount },
                },
            });

            return bed;
        });
    }

    async createTree(
        userId: string,
        payload: CultivationCreateTreeRequestDto
    ): Promise<CultivationTree> {
        const code = 'tree-' + Math.random().toString(36).substring(2, 11);
        return this.databaseService.$transaction(async tx => {
            const tree = await tx.cultivationTree.create({
                data: {
                    code,
                    bedCode: payload.bedCode ?? null,
                    ownerUserId: userId,
                    name: payload.name,
                    ageYear: payload.ageYear,
                    quantity: payload.quantity,
                    status: 'active',
                    metadata: (payload.metadata ?? {}) as Prisma.InputJsonValue,
                },
            });

            if (payload.bedCode) {
                const bed = await tx.cultivationBed.findUnique({
                    where: { code: payload.bedCode },
                });

                if (bed) {
                    await tx.cultivationBed.update({
                        where: { code: payload.bedCode },
                        data: {
                            treeCount: { increment: payload.quantity },
                        },
                    });

                    await tx.cultivationGarden.update({
                        where: { code: bed.gardenCode },
                        data: {
                            totalTrees: { increment: payload.quantity },
                        },
                    });
                }
            }

            return tree;
        });
    }
}
