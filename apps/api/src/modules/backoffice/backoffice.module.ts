import { Module } from '@nestjs/common';
import { BackofficeRepository } from '@modules/backoffice/repositories/backoffice.repository';
import { BackofficeService } from '@modules/backoffice/services/backoffice.service';

@Module({
    controllers: [],
    providers: [BackofficeService, BackofficeRepository],
    exports: [BackofficeService, BackofficeRepository],
    imports: [],
})
export class BackofficeModule {}
