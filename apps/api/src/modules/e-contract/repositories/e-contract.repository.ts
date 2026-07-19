import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EContract } from '@generated/prisma-client';
import { EContractCreateRequestDto } from '@modules/e-contract/dtos/request/e-contract.create.request.dto';
import { EContractUpdateRequestDto } from '@modules/e-contract/dtos/request/e-contract.update.request.dto';
import { PaginationService } from '@common/pagination/services/pagination.service';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';
import { IResponsePagingReturn } from '@common/response/interfaces/response.interface';

@Injectable()
export class EContractRepository {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly paginationService: PaginationService
    ) {}

    async createContract(payload: EContractCreateRequestDto): Promise<EContract> {
        const code = 'CTR' + Math.random().toString(36).substring(2, 11).toUpperCase();
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

    async getContractById(id: string): Promise<EContract | null> {
        return this.databaseService.eContract.findUnique({
            where: { id },
        });
    }

    async getContractByCode(code: string): Promise<EContract | null> {
        return this.databaseService.eContract.findUnique({
            where: { code },
        });
    }

    async listContracts(userId?: string): Promise<EContract[]> {
        return this.databaseService.eContract.findMany({
            where: userId ? { userId } : undefined,
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

    async signContract(id: string, signatureUrl: string, metadata?: Record<string, unknown>): Promise<EContract> {
        return this.databaseService.eContract.update({
            where: { id },
            data: {
                status: 'signed',
                signedAt: new Date(),
                signatureUrl,
                metadata: metadata as Prisma.InputJsonValue,
            },
        });
    }

    async renewContract(id: string, newExpiredAt: Date, metadata?: Record<string, unknown>): Promise<EContract> {
        return this.databaseService.eContract.update({
            where: { id },
            data: {
                status: 'signed',
                expiredAt: newExpiredAt,
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
                status: payload.status,
                contractValue: payload.contractValue,
                paymentStatus: payload.paymentStatus,
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

    async deleteContract(id: string): Promise<boolean> {
        await this.databaseService.eContract.delete({
            where: { id },
        });
        return true;
    }

    async getExpiringContracts(daysLimit: number): Promise<EContract[]> {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysLimit);

        return this.databaseService.eContract.findMany({
            where: {
                status: 'signed',
                expiredAt: {
                    lte: thresholdDate,
                    gte: new Date(),
                },
            },
        });
    }
}
