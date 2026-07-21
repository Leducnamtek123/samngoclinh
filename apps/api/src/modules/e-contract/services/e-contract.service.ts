import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IResponseReturn, IResponsePagingReturn } from '@common/response/interfaces/response.interface';
import { IEContractService } from '@modules/e-contract/interfaces/e-contract.service.interface';
import { EContractRepository } from '@modules/e-contract/repositories/e-contract.repository';
import { EContract, Prisma } from '@generated/prisma-client';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';
import { EContractCreateRequestDto } from '@modules/e-contract/dtos/request/e-contract.create.request.dto';
import { EContractSignRequestDto } from '@modules/e-contract/dtos/request/e-contract.sign.request.dto';
import { EContractRenewRequestDto } from '@modules/e-contract/dtos/request/e-contract.renew.request.dto';
import { EContractUpdateRequestDto } from '@modules/e-contract/dtos/request/e-contract.update.request.dto';

@Injectable()
export class EContractService implements IEContractService {
    private readonly logger = new Logger(EContractService.name);

    constructor(private readonly eContractRepository: EContractRepository) {}

    async createContract(payload: EContractCreateRequestDto): Promise<IResponseReturn<EContract>> {
        const contract = await this.eContractRepository.createContract(payload);
        return {
            data: contract,
        };
    }

    async getContract(id: string, userId?: string): Promise<IResponseReturn<EContract>> {
        const contract = await this.eContractRepository.getContractById(id);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (userId && contract.userId !== userId) {
            throw new ForbiddenException('You do not have access to this contract');
        }

        return {
            data: contract,
        };
    }

    async listContracts(userId?: string): Promise<IResponseReturn<EContract[]>> {
        const contracts = await this.eContractRepository.listContracts(userId);
        return {
            data: contracts,
        };
    }

    async listContractsPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.EContractSelect,
            Prisma.EContractWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<EContract>> {
        return this.eContractRepository.listContractsPaginated(pagination, status);
    }

    async signContract(id: string, userId: string, payload: EContractSignRequestDto, clientIp?: string): Promise<IResponseReturn<EContract>> {
        const contract = await this.eContractRepository.getContractById(id);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.userId !== userId) {
            throw new ForbiddenException('You do not own this contract');
        }

        const signatureUrl = payload.signatureData.startsWith('data:') 
            ? `https://vismarttech.cdn.com/signatures/sig_${contract.code}_${Date.now()}.png`
            : payload.signatureData;

        const signed = await this.eContractRepository.signContract(id, signatureUrl, {
            ...((contract.metadata ?? {}) as Record<string, unknown>),
            signedIp: clientIp || '127.0.0.1',
            otpVerified: Boolean(payload.otpCode),
            signedAt: new Date().toISOString(),
        });

        return {
            data: signed,
        };
    }

    async renewContract(id: string, userId: string, payload: EContractRenewRequestDto): Promise<IResponseReturn<EContract>> {
        const contract = await this.eContractRepository.getContractById(id);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.userId !== userId) {
            throw new ForbiddenException('You do not own this contract');
        }

        const currentExpiry = new Date(contract.expiredAt);
        const newExpiry = new Date(currentExpiry.setMonth(currentExpiry.getMonth() + payload.months));

        const renewed = await this.eContractRepository.renewContract(id, newExpiry, {
            ...((contract.metadata ?? {}) as Record<string, unknown>),
            renewedAt: new Date().toISOString(),
            renewMonths: payload.months,
        });

        return {
            data: renewed,
        };
    }

    async updateContract(id: string, payload: EContractUpdateRequestDto): Promise<IResponseReturn<EContract>> {
        const existing = await this.eContractRepository.getContractById(id);
        if (!existing) {
            throw new NotFoundException('Contract not found');
        }

        const updated = await this.eContractRepository.updateContract(id, payload);
        return {
            data: updated,
        };
    }

    async deleteContract(id: string): Promise<IResponseReturn<{ success: boolean }>> {
        const existing = await this.eContractRepository.getContractById(id);
        if (!existing) {
            throw new NotFoundException('Contract not found');
        }

        await this.eContractRepository.deleteContract(id);
        return {
            data: { success: true },
        };
    }

    async checkExpiringContracts(): Promise<IResponseReturn<{ count: number; notified: string[] }>> {
        const expiring = await this.eContractRepository.getExpiringContracts(7);
        const notified: string[] = [];

        for (const contract of expiring) {
            this.logger.warn(`Contract ${contract.code} for user ${contract.userId} is expiring soon at ${contract.expiredAt.toISOString()}`);
            notified.push(contract.code);
        }

        return {
            data: {
                count: expiring.length,
                notified,
            },
        };
    }
}
