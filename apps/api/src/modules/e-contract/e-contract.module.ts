import { Module } from '@nestjs/common';
import { EContractRepository } from '@modules/e-contract/repositories/e-contract.repository';
import { ContractAmendmentRepository } from '@modules/e-contract/repositories/contract-amendment.repository';
import { EContractService } from '@modules/e-contract/services/e-contract.service';
import { EContractPdfService } from '@modules/e-contract/services/e-contract.pdf.service';
import { EContractTemplateService } from '@modules/e-contract/services/e-contract.template.service';
import { EContractExpirationScheduler } from '@modules/e-contract/services/e-contract-expiration.scheduler';

@Module({
    controllers: [],
    providers: [
        EContractService,
        EContractPdfService,
        EContractTemplateService,
        EContractRepository,
        ContractAmendmentRepository,
        EContractExpirationScheduler,
    ],
    exports: [
        EContractService,
        EContractPdfService,
        EContractTemplateService,
        EContractRepository,
        ContractAmendmentRepository,
        EContractExpirationScheduler,
    ],
    imports: [],
})
export class EContractModule {}
