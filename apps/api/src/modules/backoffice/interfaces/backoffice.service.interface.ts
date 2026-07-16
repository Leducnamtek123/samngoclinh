import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { BackofficeOverviewResponseDto } from '@modules/backoffice/dtos/response/backoffice.overview.response.dto';

export interface IBackofficeService {
    overview(): Promise<IResponseReturn<BackofficeOverviewResponseDto>>;
}
