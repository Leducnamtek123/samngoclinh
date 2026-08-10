import { CountryPublicController } from '@modules/country/controllers/country.public.controller';
import { CountryModule } from '@modules/country/country.module';
import { CatalogPublicController } from '@modules/catalog/controllers/catalog.public.controller';
import { CatalogModule } from '@modules/catalog/catalog.module';
import { ContentPublicController } from '@modules/content/controllers/content.public.controller';
import { ContentModule } from '@modules/content/content.module';
import { HelloPublicController } from '@modules/hello/controllers/hello.public.controller';
import { HelloModule } from '@modules/hello/hello.module';
import { PromotionPublicController } from '@modules/promotion/controllers/promotion.public.controller';
import { PromotionModule } from '@modules/promotion/promotion.module';
import { TermPolicyPublicController } from '@modules/term-policy/controllers/term-policy.public.controller';
import { UserPublicController } from '@modules/user/controllers/user.public.controller';
import { UserModule } from '@modules/user/user.module';
import { ContactUserController } from '@modules/contact/controllers/contact.user.controller';
import { ContactModule } from '@modules/contact/contact.module';
import { SettingPublicController } from '@modules/setting/controllers/setting.public.controller';
import { SettingModule } from '@modules/setting/setting.module';
import { BannerPublicController } from '@modules/banner/controllers/banner.public.controller';
import { BannerModule } from '@modules/banner/banner.module';
import { SepayPublicController } from '@modules/sepay/controllers/sepay.public.controller';
import { SepayModule } from '@modules/sepay/sepay.module';
import { CultivationPublicController } from '@modules/cultivation/controllers/cultivation.public.controller';
import { CultivationModule } from '@modules/cultivation/cultivation.module';
import { Module } from '@nestjs/common';

/**
 * Mounts unauthenticated public controllers: country, hello, user, term policy, and sepay.
 */
@Module({
    controllers: [
        CountryPublicController,
        CatalogPublicController,
        ContentPublicController,
        HelloPublicController,
        PromotionPublicController,
        UserPublicController,
        TermPolicyPublicController,
        ContactUserController,
        SettingPublicController,
        BannerPublicController,
        SepayPublicController,
        CultivationPublicController,
    ],
    providers: [],
    exports: [],
    imports: [
        CountryModule,
        CatalogModule,
        ContentModule,
        HelloModule,
        PromotionModule,
        UserModule,
        ContactModule,
        SettingModule,
        BannerModule,
        SepayModule,
        CultivationModule,
    ],
})
export class RoutesPublicModule {}

