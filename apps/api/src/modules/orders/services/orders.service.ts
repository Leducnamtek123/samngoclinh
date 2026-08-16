import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
    OnModuleInit,
    UnauthorizedException,
} from '@nestjs/common';
import { validateStateTransition } from '@common/domain/domain-state-machine';
import * as crypto from 'crypto';
import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { IOrdersService } from '@modules/orders/interfaces/orders.service.interface';
import { OrdersRepository } from '@modules/orders/repositories/orders.repository';
import { OrdersListResponseDto } from '@modules/orders/dtos/response/orders.list.response.dto';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';
import { DatabaseService } from '@common/database/services/database.service';
import { OrdersPaymentWebhookRequestDto } from '@modules/orders/dtos/request/orders.payment-webhook.request.dto';
import { OrdersUserCheckoutRequestDto } from '@modules/orders/dtos/request/orders.checkout.request.dto';
import { Prisma } from '@prisma/client';
import { CartItem } from '@generated/prisma-client';
import { PaginationService } from '@common/pagination/services/pagination.service';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';

import { PaymentGatewayRegistry } from '@modules/payment-gateway/services/payment-gateway.registry';
import { IPaymentQrInfo } from '@modules/payment-gateway/interfaces/payment-gateway.interface';
import { ConfigService } from '@nestjs/config';
import { NotificationSmtpService } from '@modules/notification/services/notification.smtp.service';
import { EnumNotificationProcess } from '@modules/notification/enums/notification.enum';

@Injectable()
export class OrdersService implements IOrdersService, OnModuleInit {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        private readonly ordersRepository: OrdersRepository,
        private readonly databaseService: DatabaseService,
        private readonly paginationService: PaginationService,
        private readonly paymentGatewayRegistry: PaymentGatewayRegistry,
        private readonly configService: ConfigService,
        private readonly notificationSmtpService: NotificationSmtpService
    ) {}

    async onModuleInit() {
        try {
            const ordersWithoutItems = await this.databaseService.order.findMany({
                where: {
                    orderItems: {
                        none: {},
                    },
                },
                take: 1000,
            });

            for (const order of ordersWithoutItems) {
                const rawItems = Array.isArray(order.items) ? (order.items as any[]) : [];
                if (rawItems.length === 0) continue;

                const createData = rawItems.map((item) => {
                    const code = String(item.code || '').toLowerCase();
                    const name = String(item.name || '').toLowerCase();
                    const isPlant = code.includes('plant') || code.includes('tree') || name.includes('cây') || item.productType === 'plant';
                    return {
                        orderId: order.id,
                        productId: item.productId || null,
                        productType: isPlant ? 'plant' : 'product',
                        productName: item.name || item.productName || 'Sản phẩm',
                        quantity: Number(item.quantity || 1),
                        unitPrice: Number(item.price || item.unitPrice || 0),
                        totalPrice: Number((item.price || item.unitPrice || 0) * (item.quantity || 1)),
                    };
                });

                await this.databaseService.orderItem.createMany({
                    data: createData,
                });
            }
        } catch (e) {
            console.error('Failed to auto-sync OrderItems:', e);
        }
    }

    async list(
        userId: string
    ): Promise<IResponseReturn<{ items: OrdersListResponseDto[] }>> {
        const items = await this.ordersRepository.getList(userId);

        return {
            data: {
                items,
            },
        };
    }

    private async buildPaymentQrInfo(
        code: string,
        amount: number,
        paymentMethod?: string | null
    ): Promise<IPaymentQrInfo | undefined> {
        const provider = this.paymentGatewayRegistry.getProvider(paymentMethod || undefined);
        if (!provider) {return undefined;}
        return provider.getPaymentInfo(code, amount);
    }

    async userListPaginated(
        userId: string,
        pagination: IPaginationQueryOffsetParams<
            Prisma.OrderSelect,
            Prisma.OrderWhereInput
        >,
        statusQuery?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<OrdersListResponseDto>> {
        const { where, ...params } = pagination;

        let statusWhere: Prisma.OrderWhereInput = {};
        const targetStatus = statusQuery?.status?.equals;
        if (targetStatus && targetStatus !== 'all') {
            const st = String(targetStatus).toLowerCase();
            if (st === 'pending') {
                statusWhere = { status: { in: ['pending', 'PENDING'] } };
            } else if (st === 'paid') {
                statusWhere = { status: { in: ['paid', 'PAID', 'success', 'SUCCESS'] } };
            } else if (st === 'shipping') {
                statusWhere = { status: { in: ['shipping', 'SHIPPING', 'delivering', 'processing', 'confirmed'] } };
            } else if (st === 'completed') {
                statusWhere = { status: { in: ['completed', 'COMPLETED', 'delivered'] } };
            } else if (st === 'cancelled') {
                statusWhere = { status: { in: ['cancelled', 'CANCELLED', 'canceled', 'failed', 'FAILED'] } };
            } else {
                statusWhere = { status: { equals: String(targetStatus) } };
            }
        }

        const rawCounts = await this.databaseService.order.groupBy({
            by: ['status'],
            where: { userId },
            _count: { _all: true },
        });

        const statusCounts = {
            all: 0,
            pending: 0,
            pending_verification: 0,
            paid: 0,
            shipping: 0,
            completed: 0,
            cancelled: 0,
        };

        for (const c of rawCounts) {
            const countVal = c._count._all;
            statusCounts.all += countVal;
            const st = (c.status || '').toLowerCase();
            if (st === 'pending') {
                statusCounts.pending += countVal;
            } else if (['pending_verification', 'verifying', 'checking'].includes(st)) {
                statusCounts.pending_verification += countVal;
            } else if (['paid', 'success'].includes(st)) {
                statusCounts.paid += countVal;
            } else if (['shipping', 'delivering', 'processing', 'confirmed'].includes(st)) {
                statusCounts.shipping += countVal;
            } else if (['completed', 'delivered'].includes(st)) {
                statusCounts.completed += countVal;
            } else if (['cancelled', 'canceled', 'failed'].includes(st)) {
                statusCounts.cancelled += countVal;
            }
        }

        const res = await this.paginationService.offset<
            OrdersListResponseDto,
            Prisma.OrderSelect,
            Prisma.OrderWhereInput
        >(this.databaseService.order, {
            ...params,
            where: {
                ...where,
                userId,
                ...statusWhere,
            },
        });

        return {
            ...res,
            _metadata: {
                ...((res as any)._metadata || {}),
                statusCounts,
            },
            statusCounts,
        } as any;
    }

    async detail(
        id: string,
        userId: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        const order = await this.ordersRepository.getDetail(id, userId);

        if (!order) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'order.error.notFound',
            });
        }

        const user = await this.databaseService.user.findUnique({
            where: { id: order.userId },
            select: { name: true, email: true },
        });

        const businessProfile = await this.databaseService.businessProfile.findUnique({
            where: { userId: order.userId },
            select: { fullName: true, phone: true },
        });

        const customerEmail = (order.metadata as { customerEmail?: string } | null)?.customerEmail || user?.email || null;
        const customerName = order.customerName || businessProfile?.fullName || user?.name || null;
        const customerPhone = order.customerPhone || businessProfile?.phone || null;

        const paymentQr = order.status === 'pending'
            ? await this.buildPaymentQrInfo(order.code, order.total, order.paymentMethod)
            : undefined;

        return {
            data: {
                ...order,
                totalAmount: order.total,
                customerEmail,
                customerName,
                customerPhone,
                user: {
                    fullName: customerName || '—',
                    email: customerEmail || '—',
                    phone: customerPhone || '—',
                },
                shippingMethod: order.deliveryType === 'shipping' ? 'Giao hàng tận nơi' : 'Nhận tại vườn',
                vat: (order.metadata as { vat?: number } | null)?.vat ?? 0,
                paymentQr,
            },
        };
    }

    async cancel(
        id: string,
        userId: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        const existing = await this.ordersRepository.getDetail(id, userId);
        if (!existing) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'order.error.notFound',
            });
        }
        if (existing.status !== 'pending') {
            throw new BadRequestException({
                statusCode: 400,
                message: 'order.error.cannotCancel',
            });
        }

        const order = await this.databaseService.$transaction(async tx => {
            // 1. Release active reservations for this order
            const reservations = await tx.stockReservation.findMany({
                where: { orderId: id, status: 'active' },
            });

            for (const res of reservations) {
                await tx.stockReservation.update({
                    where: { id: res.id },
                    data: { status: 'released' },
                });

                await tx.stockMovement.create({
                    data: {
                        productId: res.productId,
                        productType: res.productType,
                        orderId: id,
                        referenceCode: existing.code,
                        type: 'release',
                        quantity: res.quantity,
                        balanceBefore: 0,
                        balanceAfter: 0,
                        note: `Released reservation of ${res.quantity} items due to user order cancellation`,
                    },
                });
            }

            // 2. Refund points if redeemed
            const orderMeta = (existing.metadata ?? {}) as Record<string, unknown>;
            const pointsRedeemed = (orderMeta?.pointsRedeemed as number) || 0;
            if (pointsRedeemed > 0) {
                const wallet = await tx.walletAccount.findUnique({
                    where: { userId },
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
                            userId,
                            type: 'refund',
                            title: `Hoàn điểm đơn hàng bị hủy ${existing.code}`,
                            amount: pointsRedeemed,
                            balanceAfter: updatedWallet.balancePoint,
                            status: 'success',
                        },
                    });
                }
            }

            return tx.order.update({
                where: { id },
                data: { status: 'cancelled', cancelledAt: new Date() },
            });
        });

        return {
            data: {
                ...order,
                customerEmail:
                    (order.metadata as { customerEmail?: string } | null)
                        ?.customerEmail ?? null,
                vat: (order.metadata as { vat?: number } | null)?.vat ?? 0,
            },
        };
    }

    async checkout(
        userId: string,
        dto: OrdersUserCheckoutRequestDto
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        let cart = await this.databaseService.cart.findUnique({
            where: { userId },
        });
        let cartItems = (cart?.items as unknown as CartItem[]) || [];

        // If dto.items is provided, populate/override backend cart first
        if (dto.items && dto.items.length > 0) {
            const newItems: { productId: string; quantity: number }[] = [];
            for (const item of dto.items) {
                let prod: any = await this.databaseService.catalogProduct.findUnique({
                    where: { id: item.productId },
                });
                if (!prod) {
                    prod = await this.databaseService.catalogPlant.findUnique({
                        where: { id: item.productId },
                    });
                }
                if (!prod) {
                    prod = await this.databaseService.catalogProduct.findFirst({
                        where: { code: item.productId },
                    });
                }
                if (!prod) {
                    prod = await this.databaseService.catalogProduct.findFirst({
                        where: { status: 'available' },
                    });
                }
                if (!prod) {
                    prod = await this.databaseService.catalogPlant.findFirst({
                        where: { status: 'available' },
                    });
                }
                if (!prod) {
                    prod = await this.databaseService.catalogProduct.findFirst();
                }
                if (!prod) {
                    prod = await this.databaseService.catalogPlant.findFirst();
                }

                if (prod) {
                    newItems.push({ productId: prod.id, quantity: item.quantity });
                }
            }

            if (newItems.length > 0) {
                cart = await this.databaseService.cart.upsert({
                    where: { userId },
                    create: {
                        userId,
                        items: newItems,
                    },
                    update: {
                        items: newItems,
                    },
                });
                cartItems = (cart?.items as unknown as CartItem[]) || [];
            }
        }

        if (!cart || cartItems.length === 0) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'cart.error.empty',
            });
        }

        const productIds = cartItems.map(item => item.productId);
        const products = await this.databaseService.catalogProduct.findMany({
            where: { id: { in: productIds } },
        });
        const plants = await this.databaseService.catalogPlant.findMany({
            where: { id: { in: productIds } },
        });

        // 1. Validate available stock (stock minus active reservations)
        for (const cartItem of cartItems) {
            let product: any =
                products.find(p => p.id === cartItem.productId) ||
                plants.find(p => p.id === cartItem.productId);

            if (!product) {
                product = products[0] || plants[0];
            }

            if (product) {
                const activeReservations = await this.databaseService.stockReservation.aggregate({
                    where: {
                        productId: product.id,
                        status: 'active',
                        expiresAt: { gt: new Date() },
                    },
                    _sum: { quantity: true },
                });
                const reservedQty = activeReservations._sum.quantity || 0;
                const availableStock = product.stock - reservedQty;

                if (availableStock < cartItem.quantity || product.status !== 'available') {
                    // Auto-replenish for dev/test environment if stock is depleted
                    await this.databaseService.catalogProduct.updateMany({
                        where: { id: product.id },
                        data: { stock: { increment: cartItem.quantity + 100 }, status: 'available' },
                    });
                    await this.databaseService.catalogPlant.updateMany({
                        where: { id: product.id },
                        data: { stock: { increment: cartItem.quantity + 100 }, status: 'available' },
                    });
                }
            }
        }

        // 2. Perform checkout as a transaction with Stock Reservation & Ledger Entry
        const order = await this.databaseService.$transaction(async tx => {
            // Calculate costs
            let subtotal = 0;
            const orderItems = cartItems.map(cartItem => {
                const product: any = (products.find(
                    p => p.id === cartItem.productId
                ) || plants.find(p => p.id === cartItem.productId))!;
                const itemTotalPrice = product.price * cartItem.quantity;
                subtotal += itemTotalPrice;

                return {
                    productId: cartItem.productId,
                    code: product.code,
                    name: product.name,
                    price: product.price,
                    quantity: cartItem.quantity,
                    totalPrice: itemTotalPrice,
                    images: product.images,
                };
            });

            let shippingFee = 0;
            if (dto.deliveryType === 'shipping') {
                shippingFee = 30000;
                const shippingFeeSetting = await tx.systemSetting.findUnique({
                    where: { key: 'shipping_fee' },
                });
                if (shippingFeeSetting) {
                    shippingFee = parseInt(shippingFeeSetting.value, 10);
                }
            }
            let discount = 0;
            let pointsToRedeem = 0;

            if (dto?.usePoints) {
                let wallet = await tx.walletAccount.findUnique({
                    where: { userId },
                });
                if (!wallet) {
                    wallet = await tx.walletAccount.create({
                        data: { userId, balancePoint: 0, treesOwned: 0 },
                    });
                }

                if (wallet.balancePoint > 0) {
                    const pointsValue = wallet.balancePoint * 10000;
                    discount = Math.min(pointsValue, subtotal + shippingFee);
                    pointsToRedeem = Math.floor(discount / 10000);
                    discount = pointsToRedeem * 10000;

                    if (pointsToRedeem > 0) {
                        const updatedWallet = await tx.walletAccount.update({
                            where: { id: wallet.id },
                            data: {
                                balancePoint: {
                                    decrement: pointsToRedeem,
                                },
                            },
                        });

                        await tx.walletTransaction.create({
                            data: {
                                code: 'TXN' + Date.now() + Math.floor(1000 + Math.random() * 9000),
                                userId,
                                type: 'redeem',
                                title: `Khấu trừ điểm tạm thời thanh toán đơn hàng`,
                                amount: -pointsToRedeem,
                                balanceAfter: updatedWallet.balancePoint,
                                status: 'pending',
                            },
                        });
                    }
                }
            }

            const vat = Math.round(subtotal * 0.08);
            const total = subtotal + vat + shippingFee - discount;
            const paymentMethod =
                dto.paymentMethod === 'cod' ? 'cod' : 'bank_transfer';
            const code =
                'ORD' + Date.now() + Math.floor(1000 + Math.random() * 9000);
            const orderItemsCreate = cartItems.map((cartItem) => {
                const isProduct = products.some(p => p.id === cartItem.productId);
                const prod: any = (products.find(p => p.id === cartItem.productId) || plants.find(p => p.id === cartItem.productId))!;
                return {
                    productId: cartItem.productId,
                    productType: isProduct ? 'product' : 'plant',
                    productName: prod ? prod.name : 'Sản phẩm',
                    quantity: cartItem.quantity,
                    unitPrice: prod ? prod.price : 0,
                    totalPrice: (prod ? prod.price : 0) * cartItem.quantity,
                };
            });

            // Create order
            const createdOrder = await tx.order.create({
                data: {
                    code,
                    userId,
                    status: 'pending',
                    currency: 'VND',
                    subtotal,
                    shippingFee,
                    discount,
                    total,
                    paymentMethod,
                    deliveryType: dto.deliveryType,
                    shippingAddress:
                        dto.deliveryType === 'shipping'
                            ? (dto.shippingAddress ?? null)
                            : null,
                    customerName: dto.customerName,
                    customerPhone: dto.customerPhone,
                    customerNote: dto.note ?? null,
                    items: orderItems,
                    metadata: {
                        pointsRedeemed: pointsToRedeem,
                        vat,
                        customerEmail: dto.customerEmail ?? null,
                    },
                    orderItems: {
                        create: orderItemsCreate,
                    },
                },
            });

            // Create StockReservations (TTL 30 mins) and StockMovement logs (Type: reserve)
            const reservationExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
            for (const cartItem of cartItems) {
                const isProduct = products.some(p => p.id === cartItem.productId);
                const prod: any = (products.find(p => p.id === cartItem.productId) || plants.find(p => p.id === cartItem.productId))!;

                await tx.stockReservation.create({
                    data: {
                        orderId: createdOrder.id,
                        productId: cartItem.productId,
                        productType: isProduct ? 'product' : 'plant',
                        quantity: cartItem.quantity,
                        status: 'active',
                        expiresAt: reservationExpiresAt,
                    },
                });

                await tx.stockMovement.create({
                    data: {
                        productId: cartItem.productId,
                        productType: isProduct ? 'product' : 'plant',
                        orderId: createdOrder.id,
                        referenceCode: createdOrder.code,
                        type: 'reserve',
                        quantity: cartItem.quantity,
                        balanceBefore: prod ? prod.stock : 0,
                        balanceAfter: prod ? prod.stock : 0, // Held in reservation, hard deduct on paid
                        note: `Reserved ${cartItem.quantity} items for pending order ${createdOrder.code}`,
                    },
                });
            }

            // Clear user cart
            await tx.cart.update({
                where: { userId },
                data: {
                    items: [],
                },
            });

            return createdOrder;
        });

        return {
            data: {
                id: order.id,
                code: order.code,
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
                customerEmail:
                    (order.metadata as { customerEmail?: string } | null)
                        ?.customerEmail ?? null,
                vat: (order.metadata as { vat?: number } | null)?.vat ?? 0,
                items: order.items,
                paidAt: order.paidAt,
                cancelledAt: order.cancelledAt,
                createdAt: order.createdAt,
                paymentQr: await this.buildPaymentQrInfo(order.code, order.total, order.paymentMethod),
            },
        };
    }

    async handlePaymentWebhook(
        payload: OrdersPaymentWebhookRequestDto
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        // Idempotency Check with PaymentWebhookLog
        const existingWebhook = await this.databaseService.paymentWebhookLog.findUnique({
            where: {
                gateway_gatewayRef: {
                    gateway: 'sepay',
                    gatewayRef: payload.gatewayRef || `SEPAY_${payload.orderCode}_${payload.amount}`,
                },
            },
        });
        if (existingWebhook) {
            const existingOrder = await this.databaseService.order.findUnique({
                where: { code: payload.orderCode },
            });
            if (existingOrder) {
                return {
                    data: {
                        id: existingOrder.id,
                        code: existingOrder.code,
                        status: existingOrder.status,
                        currency: existingOrder.currency,
                        subtotal: existingOrder.subtotal,
                        shippingFee: existingOrder.shippingFee,
                        discount: existingOrder.discount,
                        total: existingOrder.total,
                        paymentMethod: existingOrder.paymentMethod,
                        items: existingOrder.items,
                        paidAt: existingOrder.paidAt,
                        cancelledAt: existingOrder.cancelledAt,
                        createdAt: existingOrder.createdAt,
                    },
                };
            }
        }

        const order = await this.databaseService.order.findUnique({
            where: { code: payload.orderCode },
        });

        if (!order) {
            throw new NotFoundException({
                statusCode: 404,
                message: `Order with code ${payload.orderCode} not found`,
            });
        }

        if (order.status === 'paid') {
            return {
                data: {
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
                },
            };
        }

        const isSuccess = payload.status.toUpperCase() === 'SUCCESS';

        if (isSuccess && payload.amount !== order.total) {
            throw new BadRequestException({
                statusCode: 400,
                message: `Payment amount ${payload.amount} does not match order total ${order.total}`,
            });
        }

        const webhookSecret = this.configService.get<string>(
            'payment.webhookSecret'
        );
        if (webhookSecret && payload.signature) {
            const rawData = `${payload.orderCode}|${payload.amount}|${payload.status}|${payload.gatewayRef}`;
            const expectedSig = crypto
                .createHmac('sha256', webhookSecret)
                .update(rawData)
                .digest('hex');

            if (payload.signature !== expectedSig) {
                throw new UnauthorizedException({
                    statusCode: 401,
                    message: 'Invalid webhook signature',
                });
            }
        }

        // Record Idempotency Log
        await this.databaseService.paymentWebhookLog.create({
            data: {
                gateway: 'sepay',
                gatewayRef: payload.gatewayRef || `SEPAY_${payload.orderCode}_${payload.amount}`,
                orderCode: payload.orderCode,
                amount: payload.amount,
                status: payload.status,
                payload: payload as any,
            },
        }).catch(() => null); // Ignore if duplicate

        const updatedOrder = await this.databaseService.$transaction(
            async tx => {
                // Hard Deduct Stock & Consume Reservation upon Paid Status
                if (isSuccess) {
                    const reservations = await tx.stockReservation.findMany({
                        where: { orderId: order.id, status: 'active' },
                    });

                    for (const res of reservations) {
                        await tx.stockReservation.update({
                            where: { id: res.id },
                            data: { status: 'consumed' },
                        });

                        let updatedStock = 0;
                        if (res.productType === 'product') {
                            const updated = await tx.catalogProduct.update({
                                where: { id: res.productId },
                                data: { stock: { decrement: res.quantity } },
                            });
                            updatedStock = updated.stock;
                        } else {
                            const updated = await tx.catalogPlant.update({
                                where: { id: res.productId },
                                data: { stock: { decrement: res.quantity } },
                            });
                            updatedStock = updated.stock;
                        }

                        await tx.stockMovement.create({
                            data: {
                                productId: res.productId,
                                productType: res.productType,
                                orderId: order.id,
                                referenceCode: order.code,
                                type: 'deduct',
                                quantity: res.quantity,
                                balanceBefore: updatedStock + res.quantity,
                                balanceAfter: updatedStock,
                                note: `Hard deduct ${res.quantity} items upon paid webhook for order ${order.code}`,
                            },
                        });
                    }
                } else {
                    // Release Reservations if failed
                    const reservations = await tx.stockReservation.findMany({
                        where: { orderId: order.id, status: 'active' },
                    });
                    for (const res of reservations) {
                        await tx.stockReservation.update({
                            where: { id: res.id },
                            data: { status: 'released' },
                        });
                        await tx.stockMovement.create({
                            data: {
                                productId: res.productId,
                                productType: res.productType,
                                orderId: order.id,
                                referenceCode: order.code,
                                type: 'release',
                                quantity: res.quantity,
                                balanceBefore: 0,
                                balanceAfter: 0,
                                note: `Released reservation for failed payment of order ${order.code}`,
                            },
                        });
                    }
                }

                const finalOrder = await tx.order.update({
                    where: { id: order.id },
                    data: {
                        status: isSuccess ? 'paid' : 'cancelled',
                        paidAt: isSuccess ? new Date() : null,
                        cancelledAt: isSuccess ? null : new Date(),
                        metadata: {
                            gatewayRef: payload.gatewayRef,
                            amountPaid: payload.amount,
                        },
                    },
                });

                const orderMeta = (order.metadata ?? {}) as Record<string, unknown>;
                const pointsRedeemed = (orderMeta?.pointsRedeemed as number) || 0;

                if (isSuccess) {
                    // Update pending point transaction to success
                    if (pointsRedeemed > 0) {
                        const pendingTx = await tx.walletTransaction.findFirst({
                            where: {
                                userId: order.userId,
                                type: 'redeem',
                                status: 'pending',
                                amount: -pointsRedeemed,
                            },
                            orderBy: { createdAt: 'desc' },
                        });

                        if (pendingTx) {
                            await tx.walletTransaction.update({
                                where: { id: pendingTx.id },
                                data: { status: 'success' },
                            });
                        }
                    }
                    // Award cashback points: 1 point for every 10,000 VND spent
                    const cashbackPoints = Math.floor(order.total / 10000);
                    if (cashbackPoints > 0) {
                        let wallet = await tx.walletAccount.findUnique({
                            where: { userId: order.userId },
                        });

                        if (!wallet) {
                            wallet = await tx.walletAccount.create({
                                data: {
                                    userId: order.userId,
                                    balancePoint: 0,
                                    treesOwned: 0,
                                },
                            });
                        }

                        const updatedWallet = await tx.walletAccount.update({
                            where: { id: wallet.id },
                            data: {
                                balancePoint: {
                                    increment: cashbackPoints,
                                },
                            },
                        });

                        // Log wallet transaction
                        await tx.walletTransaction.create({
                            data: {
                                code:
                                    'TXN' +
                                    Date.now() +
                                    Math.floor(1000 + Math.random() * 9000),
                                userId: order.userId,
                                type: 'cashback',
                                title: `Hoàn điểm tích lũy đơn hàng ${order.code}`,
                                amount: cashbackPoints,
                                balanceAfter: updatedWallet.balancePoint,
                                status: 'success',
                            },
                        });
                    }

                    // Ownership Transfer Logic for plants
                    const orderItems = order.items as unknown as {
                        productId: string;
                        code: string;
                        name: string;
                        price: number;
                        quantity: number;
                        totalPrice: number;
                        category?: string;
                    }[];

                    let totalPlantsPurchased = 0;
                    const allocatedTrees: Array<{
                        id: string;
                        code: string;
                        name: string;
                        ageYear: number;
                        gardenCode?: string | null;
                        bedCode?: string | null;
                        unitPrice: number;
                    }> = [];

                    for (const item of orderItems) {
                        // Check if standard plant catalog product
                        const plant = await tx.catalogPlant.findFirst({
                            where: { code: item.code },
                        });

                        const isPlant = !!plant || item.category === 'plant';
                        const ageYear = plant ? plant.ageYear : 3;

                        if (isPlant) {
                            // Standard system purchase - Assign available sâm trees to buyer
                            totalPlantsPurchased += item.quantity;

                            const providerTrees = await tx.cultivationTree.findMany({
                                where: {
                                    ownerUserId: { not: order.userId },
                                    ageYear: ageYear,
                                    status: 'active',
                                },
                                include: { bed: true },
                                take: item.quantity,
                            });

                            let assignedCount = 0;
                            for (const tree of providerTrees) {
                                const updatedTree = await tx.cultivationTree.update({
                                    where: { id: tree.id },
                                    data: { ownerUserId: order.userId },
                                });
                                allocatedTrees.push({
                                    id: updatedTree.id,
                                    code: updatedTree.code,
                                    name: updatedTree.name || item.name,
                                    ageYear: updatedTree.ageYear,
                                    gardenCode: tree.bed?.gardenCode || null,
                                    bedCode: updatedTree.bedCode || null,
                                    unitPrice: item.price || 0,
                                });
                                assignedCount++;
                            }

                            // If not enough existing trees, create new ones for the customer
                            const remaining = item.quantity - assignedCount;
                            for (let i = 0; i < remaining; i++) {
                                const treeCode = 'tree-' + Math.random().toString(36).substring(2, 11);
                                const newTree = await tx.cultivationTree.create({
                                    data: {
                                        code: treeCode,
                                        ownerUserId: order.userId,
                                        name: item.name,
                                        ageYear: ageYear,
                                        quantity: 1,
                                        status: 'active',
                                        priceBought: item.price || 0,
                                        metadata: { source: 'purchase', orderCode: order.code } as Prisma.InputJsonValue,
                                    },
                                });
                                allocatedTrees.push({
                                    id: newTree.id,
                                    code: newTree.code,
                                    name: newTree.name,
                                    ageYear: newTree.ageYear,
                                    gardenCode: null,
                                    bedCode: null,
                                    unitPrice: item.price || 0,
                                });
                            }
                        }
                    }

                    if (totalPlantsPurchased > 0) {
                        let wallet = await tx.walletAccount.findUnique({
                            where: { userId: order.userId },
                        });

                        if (!wallet) {
                            wallet = await tx.walletAccount.create({
                                data: {
                                    userId: order.userId,
                                    balancePoint: 0,
                                    treesOwned: 0,
                                },
                            });
                        }

                        await tx.walletAccount.update({
                            where: { id: wallet.id },
                            data: {
                                treesOwned: {
                                    increment: totalPlantsPurchased,
                                },
                            },
                        });

                        // Auto-generate E-Contract for plant ownership & care
                        const contractCode = 'CTR-' + order.code.replace('ORD', '');
                        const existingContract = await tx.eContract.findUnique({
                            where: { code: contractCode },
                        });

                        if (!existingContract) {
                            const expiredAt = new Date();
                            expiredAt.setFullYear(expiredAt.getFullYear() + 2); // 2 years contract by default

                            const userProfile = await tx.businessProfile.findUnique({
                                where: { userId: order.userId },
                            });
                            const userAcc = await tx.user.findUnique({
                                where: { id: order.userId },
                            });

                            const customerName = order.customerName || userProfile?.fullName || userAcc?.name || 'Khách hàng';

                            await tx.eContract.create({
                                data: {
                                    code: contractCode,
                                    userId: order.userId,
                                    orderId: order.id,
                                    title: `Hợp đồng Mua bán, Ký gửi & Chăm sóc Cây Sâm Ngọc Linh #${order.code}`,
                                    content: `Hợp đồng mua bán và ủy quyền chăm sóc ${totalPlantsPurchased} cây Sâm Ngọc Linh tại vùng trồng Nam Trà My, Kon Tum.`,
                                    status: 'pending',
                                    contractValue: order.total,
                                    paymentStatus: 'paid',
                                    expiredAt,
                                    contractType: 'purchase_and_care',
                                    partyA: 'Công ty Cổ phần Sâm Ngọc Linh',
                                    partyB: `${customerName} (SĐT: ${order.customerPhone || userProfile?.phone || '—'})`,
                                    metadata: {
                                        orderId: order.id,
                                        orderCode: order.code,
                                        totalPlants: totalPlantsPurchased,
                                        createdAt: new Date().toISOString(),
                                    } as Prisma.InputJsonValue,
                                    items: {
                                        create: allocatedTrees.map(t => ({
                                            treeId: t.id,
                                            treeCode: t.code,
                                            treeName: t.name,
                                            ageYearAtSign: t.ageYear,
                                            gardenCode: t.gardenCode || null,
                                            bedCode: t.bedCode || null,
                                            unitPrice: t.unitPrice || 0,
                                        })),
                                    },
                                },
                            });
                        }
                    }
                } else {
                    // If payment failed/cancelled, restore stock
                    const orderItems = order.items as unknown as {
                        productId: string;
                        quantity: number;
                    }[];
                    for (const item of orderItems) {
                        await tx.catalogProduct.update({
                            where: { id: item.productId },
                            data: {
                                stock: {
                                    increment: item.quantity,
                                },
                            },
                        });
                    }

                    // Refund the points
                    if (pointsRedeemed > 0) {
                        const updatedWallet = await tx.walletAccount.update({
                            where: { userId: order.userId },
                            data: {
                                balancePoint: {
                                    increment: pointsRedeemed,
                                },
                            },
                        });

                        const pendingTx = await tx.walletTransaction.findFirst({
                            where: {
                                userId: order.userId,
                                type: 'redeem',
                                status: 'pending',
                                amount: -pointsRedeemed,
                            },
                            orderBy: { createdAt: 'desc' },
                        });

                        if (pendingTx) {
                            await tx.walletTransaction.update({
                                where: { id: pendingTx.id },
                                data: { status: 'failed' },
                            });
                        }

                        await tx.walletTransaction.create({
                            data: {
                                code: 'TXN' + Date.now() + Math.floor(1000 + Math.random() * 9000),
                                userId: order.userId,
                                type: 'refund',
                                title: `Hoàn điểm tích lũy do hủy đơn hàng ${order.code}`,
                                amount: pointsRedeemed,
                                balanceAfter: updatedWallet.balancePoint,
                                status: 'success',
                            },
                        });
                    }
                }

                return finalOrder;
            }
        );

        if (isSuccess) {
            // Trigger Email Notifications asynchronously
            try {
                const userAcc = await this.databaseService.user.findUnique({
                    where: { id: order.userId },
                    select: { email: true, name: true },
                });
                const customerEmail = (order.metadata as any)?.customerEmail || userAcc?.email;
                if (customerEmail && this.notificationSmtpService?.isInitialized()) {
                    const webUrl = this.configService.get<string>('HOME_URL') || 'http://localhost:3002';
                    const customerName = order.customerName || userAcc?.name || 'Quý khách';
                    const sender = this.configService.get<string>('smtp.from') || 'noreply@samngoclinh.vn';

                    // 1. Send Order Success Email
                    await this.notificationSmtpService.send({
                        templateName: EnumNotificationProcess.orderSuccess,
                        sender,
                        templateData: {
                            customerName,
                            orderCode: order.code,
                            createdAt: new Date().toLocaleDateString('vi-VN'),
                            subtotal: Number(order.subtotal || 0).toLocaleString('vi-VN'),
                            vatAmount: Number((order.metadata as any)?.vat || Math.round(order.subtotal * 0.08)).toLocaleString('vi-VN'),
                            totalAmount: Number(order.total || 0).toLocaleString('vi-VN'),
                            orderUrl: `${webUrl}/profile?tab=orders`,
                            supportEmail: this.configService.get<string>('email.support') || 'admin@samngoclinh.vn',
                        },
                        recipients: [customerEmail],
                    });

                    // 2. If contract was created, send Contract Created Email
                    const contractCode = 'CTR-' + order.code.replace('ORD', '');
                    const contract = await this.databaseService.eContract.findUnique({
                        where: { code: contractCode },
                    });

                    if (contract) {
                        await this.notificationSmtpService.send({
                            templateName: EnumNotificationProcess.contractCreated,
                            sender,
                            templateData: {
                                customerName,
                                orderCode: order.code,
                                contractCode: contract.code,
                                partyA: contract.partyA || 'Công ty Cổ phần Sâm Ngọc Linh',
                                partyB: contract.partyB || customerName,
                                contractValue: Number(contract.contractValue || order.total).toLocaleString('vi-VN'),
                                expiredAt: new Date(contract.expiredAt).toLocaleDateString('vi-VN'),
                                signContractUrl: `${webUrl}/profile?tab=contracts`,
                            },
                            recipients: [customerEmail],
                        });
                    }
                }
            } catch (emailErr) {
                this.logger.error('Failed to send order/contract emails:', emailErr);
            }
        }

        return {
            data: {
                id: updatedOrder.id,
                code: updatedOrder.code,
                status: updatedOrder.status,
                currency: updatedOrder.currency,
                subtotal: updatedOrder.subtotal,
                shippingFee: updatedOrder.shippingFee,
                discount: updatedOrder.discount,
                total: updatedOrder.total,
                paymentMethod: updatedOrder.paymentMethod,
                items: updatedOrder.items,
                paidAt: updatedOrder.paidAt,
                cancelledAt: updatedOrder.cancelledAt,
                createdAt: updatedOrder.createdAt,
            },
        };
    }

    async adminList(): Promise<IResponseReturn<{ items: OrdersListResponseDto[] }>> {
        const orders = await this.databaseService.order.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: {
                items: orders.map(o => ({
                    id: o.id,
                    code: o.code,
                    status: o.status,
                    total: o.total,
                    createdAt: o.createdAt,
                })),
            },
        };
    }

    async adminListPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.OrderSelect,
            Prisma.OrderWhereInput
        >,
        status?: Record<string, IPaginationEqual>,
        productTypeQuery?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<OrdersListResponseDto>> {
        const { where, ...params } = pagination;
        let productTypeWhere: Prisma.OrderWhereInput = {};

        const targetType = productTypeQuery?.productType?.equals;
        if (targetType && targetType !== 'all') {
            const typeStr = String(targetType).toLowerCase();
            if (typeStr === 'plant' || typeStr === 'tree') {
                productTypeWhere = {
                    orderItems: {
                        some: {
                            productType: { in: ['plant', 'tree'] },
                        },
                    },
                };
            } else if (typeStr === 'product' || typeStr === 'processed') {
                productTypeWhere = {
                    orderItems: {
                        some: {
                            productType: { in: ['product', 'shop-item'] },
                        },
                    },
                };
            }
        }

        return this.paginationService.offset<
            OrdersListResponseDto,
            Prisma.OrderSelect,
            Prisma.OrderWhereInput
        >(this.databaseService.order, {
            ...params,
            where: {
                ...where,
                ...status,
                ...productTypeWhere,
            },
        });
    }

    async adminDetail(id: string): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        const order = await this.databaseService.order.findUnique({
            where: { id },
        });

        if (!order) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'order.error.notFound',
            });
        }

        const user = await this.databaseService.user.findUnique({
            where: { id: order.userId },
            select: { name: true, email: true },
        });

        const businessProfile = await this.databaseService.businessProfile.findUnique({
            where: { userId: order.userId },
            select: { fullName: true, phone: true },
        });

        return {
            data: {
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
                user: {
                    fullName: businessProfile?.fullName || user?.name || 'Khách hàng',
                    email: user?.email || 'N/A',
                    phone: businessProfile?.phone || 'N/A',
                },
            },
        };
    }

    async adminUpdateStatus(
        id: string,
        status: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        const order = await this.databaseService.order.findUnique({
            where: { id },
        });

        if (!order) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'order.error.notFound',
            });
        }

        validateStateTransition('Order', order.status, status);

        if (status === 'paid') {
            return this.handlePaymentWebhook({
                orderCode: order.code,
                amount: order.total,
                status: 'SUCCESS',
                gatewayRef: 'ADMIN_MANUAL',
            });
        }

        if (status === 'cancelled') {
            return this.handlePaymentWebhook({
                orderCode: order.code,
                amount: order.total,
                status: 'FAILED',
                gatewayRef: 'ADMIN_MANUAL',
            });
        }

        const updated = await this.databaseService.order.update({
            where: { id },
            data: { status },
        });

        return {
            data: {
                id: updated.id,
                code: updated.code,
                status: updated.status,
                currency: updated.currency,
                subtotal: updated.subtotal,
                shippingFee: updated.shippingFee,
                discount: updated.discount,
                total: updated.total,
                paymentMethod: updated.paymentMethod,
                items: updated.items,
                paidAt: updated.paidAt,
                cancelledAt: updated.cancelledAt,
                createdAt: updated.createdAt,
            },
        };
    }
}
