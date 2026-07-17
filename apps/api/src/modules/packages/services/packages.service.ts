import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CarePackage, CultivationTree, ProtectionPackage } from '@generated/prisma-client';
import { DatabaseService } from '@common/database/services/database.service';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import {
    CarePackageCreateRequestDto,
    CarePackageUpdateRequestDto,
    PackageSubscribeRequestDto,
    ProtectionPackageCreateRequestDto,
    ProtectionPackageUpdateRequestDto,
} from '../dtos/packages.dto';

@Injectable()
export class PackagesService {
    constructor(private readonly databaseService: DatabaseService) {}

    // --- Care Packages Admin CRUD ---
    async createCare(dto: CarePackageCreateRequestDto): Promise<IResponseReturn<CarePackage>> {
        const existing = await this.databaseService.carePackage.findUnique({
            where: { code: dto.code },
        });
        if (existing) {
            throw new BadRequestException({
                statusCode: 400,
                message: `Care package with code ${dto.code} already exists`,
            });
        }
        const item = await this.databaseService.carePackage.create({
            data: dto,
        });
        return { data: item };
    }

    async updateCare(id: string, dto: CarePackageUpdateRequestDto): Promise<IResponseReturn<CarePackage>> {
        const item = await this.databaseService.carePackage.findUnique({
            where: { id },
        });
        if (!item) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'Care package not found',
            });
        }
        const updated = await this.databaseService.carePackage.update({
            where: { id },
            data: dto,
        });
        return { data: updated };
    }

    async deleteCare(id: string): Promise<IResponseReturn<{ success: boolean }>> {
        const item = await this.databaseService.carePackage.findUnique({
            where: { id },
        });
        if (!item) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'Care package not found',
            });
        }
        await this.databaseService.carePackage.delete({
            where: { id },
        });
        return { data: { success: true } };
    }

    // --- Protection Packages Admin CRUD ---
    async createProtection(dto: ProtectionPackageCreateRequestDto): Promise<IResponseReturn<ProtectionPackage>> {
        const existing = await this.databaseService.protectionPackage.findUnique({
            where: { code: dto.code },
        });
        if (existing) {
            throw new BadRequestException({
                statusCode: 400,
                message: `Protection package with code ${dto.code} already exists`,
            });
        }
        const item = await this.databaseService.protectionPackage.create({
            data: dto,
        });
        return { data: item };
    }

    async updateProtection(id: string, dto: ProtectionPackageUpdateRequestDto): Promise<IResponseReturn<ProtectionPackage>> {
        const item = await this.databaseService.protectionPackage.findUnique({
            where: { id },
        });
        if (!item) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'Protection package not found',
            });
        }
        const updated = await this.databaseService.protectionPackage.update({
            where: { id },
            data: dto,
        });
        return { data: updated };
    }

    async deleteProtection(id: string): Promise<IResponseReturn<{ success: boolean }>> {
        const item = await this.databaseService.protectionPackage.findUnique({
            where: { id },
        });
        if (!item) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'Protection package not found',
            });
        }
        await this.databaseService.protectionPackage.delete({
            where: { id },
        });
        return { data: { success: true } };
    }

    // --- User List Endpoints ---
    async listCare(): Promise<IResponseReturn<{ items: CarePackage[] }>> {
        const items = await this.databaseService.carePackage.findMany({
            where: { status: 'active' },
        });
        return { data: { items } };
    }

    async listProtection(): Promise<IResponseReturn<{ items: ProtectionPackage[] }>> {
        const items = await this.databaseService.protectionPackage.findMany({
            where: { status: 'active' },
        });
        return { data: { items } };
    }

    // --- User Subscribe Endpoint ---
    async subscribe(userId: string, dto: PackageSubscribeRequestDto): Promise<IResponseReturn<CultivationTree>> {
        // Validate user owns the tree
        const tree = await this.databaseService.cultivationTree.findUnique({
            where: { code: dto.treeCode },
        });
        if (!tree) {
            throw new NotFoundException({
                statusCode: 404,
                message: `Tree with code ${dto.treeCode} not found`,
            });
        }
        if (tree.ownerUserId !== userId) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'You do not own this tree',
            });
        }

        // Get package price & config
        let price = 0;
        let durationMonths = 12; // default 12 months for protection
        if (dto.type === 'care') {
            const pack = await this.databaseService.carePackage.findUnique({
                where: { code: dto.packageCode },
            });
            if (!pack || pack.status !== 'active') {
                throw new NotFoundException({
                    statusCode: 404,
                    message: 'Active care package not found',
                });
            }
            price = pack.price;
            durationMonths = pack.durationMonths;
        } else {
            const pack = await this.databaseService.protectionPackage.findUnique({
                where: { code: dto.packageCode },
            });
            if (!pack || pack.status !== 'active') {
                throw new NotFoundException({
                    statusCode: 404,
                    message: 'Active protection package not found',
                });
            }
            price = pack.price;
        }

        const pointsNeeded = Math.ceil(price / 10000);

        // Transaction to deduct wallet points and register subscription
        const result = await this.databaseService.$transaction(async tx => {
            const wallet = await tx.walletAccount.findUnique({
                where: { userId },
            });
            if (!wallet || wallet.balancePoint < pointsNeeded) {
                throw new BadRequestException({
                    statusCode: 400,
                    message: `Insufficient wallet balance. Needed: ${pointsNeeded} points, Available: ${wallet?.balancePoint || 0} points`,
                });
            }

            // Deduct points
            const updatedWallet = await tx.walletAccount.update({
                where: { id: wallet.id },
                data: {
                    balancePoint: {
                        decrement: pointsNeeded,
                    },
                },
            });

            // Log transaction
            await tx.walletTransaction.create({
                data: {
                    code: 'TXN' + Date.now() + Math.floor(1000 + Math.random() * 9000),
                    userId,
                    type: 'subscribe',
                    title: `Đăng ký gói ${dto.type === 'care' ? 'chăm sóc' : 'bảo vệ'} sâm`,
                    amount: -pointsNeeded,
                    balanceAfter: updatedWallet.balancePoint,
                    status: 'success',
                },
            });

            // Update tree Care/Protection info
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

            const updatedTree = await tx.cultivationTree.update({
                where: { id: tree.id },
                data: dto.type === 'care'
                    ? {
                        carePackageCode: dto.packageCode,
                        carePackageExpiredAt: expiryDate,
                      }
                    : {
                        protectionPackageCode: dto.packageCode,
                        protectionPackageExpiredAt: expiryDate,
                      },
            });

            return updatedTree;
        });

        return { data: result };
    }
}
