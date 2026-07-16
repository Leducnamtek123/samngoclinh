import { Injectable } from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { IBackofficeService } from '@modules/backoffice/interfaces/backoffice.service.interface';
import { BackofficeRepository } from '@modules/backoffice/repositories/backoffice.repository';
import { BackofficeOverviewResponseDto } from '@modules/backoffice/dtos/response/backoffice.overview.response.dto';

@Injectable()
export class BackofficeService implements IBackofficeService {
    constructor(private readonly backofficeRepository: BackofficeRepository) {}

    async overview(): Promise<IResponseReturn<BackofficeOverviewResponseDto>> {
        const overviewData = await this.backofficeRepository.getOverview();

        return {
            data: overviewData,
        };
    }
}
