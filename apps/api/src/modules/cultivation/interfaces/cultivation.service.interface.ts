import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { CultivationTreeResponseDto } from '@modules/cultivation/dtos/response/cultivation.tree.response.dto';
import { CultivationGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.garden.response.dto';
import { CultivationBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.bed.response.dto';

export interface ICultivationService {
    trees(userId: string): Promise<IResponseReturn<CultivationTreeResponseDto[]>>;
    gardens(userId: string): Promise<IResponseReturn<CultivationGardenResponseDto>>;
    beds(userId: string): Promise<IResponseReturn<{ items: CultivationBedResponseDto[] }>>;
}
