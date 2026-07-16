import { Module } from '@nestjs/common';
import { EContractRepository } from '@modules/e-contract/repositories/e-contract.repository';
import { EContractService } from '@modules/e-contract/services/e-contract.service';

@Module({
    controllers: [],
    providers: [EContractService, EContractRepository],
    exports: [EContractService, EContractRepository],
    imports: [],
})
export class EContractModule {}
