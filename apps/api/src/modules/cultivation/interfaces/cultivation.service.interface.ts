import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { CultivationTreeResponseDto } from '@modules/cultivation/dtos/response/cultivation.tree.response.dto';
import { CultivationGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.garden.response.dto';
import { CultivationBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.bed.response.dto';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';
import {
    CultivationBed,
    CultivationGarden,
    CultivationTree,
} from '@generated/prisma-client';

export interface ICultivationService {
    trees(
        userId: string
    ): Promise<IResponseReturn<CultivationTreeResponseDto[]>>;
    gardens(
        userId: string
    ): Promise<IResponseReturn<CultivationGardenResponseDto>>;
    beds(
        userId: string
    ): Promise<IResponseReturn<{ items: CultivationBedResponseDto[] }>>;
    createGarden(
        userId: string,
        payload: CultivationCreateGardenRequestDto
    ): Promise<IResponseReturn<CultivationGarden>>;
    createBed(
        userId: string,
        payload: CultivationCreateBedRequestDto
    ): Promise<IResponseReturn<CultivationBed>>;
    createTree(
        userId: string,
        payload: CultivationCreateTreeRequestDto
    ): Promise<IResponseReturn<CultivationTree>>;
}
