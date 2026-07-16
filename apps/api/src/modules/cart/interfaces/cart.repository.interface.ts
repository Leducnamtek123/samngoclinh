import { Cart } from '@generated/prisma-client';

export interface ICartRepository {
    getCartByUserId(userId: string): Promise<Cart | null>;
    createCart(userId: string): Promise<Cart>;
    addItemToCart(
        userId: string,
        productId: string,
        quantity: number
    ): Promise<Cart>;
    updateItemQuantity(
        userId: string,
        productId: string,
        quantity: number
    ): Promise<Cart>;
    removeItemFromCart(userId: string, productId: string): Promise<Cart>;
    clearCart(userId: string): Promise<Cart>;
}
