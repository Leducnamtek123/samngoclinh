import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { WalletSummaryResponseDto } from '@modules/wallet/dtos/response/wallet.summary.response.dto';
import { WalletTransactionResponseDto } from '@modules/wallet/dtos/response/wallet.transaction.response.dto';
import { WalletAccount, WalletTransaction } from '@generated/prisma-client';

export interface IWalletService {
    summary(userId: string): Promise<IResponseReturn<WalletSummaryResponseDto>>;
    transactions(
        userId: string
    ): Promise<IResponseReturn<{ items: WalletTransactionResponseDto[] }>>;
    adminListTransactions(): Promise<
        IResponseReturn<{ items: WalletTransaction[] }>
    >;
    adminAdjustBalance(
        userId: string,
        amount: number,
        title: string
    ): Promise<IResponseReturn<WalletAccount>>;
}

