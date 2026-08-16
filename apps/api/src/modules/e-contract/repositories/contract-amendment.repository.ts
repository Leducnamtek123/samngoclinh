import { DatabaseService } from '@common/database/services/database.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ContractAmendment } from '@generated/prisma-client';

@Injectable()
export class ContractAmendmentRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async createAmendment(data: {
        contractId: string;
        amendmentNumber: number;
        code: string;
        type?: string;
        title: string;
        content: string;
        previousExpiredAt: Date;
        newExpiredAt: Date;
        extendedMonths: number;
        amendmentValue?: number;
        status?: string;
        metadata?: Record<string, unknown>;
    }): Promise<ContractAmendment> {
        return this.databaseService.contractAmendment.create({
            data: {
                contractId: data.contractId,
                amendmentNumber: data.amendmentNumber,
                code: data.code,
                type: data.type ?? 'extension',
                title: data.title,
                content: data.content,
                previousExpiredAt: data.previousExpiredAt,
                newExpiredAt: data.newExpiredAt,
                extendedMonths: data.extendedMonths,
                amendmentValue: data.amendmentValue ?? 0,
                status: data.status ?? 'pending',
                metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
            },
        });
    }

    async findById(id: string): Promise<ContractAmendment | null> {
        return this.databaseService.contractAmendment.findUnique({
            where: { id },
            include: {
                contract: true,
            },
        });
    }

    async findByCode(code: string): Promise<ContractAmendment | null> {
        return this.databaseService.contractAmendment.findUnique({
            where: { code },
            include: {
                contract: true,
            },
        });
    }

    async findByContractId(contractId: string): Promise<ContractAmendment[]> {
        return this.databaseService.contractAmendment.findMany({
            where: { contractId },
            orderBy: { amendmentNumber: 'asc' },
        });
    }

    async findLatestSigned(contractId: string): Promise<ContractAmendment | null> {
        return this.databaseService.contractAmendment.findFirst({
            where: {
                contractId,
                status: 'signed',
            },
            orderBy: { amendmentNumber: 'desc' },
        });
    }

    async getNextAmendmentNumber(contractId: string): Promise<number> {
        const latest = await this.databaseService.contractAmendment.findFirst({
            where: { contractId },
            orderBy: { amendmentNumber: 'desc' },
            select: { amendmentNumber: true },
        });
        return (latest?.amendmentNumber ?? 0) + 1;
    }

    async updatePending(id: string, data: {
        title?: string;
        content?: string;
        newExpiredAt?: Date;
        extendedMonths?: number;
        amendmentValue?: number;
        metadata?: Record<string, unknown>;
    }): Promise<ContractAmendment> {
        const existing = await this.findById(id);
        if (!existing) {
            throw new NotFoundException('Contract amendment not found');
        }

        // Domain Invariant INV-10: Signed amendment is immutable
        if (existing.status === 'signed') {
            throw new BadRequestException('Signed contract amendment is immutable and cannot be modified.');
        }

        return this.databaseService.contractAmendment.update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                newExpiredAt: data.newExpiredAt,
                extendedMonths: data.extendedMonths,
                amendmentValue: data.amendmentValue,
                metadata: data.metadata as Prisma.InputJsonValue,
            },
        });
    }

    async markSigned(
        id: string,
        signatureUrl: string,
        pdfUrl: string,
        metadata?: Record<string, unknown>
    ): Promise<ContractAmendment> {
        const existing = await this.findById(id);
        if (!existing) {
            throw new NotFoundException('Contract amendment not found');
        }

        if (existing.status === 'signed') {
            throw new BadRequestException('Phụ lục hợp đồng này đã được ký kết trước đó.');
        }

        if (existing.status !== 'pending') {
            throw new BadRequestException(`Không thể ký phụ lục ở trạng thái "${existing.status}".`);
        }

        return this.databaseService.contractAmendment.update({
            where: { id },
            data: {
                status: 'signed',
                signedAt: new Date(),
                signatureUrl,
                pdfUrl,
                metadata: metadata as Prisma.InputJsonValue,
            },
        });
    }

    async cancelPending(id: string): Promise<ContractAmendment> {
        const existing = await this.findById(id);
        if (!existing) {
            throw new NotFoundException('Contract amendment not found');
        }

        if (existing.status === 'signed') {
            throw new BadRequestException('Signed contract amendment cannot be cancelled.');
        }

        return this.databaseService.contractAmendment.update({
            where: { id },
            data: {
                status: 'cancelled',
            },
        });
    }

    async deleteAmendment(id: string): Promise<boolean> {
        const existing = await this.findById(id);
        if (!existing) {
            throw new NotFoundException('Contract amendment not found');
        }

        // Domain Invariant INV-02: Signed amendment cannot be deleted
        if (existing.status === 'signed') {
            throw new BadRequestException('Signed contract amendment cannot be deleted.');
        }

        await this.databaseService.contractAmendment.delete({
            where: { id },
        });
        return true;
    }
}
