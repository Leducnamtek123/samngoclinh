import { Module } from '@nestjs/common';
import { CartUserController } from '@modules/cart/controllers/cart.user.controller';
import { CartService } from '@modules/cart/services/cart.service';
import { CartRepository } from '@modules/cart/repositories/cart.repository';

@Module({
    controllers: [CartUserController],
    providers: [CartService, CartRepository],
    exports: [CartService],
    imports: [],
})
export class CartModule {}
