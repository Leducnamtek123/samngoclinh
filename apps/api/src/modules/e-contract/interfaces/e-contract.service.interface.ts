import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { EContract, Prisma } from '@generated/prisma-client';
import { EContractCreateRequestDto } from '@modules/e-contract/dtos/request/e-contract.create.request.dto';
import { EContractSignRequestDto } from '@modules/e-contract/dtos/request/e-contract.sign.request.dto';
import { EContractRenewRequestDto } from '@modules/e-contract/dtos/request/e-contract.renew.request.dto';
import { EContractUpdateRequestDto } from '@modules/e-contract/dtos/request/e-contract.update.request.dto';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';

export interface IEContractService {
    createContract(payload: EContractCreateRequestDto): Promise<IResponseReturn<EContract>>;
    getContract(id: string, userId?: string): Promise<IResponseReturn<EContract>>;
    listContracts(userId?: string): Promise<IResponseReturn<EContract[]>>;
    listContractsPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.EContractSelect,
            Prisma.EContractWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<EContract>>;
    signContract(id: string, userId: string, payload: EContractSignRequestDto, clientIp?: string): Promise<IResponseReturn<EContract>>;
    renewContract(id: string, userId: string, payload: EContractRenewRequestDto, clientIp?: string): Promise<IResponseReturn<any>>;
    getEffectiveExpiredAt(contractId: string): Promise<Date>;
    createAmendment(contractId: string, payload: any, userId?: string, clientIp?: string): Promise<IResponseReturn<any>>;
    signAmendment(amendmentId: string, userId: string, payload: any, clientIp?: string): Promise<IResponseReturn<any>>;
    cancelAmendment(amendmentId: string, userId: string): Promise<IResponseReturn<any>>;
    getAmendmentsByContractId(contractId: string): Promise<IResponseReturn<any>>;
    getAmendmentPdfBuffer(contractCode: string, amendmentCode: string): Promise<{ buffer: Buffer; fileName: string }>;
    updateContract(id: string, payload: EContractUpdateRequestDto): Promise<IResponseReturn<EContract>>;
    deleteContract(id: string): Promise<IResponseReturn<{ success: boolean }>>;
    checkExpiringContracts(): Promise<IResponseReturn<{ count: number; notified: string[] }>>;
}
