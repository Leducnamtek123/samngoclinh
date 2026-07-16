import { Injectable } from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { IProviderDashboardService } from '@modules/provider-dashboard/interfaces/provider-dashboard.service.interface';
import { ProviderDashboardRepository } from '@modules/provider-dashboard/repositories/provider-dashboard.repository';
import { ProviderDashboardOverviewResponseDto } from '@modules/provider-dashboard/dtos/response/provider-dashboard.overview.response.dto';

@Injectable()
export class ProviderDashboardService implements IProviderDashboardService {
    constructor(
        private readonly providerDashboardRepository: ProviderDashboardRepository
    ) {}

    async overview(
        userId: string
    ): Promise<IResponseReturn<ProviderDashboardOverviewResponseDto>> {
        const data = await this.providerDashboardRepository.getOverview(userId);

        return {
            data,
        };
    }
}
