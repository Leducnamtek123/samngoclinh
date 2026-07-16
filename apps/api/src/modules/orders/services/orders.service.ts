import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { IOrdersService } from '@modules/orders/interfaces/orders.service.interface';
import { OrdersRepository } from '@modules/orders/repositories/orders.repository';
import { OrdersListResponseDto } from '@modules/orders/dtos/response/orders.list.response.dto';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';
import { DatabaseService } from '@common/database/services/database.service';
import { OrdersPaymentWebhookRequestDto } from '@modules/orders/dtos/request/orders.payment-webhook.request.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService implements IOrdersService {
    constructor(
        private readonly ordersRepository: OrdersRepository,
        private readonly databaseService: DatabaseService
    ) {}

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

        return {
            data: order,
        };
    }

    async checkout(
        userId: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        const cart = await this.databaseService.cart.findUnique({
            where: { userId },
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'cart.error.empty',
            });
        }

        const productIds = cart.items.map(item => item.productId);
        const products = await this.databaseService.catalogProduct.findMany({
            where: { id: { in: productIds } },
        });

        // 1. Validate stock and existence before transaction
        for (const cartItem of cart.items) {
            const product = products.find(p => p.id === cartItem.productId);
            if (!product) {
                throw new NotFoundException({
                    statusCode: 404,
                    message: `Product ${cartItem.productId} not found`,
                });
            }
            if (product.status !== 'active') {
                throw new BadRequestException({
                    statusCode: 400,
                    message: `Product ${product.name} is no longer active`,
                });
            }
            if (product.stock < cartItem.quantity) {
                throw new BadRequestException({
                    statusCode: 400,
                    message: `Insufficient stock for product ${product.name}. Stock: ${product.stock}, Requested: ${cartItem.quantity}`,
                });
            }
        }

        // 2. Perform checkout as a transaction
        const order = await this.databaseService.$transaction(async tx => {
            // Decrement stock for all items
            for (const cartItem of cart.items) {
                await tx.catalogProduct.update({
                    where: { id: cartItem.productId },
                    data: {
                        stock: {
                            decrement: cartItem.quantity,
                        },
                    },
                });
            }

            // Calculate costs
            let subtotal = 0;
            const orderItems = cart.items.map(cartItem => {
                const product = products.find(
                    p => p.id === cartItem.productId
                )!;
                const itemTotalPrice = product.price * cartItem.quantity;
                subtotal += itemTotalPrice;

                return {
                    productId: cartItem.productId,
                    code: product.code,
                    name: product.name,
                    price: product.price,
                    quantity: cartItem.quantity,
                    totalPrice: itemTotalPrice,
                };
            });

            const shippingFee = 30000; // Flat shipping rate of 30,000 VND
            const discount = 0;
            const total = subtotal + shippingFee - discount;
            const code =
                'ORD' + Date.now() + Math.floor(1000 + Math.random() * 9000);

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
                    paymentMethod: 'bank_transfer',
                    items: orderItems,
                },
            });

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
                items: order.items,
                paidAt: order.paidAt,
                cancelledAt: order.cancelledAt,
                createdAt: order.createdAt,
            },
        };
    }

    async handlePaymentWebhook(
        payload: OrdersPaymentWebhookRequestDto
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
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

        const updatedOrder = await this.databaseService.$transaction(
            async tx => {
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

                if (isSuccess) {
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

                    for (const item of orderItems) {
                        // Check if standard plant catalog product
                        const plant = await tx.catalogPlant.findFirst({
                            where: { code: item.code },
                        });

                        const isPlant = !!plant || item.category === 'plant';
                        const ageYear = plant ? plant.ageYear : 3;

                        if (isPlant) {
                            // Check if this item is a P2P listing owned by another customer
                            const listing = await tx.marketplaceListing.findFirst({
                                where: { code: item.code },
                            });

                            if (listing && listing.ownerType === 'customer' && listing.ownerUserId) {
                                // P2P trade consignment
                                const sellerId = listing.ownerUserId;
                                const buyerId = order.userId;
                                const listingMeta = (listing.metadata ?? {}) as Record<string, unknown>;
                                const treeCode = listingMeta?.treeCode as string;

                                if (treeCode) {
                                    // 1. Transfer ownership of the sâm tree
                                    await tx.cultivationTree.update({
                                        where: { code: treeCode },
                                        data: { ownerUserId: buyerId },
                                    });

                                    // 2. Increment buyer treesOwned
                                    let buyerWallet = await tx.walletAccount.findUnique({
                                        where: { userId: buyerId },
                                    });
                                    if (!buyerWallet) {
                                        buyerWallet = await tx.walletAccount.create({
                                            data: { userId: buyerId, balancePoint: 0, treesOwned: 0 },
                                        });
                                    }
                                    await tx.walletAccount.update({
                                        where: { id: buyerWallet.id },
                                        data: { treesOwned: { increment: 1 } },
                                    });

                                    // 3. Decrement seller treesOwned and credit VND converted to points (1 point per 10k VND)
                                    let sellerWallet = await tx.walletAccount.findUnique({
                                        where: { userId: sellerId },
                                    });
                                    if (!sellerWallet) {
                                        sellerWallet = await tx.walletAccount.create({
                                            data: { userId: sellerId, balancePoint: 0, treesOwned: 0 },
                                        });
                                    }

                                    const salesAmountPoints = Math.floor(item.totalPrice / 10000);
                                    const updatedSellerWallet = await tx.walletAccount.update({
                                        where: { id: sellerWallet.id },
                                        data: {
                                            treesOwned: { decrement: 1 },
                                            balancePoint: { increment: salesAmountPoints },
                                        },
                                    });

                                    // 4. Create P2P transaction log for seller
                                    await tx.walletTransaction.create({
                                        data: {
                                            code: 'TXN' + Date.now() + Math.floor(1000 + Math.random() * 9000),
                                            userId: sellerId,
                                            type: 'p2p_sale',
                                            title: `Doanh thu bán ký gửi sâm đơn hàng ${order.code}`,
                                            amount: salesAmountPoints,
                                            balanceAfter: updatedSellerWallet.balancePoint,
                                            status: 'success',
                                        },
                                    });

                                    // 5. Update listing to sold
                                    await tx.marketplaceListing.update({
                                        where: { id: listing.id },
                                        data: { status: 'sold', quantity: 0 },
                                    });
                                }
                            } else {
                                // Standard system purchase
                                totalPlantsPurchased += item.quantity;

                                // Find unassigned/provider sâm trees to assign to buyer
                                const providerTrees = await tx.cultivationTree.findMany({
                                    where: {
                                        ownerUserId: { not: order.userId },
                                        ageYear: ageYear,
                                        status: 'active',
                                    },
                                    take: item.quantity,
                                });

                                let assignedCount = 0;
                                for (const tree of providerTrees) {
                                    await tx.cultivationTree.update({
                                        where: { id: tree.id },
                                        data: { ownerUserId: order.userId },
                                    });
                                    assignedCount++;
                                }

                                // If not enough existing trees, create new ones for the customer
                                const remaining = item.quantity - assignedCount;
                                for (let i = 0; i < remaining; i++) {
                                    const treeCode = 'tree-' + Math.random().toString(36).substring(2, 11);
                                    await tx.cultivationTree.create({
                                        data: {
                                            code: treeCode,
                                            ownerUserId: order.userId,
                                            name: item.name,
                                            ageYear: ageYear,
                                            quantity: 1,
                                            status: 'active',
                                            metadata: { source: 'purchase', orderCode: order.code } as Prisma.InputJsonValue,
                                        },
                                    });
                                }
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
                }

                return finalOrder;
            }
        );

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
}
