import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ProviderDashboardOverviewResponseDto } from '@modules/provider-dashboard/dtos/response/provider-dashboard.overview.response.dto';

export interface IProviderDashboardService {
    overview(userId: string): Promise<IResponseReturn<ProviderDashboardOverviewResponseDto>>;
}
