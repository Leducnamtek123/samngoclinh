import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
    ICultivationBedItem,
    ICultivationGardenSummary,
    ICultivationTreeAgeItem,
} from '@modules/cultivation/interfaces/cultivation.interface';
import { CultivationBed, CultivationCareLog, CultivationGarden, CultivationTree, GardenBooking } from '@generated/prisma-client';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';
import { CultivationCreateCareLogRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-care-log.request.dto';
import { CultivationCreateBookingRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-booking.request.dto';
import { CultivationUpdateBookingStatusRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-booking-status.request.dto';

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
                code: true,
                gardenCode: true,
                name: true,
                ageYear: true,
                treeCount: true,
                status: true,
                createdAt: true,
            },
        });

        return beds.map(b => ({
            id: b.id,
            code: b.code,
            gardenCode: b.gardenCode,
            name: b.name,
            ageYear: b.ageYear,
            treeCount: b.treeCount,
            status: b.status,
            createdAt: b.createdAt,
        }));
    }

    async createGarden(userId: string, payload: CultivationCreateGardenRequestDto): Promise<CultivationGarden> {
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

    async createBed(userId: string, payload: CultivationCreateBedRequestDto): Promise<CultivationBed> {
        const code = 'bed-' + Math.random().toString(36).substring(2, 11);
        return this.databaseService.$transaction(async (tx) => {
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

    async createTree(userId: string, payload: CultivationCreateTreeRequestDto): Promise<CultivationTree> {
        const code = 'tree-' + Math.random().toString(36).substring(2, 11);
        return this.databaseService.$transaction(async (tx) => {
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

    async getBedByCodeAndOwner(code: string, ownerUserId: string): Promise<CultivationBed | null> {
        return this.databaseService.cultivationBed.findFirst({
            where: { code, ownerUserId },
        });
    }

    async getTreeByCodeAndOwner(code: string, ownerUserId: string): Promise<CultivationTree | null> {
        return this.databaseService.cultivationTree.findFirst({
            where: { code, ownerUserId },
        });
    }

    async createCareLog(payload: CultivationCreateCareLogRequestDto): Promise<CultivationCareLog> {
        const code = 'log-' + Math.random().toString(36).substring(2, 11);
        return this.databaseService.cultivationCareLog.create({
            data: {
                code,
                bedCode: payload.bedCode ?? null,
                treeCode: payload.treeCode ?? null,
                action: payload.action,
                title: payload.title,
                description: payload.description ?? null,
                status: payload.status,
                images: payload.images ?? [],
                loggedAt: new Date(),
            },
        });
    }

    async listCareLogs(bedCode?: string, treeCode?: string): Promise<CultivationCareLog[]> {
        return this.databaseService.cultivationCareLog.findMany({
            where: {
                OR: [
                    bedCode ? { bedCode } : undefined,
                    treeCode ? { treeCode } : undefined,
                ].filter(Boolean) as Prisma.CultivationCareLogWhereInput[],
            },
            orderBy: {
                loggedAt: 'desc',
            },
        });
    }

    async createBooking(userId: string, payload: CultivationCreateBookingRequestDto): Promise<GardenBooking> {
        const code = 'bkg-' + Math.random().toString(36).substring(2, 11);
        return this.databaseService.gardenBooking.create({
            data: {
                code,
                userId,
                gardenCode: payload.gardenCode,
                visitDate: new Date(payload.visitDate),
                guestCount: payload.guestCount,
                contactPhone: payload.contactPhone,
                status: 'pending',
            },
        });
    }

    async listBookings(userId?: string): Promise<GardenBooking[]> {
        return this.databaseService.gardenBooking.findMany({
            where: userId ? { userId } : undefined,
            orderBy: {
                visitDate: 'asc',
            },
        });
    }

    async getBookingById(id: string): Promise<GardenBooking | null> {
        return this.databaseService.gardenBooking.findUnique({
            where: { id },
        });
    }

    async updateBookingStatus(id: string, payload: CultivationUpdateBookingStatusRequestDto): Promise<GardenBooking> {
        return this.databaseService.gardenBooking.update({
            where: { id },
            data: {
                status: payload.status,
                adminNote: payload.adminNote ?? null,
            },
        });
    }

    async updateGarden(id: string, name?: string, metadata?: Record<string, unknown>): Promise<CultivationGarden> {
        return this.databaseService.cultivationGarden.update({
            where: { id },
            data: {
                name,
                metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
            },
        });
    }

    async deleteGarden(id: string): Promise<void> {
        const garden = await this.databaseService.cultivationGarden.findUnique({ where: { id } });
        if (!garden) {
            return;
        }

        // Check if contains beds
        const bedsCount = await this.databaseService.cultivationBed.count({
            where: { gardenCode: garden.code },
        });
        if (bedsCount > 0) {
            throw new Error('Cannot delete garden that still contains beds');
        }

        await this.databaseService.cultivationGarden.delete({ where: { id } });
    }

    async updateBed(id: string, name?: string, ageYear?: number, treeCount?: number, metadata?: Record<string, unknown>): Promise<CultivationBed> {
        return this.databaseService.cultivationBed.update({
            where: { id },
            data: {
                name,
                ageYear,
                treeCount,
                metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
            },
        });
    }

    async deleteBed(id: string): Promise<void> {
        const bed = await this.databaseService.cultivationBed.findUnique({ where: { id } });
        if (!bed) {
            return;
        }

        // Check if contains trees
        const treesCount = await this.databaseService.cultivationTree.count({
            where: { bedCode: bed.code },
        });
        if (treesCount > 0) {
            throw new Error('Cannot delete bed that still contains trees');
        }

        await this.databaseService.$transaction(async tx => {
            await tx.cultivationBed.delete({ where: { id } });
            await tx.cultivationGarden.update({
                where: { code: bed.gardenCode },
                data: {
                    totalBeds: { decrement: 1 },
                    activeBeds: { decrement: 1 },
                    totalTrees: { decrement: bed.treeCount },
                },
            });
        });
    }

    async updateTree(
        id: string,
        name?: string,
        ageYear?: number,
        quantity?: number,
        status?: string,
        metadata?: Record<string, unknown>
    ): Promise<CultivationTree> {
        return this.databaseService.cultivationTree.update({
            where: { id },
            data: {
                name,
                ageYear,
                quantity,
                status,
                metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
            },
        });
    }

    async deleteTree(id: string): Promise<void> {
        const tree = await this.databaseService.cultivationTree.findUnique({ where: { id } });
        if (!tree) {
            return;
        }

        await this.databaseService.$transaction(async tx => {
            await tx.cultivationTree.delete({ where: { id } });
            if (tree.bedCode) {
                const bed = await tx.cultivationBed.findUnique({ where: { code: tree.bedCode } });
                if (bed) {
                    await tx.cultivationBed.update({
                        where: { code: tree.bedCode },
                        data: {
                            treeCount: { decrement: tree.quantity },
                        },
                    });

                    await tx.cultivationGarden.update({
                        where: { code: bed.gardenCode },
                        data: {
                            totalTrees: { decrement: tree.quantity },
                        },
                    });
                }
            }
        });
    }

    async getGardensList(userId: string): Promise<CultivationGarden[]> {
        return this.databaseService.cultivationGarden.findMany({
            where: { ownerUserId: userId },
        });
    }

    async getGardenDetail(id: string, userId: string): Promise<CultivationGarden | null> {
        return this.databaseService.cultivationGarden.findFirst({
            where: { id, ownerUserId: userId },
        });
    }

    async getBedDetail(id: string, userId: string): Promise<any | null> {
        const bed = await this.databaseService.cultivationBed.findFirst({
            where: { id, ownerUserId: userId },
        });
        if (!bed) return null;
        const trees = await this.databaseService.cultivationTree.findMany({
            where: { bedCode: bed.code },
        });
        return {
            ...bed,
            trees,
        };
    }

    async getTreeDetail(id: string, userId: string): Promise<any | null> {
        const tree = await this.databaseService.cultivationTree.findFirst({
            where: { id, ownerUserId: userId },
        });
        if (!tree) return null;
        const careLogs = await this.databaseService.cultivationCareLog.findMany({
            where: { treeCode: tree.code },
            orderBy: { loggedAt: 'desc' },
        });
        return {
            ...tree,
            careLogs,
        };
    }
}
