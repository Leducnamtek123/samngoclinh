import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { WalletSummaryResponseDto } from '@modules/wallet/dtos/response/wallet.summary.response.dto';
import { WalletTransactionResponseDto } from '@modules/wallet/dtos/response/wallet.transaction.response.dto';

export interface IWalletService {
    summary(userId: string): Promise<IResponseReturn<WalletSummaryResponseDto>>;
    transactions(
        userId: string
    ): Promise<IResponseReturn<{ items: WalletTransactionResponseDto[] }>>;
}
