import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { EContract } from '@generated/prisma-client';
import { EContractCreateRequestDto } from '@modules/e-contract/dtos/request/e-contract.create.request.dto';
import { EContractSignRequestDto } from '@modules/e-contract/dtos/request/e-contract.sign.request.dto';
import { EContractRenewRequestDto } from '@modules/e-contract/dtos/request/e-contract.renew.request.dto';
import { EContractUpdateRequestDto } from '@modules/e-contract/dtos/request/e-contract.update.request.dto';

export interface IEContractService {
    createContract(payload: EContractCreateRequestDto): Promise<IResponseReturn<EContract>>;
    getContract(id: string, userId?: string): Promise<IResponseReturn<EContract>>;
    listContracts(userId?: string): Promise<IResponseReturn<EContract[]>>;
    signContract(id: string, userId: string, payload: EContractSignRequestDto): Promise<IResponseReturn<EContract>>;
    renewContract(id: string, userId: string, payload: EContractRenewRequestDto): Promise<IResponseReturn<EContract>>;
    updateContract(id: string, payload: EContractUpdateRequestDto): Promise<IResponseReturn<EContract>>;
    deleteContract(id: string): Promise<IResponseReturn<{ success: boolean }>>;
    checkExpiringContracts(): Promise<IResponseReturn<{ count: number; notified: string[] }>>;
}
