import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { IWalletSummary, IWalletTransactionItem } from '@modules/wallet/interfaces/wallet.interface';

@Injectable()
export class WalletRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getSummary(userId: string): Promise<IWalletSummary> {
        const wallet = await this.databaseService.walletAccount.findUnique({
            where: { userId },
            select: {
                balancePoint: true,
                treesOwned: true,
            },
        });

        const transactionsCount = await this.databaseService.walletTransaction.count({
            where: { userId },
        });

        return {
            balancePoint: wallet?.balancePoint ?? 0,
            treesOwned: wallet?.treesOwned ?? 0,
            transactions: transactionsCount,
        };
    }

    async getTransactions(userId: string): Promise<IWalletTransactionItem[]> {
        const txns = await this.databaseService.walletTransaction.findMany({
            where: { userId },
            orderBy: { occurredAt: 'desc' },
            select: {
                id: true,
                code: true,
                type: true,
                title: true,
                amount: true,
                balanceAfter: true,
                status: true,
                occurredAt: true,
            },
        });

        return txns.map(t => ({
            id: t.id,
            code: t.code,
            type: t.type,
            title: t.title,
            amount: t.amount,
            balanceAfter: t.balanceAfter,
            status: t.status,
            occurredAt: t.occurredAt,
        }));
    }
}
