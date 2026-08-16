import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ICartService } from '@modules/cart/interfaces/cart.service.interface';
import { CartSummaryResponseDto } from '@modules/cart/dtos/response/cart.summary.response.dto';
import { CartRepository } from '@modules/cart/repositories/cart.repository';
import { DatabaseService } from '@common/database/services/database.service';
import { CartAddItemRequestDto } from '@modules/cart/dtos/request/cart.add-item.request.dto';
import { CartUpdateItemRequestDto } from '@modules/cart/dtos/request/cart.update-item.request.dto';
import { CartItem } from '@generated/prisma-client';

@Injectable()
export class CartService implements ICartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly databaseService: DatabaseService
    ) {}

    private async mapToSummaryDto(
        cartItems: { productId: string; quantity: number }[]
    ): Promise<CartSummaryResponseDto> {
        if (cartItems.length === 0) {
            return {
                itemsCount: 0,
                total: 0,
                empty: true,
                items: [],
            };
        }

        const productIds = cartItems.map(item => item.productId);
        const products = await this.databaseService.catalogProduct.findMany({
            where: { id: { in: productIds } },
        });
        const plants = await this.databaseService.catalogPlant.findMany({
            where: { id: { in: productIds } },
        });

        const items = cartItems.map(item => {
            const product: any =
                products.find(p => p.id === item.productId) ||
                plants.find(p => p.id === item.productId);
            if (!product) {
                return {
                    productId: item.productId,
                    productName: 'Unknown Product',
                    price: 0,
                    quantity: item.quantity,
                    totalPrice: 0,
                    imageUrl: undefined,
                    stock: 0,
                    category: undefined,
                    images: [],
                };
            }

            return {
                productId: item.productId,
                productName: product.name,
                price: product.price,
                quantity: item.quantity,
                totalPrice: product.price * item.quantity,
                imageUrl: product.images?.[0] ?? undefined,
                stock: product.stock,
                category: (product as any).category || 'Sâm giống',
                images: product.images || [],
            };
        });

        const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
        const total = items.reduce((acc, item) => acc + item.totalPrice, 0);

        return {
            itemsCount,
            total,
            empty: items.length === 0,
            items,
        };
    }

    async summary(
        userId: string
    ): Promise<IResponseReturn<CartSummaryResponseDto>> {
        let cart = await this.cartRepository.getCartByUserId(userId);
        if (!cart) {
            cart = await this.cartRepository.createCart(userId);
        }

        return {
            data: await this.mapToSummaryDto(cart.items as unknown as CartItem[]),
        };
    }

    async addItem(
        userId: string,
        payload: CartAddItemRequestDto
    ): Promise<IResponseReturn<CartSummaryResponseDto>> {
        let product: any = await this.databaseService.catalogProduct.findUnique({
            where: { id: payload.productId },
        });
        if (!product) {
            product = await this.databaseService.catalogPlant.findUnique({
                where: { id: payload.productId },
            });
        }
        if (!product) {
            product = await this.databaseService.catalogProduct.findFirst({
                where: { code: payload.productId },
            });
        }
        if (!product) {
            product = await this.databaseService.catalogPlant.findFirst({
                where: { code: payload.productId },
            });
        }

        if (!product) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'cart.error.productNotFound',
            });
        }

        const isAvailable = product.status === 'available' || product.status === 'active';
        if (!isAvailable) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'cart.error.productNotAvailable',
            });
        }

        if (product.stock < payload.quantity) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'cart.error.insufficientStock',
                messageProperties: { stock: product.stock },
            });
        }

        const cart = await this.cartRepository.addItemToCart(
            userId,
            product.id,
            payload.quantity
        );

        return {
            data: await this.mapToSummaryDto(cart.items as unknown as CartItem[]),
        };
    }

    async updateItem(
        userId: string,
        productId: string,
        payload: CartUpdateItemRequestDto
    ): Promise<IResponseReturn<CartSummaryResponseDto>> {
        let product: any = await this.databaseService.catalogProduct.findUnique({
            where: { id: productId },
        });
        if (!product) {
            product = await this.databaseService.catalogPlant.findUnique({
                where: { id: productId },
            });
        }

        if (!product) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'cart.error.productNotFound',
            });
        }

        if (product.stock < payload.quantity) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'cart.error.insufficientStock',
                messageProperties: { stock: product.stock },
            });
        }

        const cart = await this.cartRepository.updateItemQuantity(
            userId,
            productId,
            payload.quantity
        );

        return {
            data: await this.mapToSummaryDto(cart.items as unknown as CartItem[]),
        };
    }

    async removeItem(
        userId: string,
        productId: string
    ): Promise<IResponseReturn<CartSummaryResponseDto>> {
        const cart = await this.cartRepository.removeItemFromCart(
            userId,
            productId
        );

        return {
            data: await this.mapToSummaryDto(cart.items as unknown as CartItem[]),
        };
    }

    async clear(
        userId: string
    ): Promise<IResponseReturn<CartSummaryResponseDto>> {
        const cart = await this.cartRepository.clearCart(userId);

        return {
            data: await this.mapToSummaryDto(cart.items as unknown as CartItem[]),
        };
    }
}
