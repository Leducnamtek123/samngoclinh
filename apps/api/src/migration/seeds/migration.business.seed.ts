import { EnumAppEnvironment } from '@app/enums/app.enum';
import { DatabaseService } from '@common/database/services/database.service';
import { MigrationSeedBase } from '@migration/bases/migration.seed.base';
import { migrationBusinessData } from '@migration/data/migration.business.data';
import { IMigrationSeed } from '@migration/interfaces/migration.seed.interface';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Command } from 'nest-commander';
import { Prisma } from '@generated/prisma-client';

@Command({
    name: 'business',
    description: 'Seed/Remove Business Data',
    allowUnknownOptions: false,
})
@Injectable()
export class MigrationBusinessSeed
    extends MigrationSeedBase
    implements IMigrationSeed
{
    private readonly logger = new Logger(MigrationBusinessSeed.name);
    private readonly env: EnumAppEnvironment;
    private readonly data: (typeof migrationBusinessData)[EnumAppEnvironment];

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly configService: ConfigService
    ) {
        super();

        this.env = this.configService.get<EnumAppEnvironment>('app.env')!;
        this.data = migrationBusinessData[this.env];
    }

    async seed(): Promise<void> {
        this.logger.log('Seeding business data...');

        const provider = await this.databaseService.user.findFirst({
            where: { email: 'admin@mail.com' },
            select: { id: true },
        });

        if (!provider) {
            this.logger.warn(
                'Provider user not found. Run core migrations before business seed.'
            );
            return;
        }

        try {
            await this.databaseService.$transaction([
                ...this.data.catalogPlants.map(item =>
                    this.databaseService.catalogPlant.upsert({
                        where: { code: item.code },
                        create: {
                            ...item,
                            createdBy: provider.id,
                        },
                        update: {
                            ...item,
                            updatedBy: provider.id,
                        },
                    })
                ),
                ...this.data.catalogProducts.map(item =>
                    this.databaseService.catalogProduct.upsert({
                        where: { code: item.code },
                        create: {
                            ...item,
                            createdBy: provider.id,
                        },
                        update: {
                            ...item,
                            updatedBy: provider.id,
                        },
                    })
                ),
                ...this.data.promotionCampaigns.map(item =>
                    this.databaseService.promotionCampaign.upsert({
                        where: { code: item.code },
                        create: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            createdBy: provider.id,
                        },
                        update: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            updatedBy: provider.id,
                        },
                    })
                ),
                ...this.data.marketplaceListings.map(item =>
                    this.databaseService.marketplaceListing.upsert({
                        where: { code: item.code },
                        create: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            createdBy: provider.id,
                        },
                        update: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            updatedBy: provider.id,
                        },
                    })
                ),
                ...this.data.contentArticles.map(item =>
                    this.databaseService.contentArticle.upsert({
                        where: { slug: item.slug },
                        create: {
                            ...item,
                        },
                        update: {
                            ...item,
                        },
                    })
                ),
                ...this.data.cultivationGardens.map(item =>
                    this.databaseService.cultivationGarden.upsert({
                        where: { code: item.code },
                        create: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            ownerUserId: provider.id,
                            createdBy: provider.id,
                        },
                        update: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            ownerUserId: provider.id,
                            updatedBy: provider.id,
                        },
                    })
                ),
                ...this.data.cultivationBeds.map(item =>
                    this.databaseService.cultivationBed.upsert({
                        where: { code: item.code },
                        create: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            ownerUserId: provider.id,
                            createdBy: provider.id,
                        },
                        update: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            ownerUserId: provider.id,
                            updatedBy: provider.id,
                        },
                    })
                ),
                ...this.data.cultivationTrees.map(item =>
                    this.databaseService.cultivationTree.upsert({
                        where: { code: item.code },
                        create: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            ownerUserId: provider.id,
                            createdBy: provider.id,
                        },
                        update: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            ownerUserId: provider.id,
                            updatedBy: provider.id,
                        },
                    })
                ),
                ...this.data.walletAccounts.map(item =>
                    this.databaseService.walletAccount.upsert({
                        where: { userId: provider.id },
                        create: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            userId: provider.id,
                            createdBy: provider.id,
                        },
                        update: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            updatedBy: provider.id,
                        },
                    })
                ),
                ...this.data.walletTransactions.map(item =>
                    this.databaseService.walletTransaction.upsert({
                        where: { code: item.code },
                        create: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            userId: provider.id,
                            createdBy: provider.id,
                        },
                        update: {
                            ...item,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            userId: provider.id,
                            updatedBy: provider.id,
                        },
                    })
                ),
                ...this.data.orders.map(item =>
                    this.databaseService.order.upsert({
                        where: { code: item.code },
                        create: {
                            ...item,
                            items: item.items as Prisma.InputJsonValue,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            userId: provider.id,
                            createdBy: provider.id,
                        },
                        update: {
                            ...item,
                            items: item.items as Prisma.InputJsonValue,
                            metadata: item.metadata as Prisma.InputJsonValue,
                            userId: provider.id,
                            updatedBy: provider.id,
                        },
                    })
                ),
                this.databaseService.businessProfile.upsert({
                    where: { userId: provider.id },
                    create: {
                        ...this.data.businessProfile,
                        metadata: this.data.businessProfile
                            .metadata as Prisma.InputJsonValue,
                        userId: provider.id,
                        createdBy: provider.id,
                    },
                    update: {
                        ...this.data.businessProfile,
                        metadata: this.data.businessProfile
                            .metadata as Prisma.InputJsonValue,
                        updatedBy: provider.id,
                    },
                }),
            ]);
        } catch (error: unknown) {
            this.logger.error(error, 'Error seeding business data');
            throw error;
        }

        this.logger.log('Business data seeded successfully.');
    }

    async remove(): Promise<void> {
        this.logger.log('Removing business data...');

        try {
            await this.databaseService.$transaction([
                this.databaseService.order.deleteMany({}),
                this.databaseService.walletTransaction.deleteMany({}),
                this.databaseService.walletAccount.deleteMany({}),
                this.databaseService.cultivationTree.deleteMany({}),
                this.databaseService.cultivationBed.deleteMany({}),
                this.databaseService.cultivationGarden.deleteMany({}),
                this.databaseService.contentArticle.deleteMany({}),
                this.databaseService.marketplaceListing.deleteMany({}),
                this.databaseService.promotionCampaign.deleteMany({}),
                this.databaseService.catalogProduct.deleteMany({}),
                this.databaseService.catalogPlant.deleteMany({}),
                this.databaseService.businessProfile.deleteMany({}),
            ]);
        } catch (error: unknown) {
            this.logger.error(error, 'Error removing business data');
            throw error;
        }

        this.logger.log('Business data removed successfully.');
    }
}
