import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import {
    IOrderDetail,
    IOrderSummaryItem,
} from '@modules/orders/interfaces/orders.interface';
import { Prisma } from '@prisma/client';

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
            userId: order.userId,
            status: order.status,
            currency: order.currency,
            subtotal: order.subtotal,
            shippingFee: order.shippingFee,
            discount: order.discount,
            total: order.total,
            paymentMethod: order.paymentMethod,
            deliveryType: order.deliveryType,
            shippingAddress: order.shippingAddress,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            customerNote: order.customerNote,
            metadata: order.metadata,
            items: order.items,
            paidAt: order.paidAt,
            cancelledAt: order.cancelledAt,
            createdAt: order.createdAt,
        };
    }

    async createOrder(data: {
        code: string;
        userId: string;
        status: string;
        currency: string;
        subtotal: number;
        shippingFee: number;
        discount: number;
        total: number;
        paymentMethod: string | null;
        items: Prisma.InputJsonValue;
    }): Promise<IOrderDetail> {
        const rawItems = Array.isArray(data.items) ? data.items : [];
        const parsedItems = rawItems.map((item: any) => ({
            productId: item.id || item.productId || null,
            productType: item.type || item.productType || 'product',
            productName: item.name || item.title || item.productName || 'Product Item',
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.price || item.unitPrice) || 0,
            totalPrice: (Number(item.quantity) || 1) * (Number(item.price || item.unitPrice) || 0),
        }));

        const order = await this.databaseService.order.create({
            data: {
                ...data,
                orderItems: parsedItems.length > 0 ? { create: parsedItems } : undefined,
            },
        });

        return {
            id: order.id,
            code: order.code,
            userId: order.userId,
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
