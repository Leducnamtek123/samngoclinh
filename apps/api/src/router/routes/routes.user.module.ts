import { CartUserController } from '@modules/cart/controllers/cart.user.controller';
import { CartModule } from '@modules/cart/cart.module';
import { CultivationUserController } from '@modules/cultivation/controllers/cultivation.user.controller';
import { CultivationProviderController } from '@modules/cultivation/controllers/cultivation.provider.controller';
import { CultivationModule } from '@modules/cultivation/cultivation.module';
import { IdentityVerificationUserController } from '@modules/identity-verification/controllers/identity-verification.user.controller';
import { IdentityVerificationModule } from '@modules/identity-verification/identity-verification.module';
import { OrdersUserController } from '@modules/orders/controllers/orders.user.controller';
import { OrdersModule } from '@modules/orders/orders.module';
import { ProfileUserController } from '@modules/profile/controllers/profile.user.controller';
import { ProfileModule } from '@modules/profile/profile.module';
import { WalletUserController } from '@modules/wallet/controllers/wallet.user.controller';
import { WalletModule } from '@modules/wallet/wallet.module';
import { UserUserController } from '@modules/user/controllers/user.user.controller';
import { UserModule } from '@modules/user/user.module';
import { MarketplaceProviderController } from '@modules/marketplace/controllers/marketplace.provider.controller';
import { MarketplaceModule } from '@modules/marketplace/marketplace.module';
import { EContractUserController } from '@modules/e-contract/controllers/e-contract.user.controller';
import { EContractModule } from '@modules/e-contract/e-contract.module';
import { PackagesUserController } from '@modules/packages/controllers/packages.user.controller';
import { PackagesModule } from '@modules/packages/packages.module';
import { Module } from '@nestjs/common';

/**
 * Mounts controllers for the authenticated end-user scope.
 */
@Module({
    controllers: [
        UserUserController,
        ProfileUserController,
        WalletUserController,
        OrdersUserController,
        CultivationUserController,
        CultivationProviderController,
        CartUserController,
        IdentityVerificationUserController,
        MarketplaceProviderController,
        EContractUserController,
        PackagesUserController,
    ],
    providers: [],
    exports: [],
    imports: [
        UserModule,
        ProfileModule,
        WalletModule,
        OrdersModule,
        CultivationModule,
        CartModule,
        IdentityVerificationModule,
        MarketplaceModule,
        EContractModule,
        PackagesModule,
    ],
})
export class RoutesUserModule {}
