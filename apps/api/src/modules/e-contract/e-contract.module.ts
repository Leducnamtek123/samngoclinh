import { Module } from '@nestjs/common';
import { EContractRepository } from '@modules/e-contract/repositories/e-contract.repository';
import { EContractService } from '@modules/e-contract/services/e-contract.service';
import { EContractPdfService } from '@modules/e-contract/services/e-contract.pdf.service';

@Module({
    controllers: [],
    providers: [EContractService, EContractPdfService, EContractRepository],
    exports: [EContractService, EContractPdfService, EContractRepository],
    imports: [],
})
export class EContractModule {}
