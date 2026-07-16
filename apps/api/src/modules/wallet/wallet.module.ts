import { Module } from '@nestjs/common';
import { WalletRepository } from '@modules/wallet/repositories/wallet.repository';
import { WalletService } from '@modules/wallet/services/wallet.service';

@Module({
    controllers: [],
    providers: [WalletService, WalletRepository],
    exports: [WalletService, WalletRepository],
    imports: [],
})
export class WalletModule {}
