import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@common/database/services/database.service';
import { ICartRepository } from '@modules/cart/interfaces/cart.repository.interface';
import { Cart } from '@generated/prisma-client';

@Injectable()
export class CartRepository implements ICartRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getCartByUserId(userId: string): Promise<Cart | null> {
        return this.databaseService.cart.findUnique({
            where: { userId },
        });
    }

    async createCart(userId: string): Promise<Cart> {
        return this.databaseService.cart.create({
            data: {
                userId,
                items: [],
            },
        });
    }

    async addItemToCart(
        userId: string,
        productId: string,
        quantity: number
    ): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
        if (!cart) {
            cart = await this.createCart(userId);
        }

        const items = [...cart.items];
        const existingItem = items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            items.push({ productId, quantity });
        }

        return this.databaseService.cart.update({
            where: { userId },
            data: { items },
        });
    }

    async updateItemQuantity(
        userId: string,
        productId: string,
        quantity: number
    ): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
        if (!cart) {
            cart = await this.createCart(userId);
        }

        const items = [...cart.items];
        const existingItem = items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            items.push({ productId, quantity });
        }

        return this.databaseService.cart.update({
            where: { userId },
            data: { items },
        });
    }

    async removeItemFromCart(userId: string, productId: string): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
        if (!cart) {
            cart = await this.createCart(userId);
        }

        const items = cart.items.filter(item => item.productId !== productId);

        return this.databaseService.cart.update({
            where: { userId },
            data: { items },
        });
    }

    async clearCart(userId: string): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
        if (!cart) {
            cart = await this.createCart(userId);
        }

        return this.databaseService.cart.update({
            where: { userId },
            data: { items: [] },
        });
    }
}
