import { Module } from '@nestjs/common';
import { CatalogRepository } from '@modules/catalog/repositories/catalog.repository';
import { CatalogService } from '@modules/catalog/services/catalog.service';

@Module({
    controllers: [],
    providers: [CatalogService, CatalogRepository],
    exports: [CatalogService],
    imports: [],
})
export class CatalogModule {}
