import { ActivityLogAdminController } from '@modules/activity-log/controllers/activity-log.admin.controller';
import { ApiKeyAdminController } from '@modules/api-key/controllers/api-key.admin.controller';
import { BackofficeAdminController } from '@modules/backoffice/controllers/backoffice.admin.controller';
import { BackofficeModule } from '@modules/backoffice/backoffice.module';
import { DeviceAdminController } from '@modules/device/controllers/device.admin.controller';
import { DeviceModule } from '@modules/device/device.module';
import { FeatureFlagAdminController } from '@modules/feature-flag/controllers/feature-flag.admin.controller';
import { PasswordHistoryAdminController } from '@modules/password-history/controllers/password-history.admin.controller';
import { PasswordHistoryModule } from '@modules/password-history/password-history.module';
import { RoleAdminController } from '@modules/role/controllers/role.admin.controller';
import { SessionAdminController } from '@modules/session/controllers/session.admin.controller';
import { TermPolicyAdminController } from '@modules/term-policy/controllers/term-policy.admin.controller';
import { UserAdminController } from '@modules/user/controllers/user.admin.controller';
import { UserModule } from '@modules/user/user.module';
import { IdentityVerificationAdminController } from '@modules/identity-verification/controllers/identity-verification.admin.controller';
import { IdentityVerificationModule } from '@modules/identity-verification/identity-verification.module';
import { CultivationAdminController } from '@modules/cultivation/controllers/cultivation.admin.controller';
import { CultivationModule } from '@modules/cultivation/cultivation.module';
import { EContractAdminController } from '@modules/e-contract/controllers/e-contract.admin.controller';
import { EContractModule } from '@modules/e-contract/e-contract.module';
import { PackagesAdminController } from '@modules/packages/controllers/packages.admin.controller';
import { PackagesModule } from '@modules/packages/packages.module';
import { CatalogAdminController } from '@modules/catalog/controllers/catalog.admin.controller';
import { CatalogModule } from '@modules/catalog/catalog.module';
import { ContentAdminController } from '@modules/content/controllers/content.admin.controller';
import { ContentModule } from '@modules/content/content.module';
import { OrdersAdminController } from '@modules/orders/controllers/orders.admin.controller';
import { OrdersModule } from '@modules/orders/orders.module';
import { MarketplaceAdminController } from '@modules/marketplace/controllers/marketplace.admin.controller';
import { MarketplaceModule } from '@modules/marketplace/marketplace.module';
import { ProfileAdminController } from '@modules/profile/controllers/profile.admin.controller';
import { ProfileModule } from '@modules/profile/profile.module';
import { WalletAdminController } from '@modules/wallet/controllers/wallet.admin.controller';
import { WalletModule } from '@modules/wallet/wallet.module';
import { PromotionAdminController } from '@modules/promotion/controllers/promotion.admin.controller';
import { PromotionModule } from '@modules/promotion/promotion.module';
import { NotificationAdminController } from '@modules/notification/controllers/notification.admin.controller';
import { NotificationModule } from '@modules/notification/notification.module';
import { SettingAdminController } from '@modules/setting/controllers/setting.admin.controller';
import { SettingModule } from '@modules/setting/setting.module';
import { ContactAdminController } from '@modules/contact/controllers/contact.admin.controller';
import { ContactModule } from '@modules/contact/contact.module';
import { Module } from '@nestjs/common';

/**
 * Mounts administrative controllers: API key, role, user, password history, activity log,
 * session, term policy, feature flag, and device.
 */
@Module({
    controllers: [
        ApiKeyAdminController,
        RoleAdminController,
        UserAdminController,
        PasswordHistoryAdminController,
        ActivityLogAdminController,
        SessionAdminController,
        TermPolicyAdminController,
        FeatureFlagAdminController,
        BackofficeAdminController,
        DeviceAdminController,
        IdentityVerificationAdminController,
        CultivationAdminController,
        EContractAdminController,
        PackagesAdminController,
        CatalogAdminController,
        ContentAdminController,
        OrdersAdminController,
        MarketplaceAdminController,
        ProfileAdminController,
        WalletAdminController,
        PromotionAdminController,
        NotificationAdminController,
        SettingAdminController,
        ContactAdminController,
    ],
    providers: [],
    exports: [],
    imports: [
        UserModule,
        PasswordHistoryModule,
        DeviceModule,
        BackofficeModule,
        IdentityVerificationModule,
        CultivationModule,
        EContractModule,
        PackagesModule,
        CatalogModule,
        ContentModule,
        OrdersModule,
        MarketplaceModule,
        ProfileModule,
        WalletModule,
        PromotionModule,
        NotificationModule,
        SettingModule,
        ContactModule,
    ],
})
export class RoutesAdminModule {}
