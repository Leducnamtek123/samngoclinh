import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import {
    IWalletSummary,
    IWalletTransactionItem,
} from '@modules/wallet/interfaces/wallet.interface';

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

        const transactionsCount =
            await this.databaseService.walletTransaction.count({
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

    async listAllTransactions(): Promise<any[]> {
        return this.databaseService.walletTransaction.findMany({
            orderBy: { occurredAt: 'desc' },
        });
    }

    async adjustBalance(userId: string, amount: number, title: string): Promise<any> {
        return this.databaseService.$transaction(async (tx) => {
            let wallet = await tx.walletAccount.findUnique({ where: { userId } });
            if (!wallet) {
                wallet = await tx.walletAccount.create({
                    data: { userId, balancePoint: 0, treesOwned: 0 },
                });
            }
            const updatedWallet = await tx.walletAccount.update({
                where: { id: wallet.id },
                data: {
                    balancePoint: {
                        increment: amount,
                    },
                },
            });
            const code = 'TXN' + Date.now() + Math.floor(1000 + Math.random() * 9000);
            await tx.walletTransaction.create({
                data: {
                    code,
                    userId,
                    type: amount >= 0 ? 'admin_credit' : 'admin_debit',
                    title,
                    amount,
                    balanceAfter: updatedWallet.balancePoint,
                    status: 'success',
                },
            });
            return updatedWallet;
        });
    }
}
