import { CountryPublicController } from '@modules/country/controllers/country.public.controller';
import { CountryModule } from '@modules/country/country.module';
import { CatalogPublicController } from '@modules/catalog/controllers/catalog.public.controller';
import { CatalogModule } from '@modules/catalog/catalog.module';
import { ContentPublicController } from '@modules/content/controllers/content.public.controller';
import { ContentModule } from '@modules/content/content.module';
import { HelloPublicController } from '@modules/hello/controllers/hello.public.controller';
import { HelloModule } from '@modules/hello/hello.module';
import { MarketplacePublicController } from '@modules/marketplace/controllers/marketplace.public.controller';
import { MarketplaceModule } from '@modules/marketplace/marketplace.module';
import { PromotionPublicController } from '@modules/promotion/controllers/promotion.public.controller';
import { PromotionModule } from '@modules/promotion/promotion.module';
import { TermPolicyPublicController } from '@modules/term-policy/controllers/term-policy.public.controller';
import { UserPublicController } from '@modules/user/controllers/user.public.controller';
import { UserModule } from '@modules/user/user.module';
import { ContactUserController } from '@modules/contact/controllers/contact.user.controller';
import { ContactModule } from '@modules/contact/contact.module';
import { Module } from '@nestjs/common';

/**
 * Mounts unauthenticated public controllers: country, hello, user, and term policy.
 */
@Module({
    controllers: [
        CountryPublicController,
        CatalogPublicController,
        ContentPublicController,
        HelloPublicController,
        MarketplacePublicController,
        PromotionPublicController,
        UserPublicController,
        TermPolicyPublicController,
        ContactUserController,
    ],
    providers: [],
    exports: [],
    imports: [
        CountryModule,
        CatalogModule,
        ContentModule,
        HelloModule,
        MarketplaceModule,
        PromotionModule,
        UserModule,
        ContactModule,
    ],
})
export class RoutesPublicModule {}
