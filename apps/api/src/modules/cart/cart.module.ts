import { Module } from '@nestjs/common';
import { CartService } from '@modules/cart/services/cart.service';

@Module({
    controllers: [],
    providers: [CartService],
    exports: [CartService],
    imports: [],
})
export class CartModule {}
