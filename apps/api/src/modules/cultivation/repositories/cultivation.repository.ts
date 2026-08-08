import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
    ICultivationBedDetail,
    ICultivationBedItem,
    ICultivationBedLocationsGenerateResult,
    ICultivationGardenSummary,
    ICultivationPublicBedDetail,
    ICultivationPublicBedItem,
    ICultivationTreeAgeItem,
    ICultivationTreeDetail,
} from '@modules/cultivation/interfaces/cultivation.interface';
import { CultivationBed, CultivationBedLocation, CultivationCareLog, CultivationGarden, CultivationTree, GardenBooking } from '@generated/prisma-client';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';
import { CultivationCreateCareLogRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-care-log.request.dto';
import { CultivationCreateBookingRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-booking.request.dto';
import { CultivationUpdateBookingStatusRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-booking-status.request.dto';
import { CultivationUpdateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-garden.request.dto';
import { CultivationUpdateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-bed.request.dto';
import { CultivationUpdateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-tree.request.dto';
import { PaginationService } from '@common/pagination/services/pagination.service';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';
import { IResponsePagingReturn } from '@common/response/interfaces/response.interface';

@Injectable()
export class CultivationRepository {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly paginationService: PaginationService
    ) {}

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

    async getBeds(userId: string, isAdmin?: boolean): Promise<ICultivationBedItem[]> {
        const beds = await this.databaseService.cultivationBed.findMany({
            where: isAdmin ? {} : { ownerUserId: userId },
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

    async getBedsPaginated(
        userId: string,
        isAdmin: boolean,
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationBedSelect,
            Prisma.CultivationBedWhereInput
        >,
        status?: Record<string, IPaginationEqual>,
        gardenCode?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CultivationBed>> {
        const { where, ...params } = pagination;
        return this.paginationService.offset<
            CultivationBed,
            Prisma.CultivationBedSelect,
            Prisma.CultivationBedWhereInput
        >(this.databaseService.cultivationBed, {
            ...params,
            where: {
                ...where,
                ...status,
                ...gardenCode,
                ...(isAdmin ? {} : { ownerUserId: userId }),
            },
        });
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
                location: payload.location ?? null,
                description: payload.description ?? null,
                area: payload.area ?? null,
                images: payload.images ?? [],
                latitude: payload.latitude ?? null,
                longitude: payload.longitude ?? null,
                managerName: payload.managerName ?? null,
                managerPhone: payload.managerPhone ?? null,
                establishedAt: payload.establishedAt ? new Date(payload.establishedAt) : null,
                maxBeds: payload.maxBeds ?? 0,
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
                    maxTrees: payload.maxTrees ?? 0,
                    width: payload.width ?? null,
                    length: payload.length ?? null,
                    soilType: payload.soilType ?? null,
                    lastFertilizedAt: payload.lastFertilizedAt ? new Date(payload.lastFertilizedAt) : null,
                    lastWateredAt: payload.lastWateredAt ? new Date(payload.lastWateredAt) : null,
                    description: payload.description ?? null,
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
        const ownerId = payload.ownerUserId || userId;
        return this.databaseService.$transaction(async (tx) => {
            const tree = await tx.cultivationTree.create({
                data: {
                    code,
                    bedCode: payload.bedCode ?? null,
                    ownerUserId: ownerId,
                    name: payload.name,
                    ageYear: payload.ageYear,
                    quantity: payload.quantity,
                    status: 'active',
                    plantedAt: payload.plantedAt ? new Date(payload.plantedAt) : null,
                    healthStatus: payload.healthStatus ?? 'healthy',
                    lastCareDate: payload.lastCareDate ? new Date(payload.lastCareDate) : null,
                    nextCareDate: payload.nextCareDate ? new Date(payload.nextCareDate) : null,
                    expectedHarvestAt: payload.expectedHarvestAt ? new Date(payload.expectedHarvestAt) : null,
                    images: payload.images ?? [],
                    priceBought: payload.priceBought ?? 0,
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

    async updateGarden(id: string, payload: CultivationUpdateGardenRequestDto): Promise<CultivationGarden> {
        return this.databaseService.cultivationGarden.update({
            where: { id },
            data: {
                name: payload.name,
                location: payload.location,
                description: payload.description,
                area: payload.area,
                images: payload.images,
                latitude: payload.latitude,
                longitude: payload.longitude,
                managerName: payload.managerName,
                managerPhone: payload.managerPhone,
                establishedAt: payload.establishedAt ? new Date(payload.establishedAt) : undefined,
                maxBeds: payload.maxBeds,
                metadata: payload.metadata ? (payload.metadata as Prisma.InputJsonValue) : undefined,
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

    async updateBed(
        id: string,
        payload: CultivationUpdateBedRequestDto
    ): Promise<CultivationBed> {
        return this.databaseService.$transaction(async (tx) => {
            const oldBed = await tx.cultivationBed.findUnique({
                where: { id },
            });

            if (!oldBed) {
                throw new Error('Bed not found');
            }

            const updatedBed = await tx.cultivationBed.update({
                where: { id },
                data: {
                    name: payload.name,
                    ageYear: payload.ageYear,
                    treeCount: payload.treeCount,
                    status: payload.status,
                    maxTrees: payload.maxTrees,
                    width: payload.width,
                    length: payload.length,
                    soilType: payload.soilType,
                    lastFertilizedAt: payload.lastFertilizedAt ? new Date(payload.lastFertilizedAt) : undefined,
                    lastWateredAt: payload.lastWateredAt ? new Date(payload.lastWateredAt) : undefined,
                    description: payload.description,
                    metadata: payload.metadata ? (payload.metadata as Prisma.InputJsonValue) : undefined,
                },
            });

            if (payload.status && payload.status !== oldBed.status) {
                if (payload.status === 'active') {
                    await tx.cultivationGarden.update({
                        where: { code: oldBed.gardenCode },
                        data: { activeBeds: { increment: 1 } },
                    });
                } else if (oldBed.status === 'active') {
                    await tx.cultivationGarden.update({
                        where: { code: oldBed.gardenCode },
                        data: { activeBeds: { decrement: 1 } },
                    });
                }
            }

            return updatedBed;
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
        payload: CultivationUpdateTreeRequestDto
    ): Promise<CultivationTree> {
        return this.databaseService.cultivationTree.update({
            where: { id },
            data: {
                name: payload.name,
                ageYear: payload.ageYear,
                quantity: payload.quantity,
                status: payload.status,
                ownerUserId: payload.ownerUserId,
                plantedAt: payload.plantedAt ? new Date(payload.plantedAt) : undefined,
                healthStatus: payload.healthStatus,
                lastCareDate: payload.lastCareDate ? new Date(payload.lastCareDate) : undefined,
                nextCareDate: payload.nextCareDate ? new Date(payload.nextCareDate) : undefined,
                expectedHarvestAt: payload.expectedHarvestAt ? new Date(payload.expectedHarvestAt) : undefined,
                images: payload.images,
                priceBought: payload.priceBought,
                metadata: payload.metadata ? (payload.metadata as Prisma.InputJsonValue) : undefined,
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

    async getGardensPaginated(
        userId: string,
        isAdmin: boolean,
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationGardenSelect,
            Prisma.CultivationGardenWhereInput
        >
    ): Promise<IResponsePagingReturn<CultivationGarden>> {
        const { where, ...params } = pagination;
        return this.paginationService.offset<
            CultivationGarden,
            Prisma.CultivationGardenSelect,
            Prisma.CultivationGardenWhereInput
        >(this.databaseService.cultivationGarden, {
            ...params,
            where: {
                ...where,
                ...(isAdmin ? {} : { ownerUserId: userId }),
            },
        });
    }

    async getGardensList(userId: string, isAdmin?: boolean): Promise<CultivationGarden[]> {
        return this.databaseService.cultivationGarden.findMany({
            where: isAdmin ? {} : { ownerUserId: userId },
        });
    }

    async getGardenDetail(id: string, userId: string, isAdmin?: boolean): Promise<CultivationGarden | null> {
        return this.databaseService.cultivationGarden.findFirst({
            where: isAdmin ? { id } : { id, ownerUserId: userId },
        });
    }

    async getBedDetail(id: string, userId: string, isAdmin?: boolean): Promise<ICultivationBedDetail | null> {
        const bed = await this.databaseService.cultivationBed.findFirst({
            where: isAdmin ? { id } : { id, ownerUserId: userId },
        });
        if (!bed) {return null;}
        const trees = await this.databaseService.cultivationTree.findMany({
            where: { bedCode: bed.code },
        });
        return {
            ...bed,
            trees,
        };
    }

    async getTreeDetail(id: string, userId: string, isAdmin?: boolean): Promise<ICultivationTreeDetail | null> {
        const tree = await this.databaseService.cultivationTree.findFirst({
            where: isAdmin ? { id } : { id, ownerUserId: userId },
        });
        if (!tree) {return null;}
        const careLogs = await this.databaseService.cultivationCareLog.findMany({
            where: { treeCode: tree.code },
            orderBy: { loggedAt: 'desc' },
        });
        return {
            ...tree,
            careLogs,
        };
    }

    async getBedLocations(bedCode: string): Promise<CultivationBedLocation[]> {
        return this.databaseService.cultivationBedLocation.findMany({
            where: { bedCode },
            orderBy: [{ row: 'asc' }, { col: 'asc' }],
        });
    }

    async generateBedLocations(bedCode: string, rows: number, cols: number): Promise<ICultivationBedLocationsGenerateResult> {
        return this.databaseService.$transaction(async (tx) => {
            await tx.cultivationBedLocation.deleteMany({
                where: { bedCode },
            });

            const dataToInsert = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    dataToInsert.push({
                        code: `${bedCode}-l-${r}-${c}`,
                        bedCode,
                        row: r,
                        col: c,
                        status: 'empty',
                    });
                }
            }

            if (dataToInsert.length > 0) {
                await tx.cultivationBedLocation.createMany({
                    data: dataToInsert,
                });
            }

            return { count: dataToInsert.length };
        });
    }

    async updateBedLocation(id: string, status: string, treeCode?: string): Promise<CultivationBedLocation> {
        return this.databaseService.cultivationBedLocation.update({
            where: { id },
            data: {
                status,
                treeCode: treeCode !== undefined ? treeCode : undefined,
            },
        });
    }

    async deleteBedLocation(id: string): Promise<void> {
        await this.databaseService.cultivationBedLocation.delete({
            where: { id },
        });
    }

    async listAllTreesAdmin(): Promise<CultivationTree[]> {
        return this.databaseService.cultivationTree.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async listAllTreesAdminPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationTreeSelect,
            Prisma.CultivationTreeWhereInput
        >,
        status?: Record<string, IPaginationEqual>,
        health?: Record<string, IPaginationEqual>,
        ownerUserId?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CultivationTree>> {
        const { where, ...params } = pagination;
        return this.paginationService.offset<
            CultivationTree,
            Prisma.CultivationTreeSelect,
            Prisma.CultivationTreeWhereInput
        >(this.databaseService.cultivationTree, {
            ...params,
            where: {
                ...where,
                ...status,
                ...health,
                ...ownerUserId,
            },
        });
    }

    async listPublicBedsByAge(ageYear?: number | null): Promise<ICultivationPublicBedItem[]> {
        const beds = await this.databaseService.cultivationBed.findMany({
            where: { 
                ...(ageYear != null ? { ageYear } : {}), 
                status: 'active' 
            },
            orderBy: { name: 'asc' },
        });
        if (beds.length === 0) {
            return [];
        }

        const gardenCodes = [...new Set(beds.map(b => b.gardenCode))];
        const gardens = await this.databaseService.cultivationGarden.findMany({
            where: { code: { in: gardenCodes } },
            select: { code: true, name: true, images: true },
        });
        const gardenMap = new Map(gardens.map(g => [g.code, g]));

        const catalog = ageYear != null 
            ? await this.databaseService.catalogPlant.findFirst({
                where: { ageYear },
                select: { price: true, images: true },
              })
            : null;

        return beds.map(b => {
            const garden = gardenMap.get(b.gardenCode);
            const images = garden?.images.length ? garden.images : (catalog?.images ?? []);
            return {
                code: b.code,
                name: b.name,
                gardenCode: b.gardenCode,
                gardenName: garden?.name ?? '',
                ageYear: b.ageYear,
                treeCount: b.treeCount,
                price: catalog?.price ?? 0,
                images,
                status: b.status,
            };
        });
    }

    async getPublicBedDetail(code: string): Promise<ICultivationPublicBedDetail | null> {
        const bed = await this.databaseService.cultivationBed.findFirst({
            where: { code, status: 'active' },
        });
        if (!bed) {
            return null;
        }

        const [garden, tree, careLogs, catalog] = await Promise.all([
            this.databaseService.cultivationGarden.findUnique({
                where: { code: bed.gardenCode },
                select: { name: true, images: true },
            }),
            this.databaseService.cultivationTree.findFirst({
                where: { bedCode: bed.code },
                orderBy: { createdAt: 'asc' },
            }),
            this.databaseService.cultivationCareLog.findMany({
                where: { bedCode: bed.code },
                orderBy: { loggedAt: 'desc' },
                take: 20,
            }),
            this.databaseService.catalogPlant.findFirst({
                where: { ageYear: bed.ageYear },
                select: { price: true, images: true, description: true },
            }),
        ]);

        const images = garden?.images.length ? garden.images : (catalog?.images ?? []);

        return {
            code: bed.code,
            name: bed.name,
            gardenCode: bed.gardenCode,
            gardenName: garden?.name ?? '',
            ageYear: bed.ageYear,
            treeCount: bed.treeCount,
            status: bed.status,
            price: catalog?.price ?? 0,
            plantedAt: tree?.plantedAt ?? null,
            healthStatus: tree?.healthStatus ?? null,
            images,
            description: catalog?.description ?? bed.description,
            careLogs,
        };
    }
}
