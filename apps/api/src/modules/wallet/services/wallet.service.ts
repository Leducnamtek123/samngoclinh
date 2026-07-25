import { Injectable } from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { IWalletService } from '@modules/wallet/interfaces/wallet.service.interface';
import { WalletRepository } from '@modules/wallet/repositories/wallet.repository';
import { WalletSummaryResponseDto } from '@modules/wallet/dtos/response/wallet.summary.response.dto';
import { WalletTransactionResponseDto } from '@modules/wallet/dtos/response/wallet.transaction.response.dto';
import { WalletAccount, WalletTransaction } from '@generated/prisma-client';

@Injectable()
export class WalletService implements IWalletService {
    constructor(private readonly walletRepository: WalletRepository) {}

    async summary(
        userId: string
    ): Promise<IResponseReturn<WalletSummaryResponseDto>> {
        const summaryData = await this.walletRepository.getSummary(userId);

        return {
            data: summaryData,
        };
    }

    async transactions(
        userId: string
    ): Promise<IResponseReturn<{ items: WalletTransactionResponseDto[] }>> {
        const items = await this.walletRepository.getTransactions(userId);

        return {
            data: {
                items,
            },
        };
    }

    async adminListTransactions(): Promise<
        IResponseReturn<{ items: WalletTransaction[] }>
    > {
        const items = await this.walletRepository.listAllTransactions();
        return {
            data: { items },
        };
    }

    async adminAdjustBalance(
        userId: string,
        amount: number,
        title: string
    ): Promise<IResponseReturn<WalletAccount>> {
        const wallet = await this.walletRepository.adjustBalance(userId, amount, title);
        return {
            data: wallet,
        };
    }
}
