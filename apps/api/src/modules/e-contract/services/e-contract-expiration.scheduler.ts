import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from '@common/database/services/database.service';
import { EContractRepository } from '@modules/e-contract/repositories/e-contract.repository';

@Injectable()
export class EContractExpirationScheduler {
    private readonly logger = new Logger(EContractExpirationScheduler.name);

    constructor(
        private readonly eContractRepository: EContractRepository,
        private readonly databaseService: DatabaseService
    ) {}

    /**
     * Daily Cron job at 00:00 (Midnight) to automatically mark expired contracts
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleContractExpiration(): Promise<void> {
        this.logger.log('Starting automated daily contract expiration scan...');
        try {
            const overdueContracts = await this.eContractRepository.getOverdueExpiredContracts();
            if (!overdueContracts || overdueContracts.length === 0) {
                this.logger.log('No overdue signed contracts found to expire.');
                return;
            }

            this.logger.log(`Found ${overdueContracts.length} overdue contracts to mark as expired.`);

            for (const contract of overdueContracts) {
                await this.databaseService.eContract.update({
                    where: { id: contract.id },
                    data: {
                        status: 'expired',
                    },
                });
                this.logger.log(`Contract ${contract.code} (ID: ${contract.id}) transitioned to 'expired'.`);
            }

            this.logger.log(`Successfully expired ${overdueContracts.length} contracts.`);
        } catch (error: any) {
            this.logger.error(`Error during automated contract expiration cron: ${error?.message}`, error?.stack);
        }
    }
}
