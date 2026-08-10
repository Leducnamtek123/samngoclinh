import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@common/database/services/database.service';

@Injectable()
export class OrdersExpirationService {
    private readonly logger = new Logger(OrdersExpirationService.name);

    constructor(private readonly databaseService: DatabaseService) {}

    /**
     * Quét và giải phóng các reservation đã hết hạn (expiresAt < NOW() và status = 'active').
     * Tự động chuyển các đơn hàng pending liên quan sang trạng thái 'cancelled'.
     */
    async cleanExpiredReservations(): Promise<{ releasedCount: number; cancelledOrdersCount: number }> {
        const now = new Date();
        const expiredReservations = await this.databaseService.stockReservation.findMany({
            where: {
                status: 'active',
                expiresAt: { lte: now },
            },
        });

        if (expiredReservations.length === 0) {
            return { releasedCount: 0, cancelledOrdersCount: 0 };
        }

        this.logger.log(`Found ${expiredReservations.length} expired stock reservations to release.`);

        const expiredOrderIds = Array.from(new Set(expiredReservations.map(r => r.orderId)));
        let releasedCount = 0;
        let cancelledOrdersCount = 0;

        await this.databaseService.$transaction(async tx => {
            // 1. Release reservations
            for (const res of expiredReservations) {
                await tx.stockReservation.update({
                    where: { id: res.id },
                    data: { status: 'released' },
                });

                await tx.stockMovement.create({
                    data: {
                        productId: res.productId,
                        productType: res.productType,
                        orderId: res.orderId,
                        type: 'release',
                        quantity: res.quantity,
                        balanceBefore: 0,
                        balanceAfter: 0,
                        note: `Auto-released expired stock reservation (TTL expired)`,
                    },
                });
                releasedCount++;
            }

            // 2. Cancel corresponding pending orders
            for (const orderId of expiredOrderIds) {
                const order = await tx.order.findUnique({
                    where: { id: orderId },
                });

                if (order && order.status === 'pending') {
                    await tx.order.update({
                        where: { id: orderId },
                        data: {
                            status: 'cancelled',
                            cancelledAt: now,
                            customerNote: (order.customerNote ? order.customerNote + ' | ' : '') + 'Đơn hàng tự động hủy do quá hạn thanh toán',
                        },
                    });

                    // Refund points if redeemed
                    const orderMeta = (order.metadata ?? {}) as Record<string, unknown>;
                    const pointsRedeemed = (orderMeta?.pointsRedeemed as number) || 0;
                    if (pointsRedeemed > 0) {
                        const wallet = await tx.walletAccount.findUnique({
                            where: { userId: order.userId },
                        });
                        if (wallet) {
                            const updatedWallet = await tx.walletAccount.update({
                                where: { id: wallet.id },
                                data: {
                                    balancePoint: { increment: pointsRedeemed },
                                },
                            });

                            await tx.walletTransaction.create({
                                data: {
                                    code: 'TXN' + Date.now() + Math.floor(1000 + Math.random() * 9000),
                                    userId: order.userId,
                                    type: 'refund',
                                    title: `Hoàn điểm tự động cho đơn hàng quá hạn ${order.code}`,
                                    amount: pointsRedeemed,
                                    balanceAfter: updatedWallet.balancePoint,
                                    status: 'success',
                                },
                            });
                        }
                    }

                    cancelledOrdersCount++;
                }
            }
        });

        this.logger.log(`Released ${releasedCount} stock reservations and cancelled ${cancelledOrdersCount} expired orders.`);
        return { releasedCount, cancelledOrdersCount };
    }
}
