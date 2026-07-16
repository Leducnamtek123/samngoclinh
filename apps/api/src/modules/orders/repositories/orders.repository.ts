import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { IOrderDetail, IOrderSummaryItem } from '@modules/orders/interfaces/orders.interface';

@Injectable()
export class OrdersRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getList(userId: string): Promise<IOrderSummaryItem[]> {
        const orders = await this.databaseService.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                code: true,
                status: true,
                total: true,
                createdAt: true,
            },
        });

        return orders.map(o => ({
            id: o.id,
            code: o.code,
            status: o.status,
            total: o.total,
            createdAt: o.createdAt,
        }));
    }

    async getDetail(id: string, userId: string): Promise<IOrderDetail | null> {
        const order = await this.databaseService.order.findFirst({
            where: { id, userId },
        });

        if (!order) {
            return null;
        }

        return {
            id: order.id,
            code: order.code,
            status: order.status,
            currency: order.currency,
            subtotal: order.subtotal,
            shippingFee: order.shippingFee,
            discount: order.discount,
            total: order.total,
            paymentMethod: order.paymentMethod,
            items: order.items,
            paidAt: order.paidAt,
            cancelledAt: order.cancelledAt,
            createdAt: order.createdAt,
        };
    }
}
