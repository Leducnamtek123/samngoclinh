import { DatabaseService } from '@common/database/services/database.service';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EContract } from '@generated/prisma-client';
import { EContractCreateRequestDto } from '@modules/e-contract/dtos/request/e-contract.create.request.dto';
import { EContractUpdateRequestDto } from '@modules/e-contract/dtos/request/e-contract.update.request.dto';
import { PaginationService } from '@common/pagination/services/pagination.service';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';
import { IResponsePagingReturn } from '@common/response/interfaces/response.interface';

@Injectable()
export class EContractRepository {
    private readonly logger = new Logger(EContractRepository.name);

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly paginationService: PaginationService
    ) {}

    async generateNextCode(year = new Date().getFullYear()): Promise<string> {
        const prefix = `HĐ-SNL-${year}`;
        const count = await this.databaseService.eContract.count({
            where: {
                code: {
                    startsWith: prefix,
                },
            },
        });
        const sequence = (count + 1).toString().padStart(4, '0');
        let generatedCode = `${prefix}/${sequence}`;

        let probe = 0;
        while (probe < 10) {
            const exists = await this.databaseService.eContract.findUnique({
                where: { code: generatedCode },
                select: { id: true },
            });
            if (!exists) {
                return generatedCode;
            }
            probe++;
            const fallbackSeq = (count + 1 + probe).toString().padStart(4, '0');
            generatedCode = `${prefix}/${fallbackSeq}`;
        }

        return `${prefix}/${Date.now().toString().slice(-6)}`;
    }

    async createContract(payload: EContractCreateRequestDto & { code?: string }): Promise<EContract> {
        const code = payload.code || (await this.generateNextCode());
        return this.databaseService.eContract.create({
            data: {
                code,
                userId: payload.userId,
                treeCode: payload.treeCode ?? null,
                title: payload.title,
                content: payload.content,
                status: 'pending',
                contractValue: payload.contractValue,
                paymentStatus: payload.paymentStatus ?? 'unpaid',
                expiredAt: new Date(payload.expiredAt),
                contractType: payload.contractType ?? 'purchase',
                partyA: payload.partyA ?? 'Sâm Ngọc Linh Farm',
                partyB: payload.partyB ?? null,
                pdfUrl: payload.pdfUrl ?? null,
                terms: payload.terms ?? null,
                metadata: (payload.metadata ?? {}) as Prisma.InputJsonValue,
            },
        });
    }

    async getContractById(id: string): Promise<any | null> {
        try {
            return await this.databaseService.eContract.findUnique({
                where: { id },
                include: {
                    items: true,
                    order: true,
                    amendments: {
                        orderBy: { amendmentNumber: 'asc' },
                    },
                },
            });
        } catch (error) {
            this.logger.warn(`Fallback getContractById(${id}) without includes: ${error}`);
            return this.databaseService.eContract.findUnique({
                where: { id },
            });
        }
    }

    async getContractByCode(code: string): Promise<any | null> {
        try {
            const direct = await this.databaseService.eContract.findUnique({
                where: { code },
                include: {
                    items: true,
                    order: true,
                    amendments: {
                        orderBy: { amendmentNumber: 'asc' },
                    },
                },
            });
            if (direct) return direct;

            return await this.databaseService.eContract.findFirst({
                where: {
                    OR: [
                        { id: code },
                        { code: code },
                        { code: code.replace(/^HD-/, 'CTR-') },
                        { code: code.replace(/^CTR-/, 'HD-') },
                        { code: { contains: code } },
                    ],
                },
                include: {
                    items: true,
                    order: true,
                    amendments: {
                        orderBy: { amendmentNumber: 'asc' },
                    },
                },
            });
        } catch (error) {
            this.logger.warn(`Fallback getContractByCode(${code}) without includes: ${error}`);
            return this.databaseService.eContract.findFirst({
                where: {
                    OR: [
                        { id: code },
                        { code: code },
                        { code: { contains: code } },
                    ],
                },
            });
        }
    }

    async listContracts(userId?: string): Promise<any[]> {
        return this.databaseService.eContract.findMany({
            where: userId ? { userId } : undefined,
            include: {
                items: true,
                order: true,
                amendments: {
                    orderBy: { amendmentNumber: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async listContractsPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.EContractSelect,
            Prisma.EContractWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<EContract>> {
        const { where, ...params } = pagination;
        return this.paginationService.offset<
            EContract,
            Prisma.EContractSelect,
            Prisma.EContractWhereInput
        >(this.databaseService.eContract, {
            ...params,
            where: {
                ...where,
                ...status,
            },
        });
    }

    async signContract(id: string, signatureUrl: string, pdfUrl?: string, metadata?: Record<string, unknown>): Promise<EContract> {
        return this.databaseService.eContract.update({
            where: { id },
            data: {
                status: 'signed',
                signedAt: new Date(),
                signatureUrl,
                pdfUrl: pdfUrl ?? undefined,
                metadata: metadata as Prisma.InputJsonValue,
            },
        });
    }

    async updateContract(id: string, payload: EContractUpdateRequestDto): Promise<EContract> {
        return this.databaseService.eContract.update({
            where: { id },
            data: {
                title: payload.title,
                content: payload.content,
                contractValue: payload.contractValue,
                expiredAt: payload.expiredAt ? new Date(payload.expiredAt) : undefined,
                contractType: payload.contractType,
                partyA: payload.partyA,
                partyB: payload.partyB,
                pdfUrl: payload.pdfUrl,
                terms: payload.terms,
                metadata: payload.metadata as Prisma.InputJsonValue,
            },
        });
    }

    async updateStatus(id: string, status: string, additionalData?: Prisma.EContractUpdateInput): Promise<EContract> {
        return this.databaseService.eContract.update({
            where: { id },
            data: {
                status,
                ...additionalData,
            },
        });
    }

    async deleteContract(id: string): Promise<boolean> {
        await this.databaseService.eContract.delete({
            where: { id },
        });
        return true;
    }

    async getExpiringContracts(daysLimit: number): Promise<any[]> {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysLimit);
        const now = new Date();

        const activeContracts = await this.databaseService.eContract.findMany({
            where: {
                status: 'signed',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                amendments: {
                    where: { status: 'signed' },
                    orderBy: { amendmentNumber: 'desc' },
                    take: 1,
                },
            },
        });

        return activeContracts.filter((c: any) => {
            const latestAmendment = c.amendments?.[0];
            const effectiveExpiry = latestAmendment ? new Date(latestAmendment.newExpiredAt) : new Date(c.expiredAt);
            return effectiveExpiry >= now && effectiveExpiry <= thresholdDate;
        });
    }

    async getOverdueExpiredContracts(): Promise<any[]> {
        const now = new Date();
        const activeContracts = await this.databaseService.eContract.findMany({
            where: {
                status: 'signed',
            },
            include: {
                amendments: {
                    where: { status: 'signed' },
                    orderBy: { amendmentNumber: 'desc' },
                    take: 1,
                },
            },
        });

        return activeContracts.filter((c: any) => {
            const latestAmendment = c.amendments?.[0];
            const effectiveExpiry = latestAmendment ? new Date(latestAmendment.newExpiredAt) : new Date(c.expiredAt);
            return effectiveExpiry < now;
        });
    }
}
