import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { CultivationTreeResponseDto } from '@modules/cultivation/dtos/response/cultivation.tree.response.dto';
import { CultivationGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.garden.response.dto';
import { CultivationBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.bed.response.dto';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';
import { CultivationCreateCareLogRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-care-log.request.dto';
import { CultivationCreateBookingRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-booking.request.dto';
import { CultivationUpdateBookingStatusRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-booking-status.request.dto';
import { CultivationBed, CultivationBedLocation, CultivationCareLog, CultivationGarden, CultivationTree, GardenBooking, Prisma } from '@generated/prisma-client';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';
import {
    ICultivationBedDetail,
    ICultivationBedLocationsGenerateResult,
    ICultivationTreeDetail,
} from '@modules/cultivation/interfaces/cultivation.interface';

import { CultivationUpdateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-garden.request.dto';
import { CultivationUpdateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-bed.request.dto';
import { CultivationUpdateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-tree.request.dto';

export interface ICultivationService {
    trees(userId: string): Promise<IResponseReturn<CultivationTreeResponseDto[]>>;
    gardens(userId: string): Promise<IResponseReturn<CultivationGardenResponseDto>>;
    gardensList(userId: string, isAdmin?: boolean): Promise<IResponseReturn<CultivationGarden[]>>;
    gardensPaginated(
        userId: string,
        isAdmin: boolean,
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationGardenSelect,
            Prisma.CultivationGardenWhereInput
        >
    ): Promise<IResponsePagingReturn<CultivationGarden>>;
    beds(
        userId: string,
        isAdmin: boolean,
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationBedSelect,
            Prisma.CultivationBedWhereInput
        >,
        status?: Record<string, IPaginationEqual>,
        gardenCode?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CultivationBedResponseDto>>;
    createGarden(userId: string, payload: CultivationCreateGardenRequestDto): Promise<IResponseReturn<CultivationGarden>>;
    createBed(userId: string, payload: CultivationCreateBedRequestDto): Promise<IResponseReturn<CultivationBed>>;
    createTree(userId: string, payload: CultivationCreateTreeRequestDto): Promise<IResponseReturn<CultivationTree>>;
    createCareLog(userId: string, payload: CultivationCreateCareLogRequestDto): Promise<IResponseReturn<CultivationCareLog>>;
    listCareLogs(bedCode?: string, treeCode?: string): Promise<IResponseReturn<CultivationCareLog[]>>;
    createBooking(userId: string, payload: CultivationCreateBookingRequestDto): Promise<IResponseReturn<GardenBooking>>;
    listBookings(userId?: string): Promise<IResponseReturn<GardenBooking[]>>;
    updateBookingStatus(id: string, payload: CultivationUpdateBookingStatusRequestDto): Promise<IResponseReturn<GardenBooking>>;

    updateGarden(id: string, payload: CultivationUpdateGardenRequestDto): Promise<IResponseReturn<CultivationGarden>>;
    deleteGarden(id: string): Promise<IResponseReturn<void>>;
    updateBed(id: string, payload: CultivationUpdateBedRequestDto): Promise<IResponseReturn<CultivationBed>>;
    deleteBed(id: string): Promise<IResponseReturn<void>>;
    updateTree(id: string, payload: CultivationUpdateTreeRequestDto): Promise<IResponseReturn<CultivationTree>>;
    deleteTree(id: string): Promise<IResponseReturn<void>>;
    gardenDetail(id: string, userId: string, isAdmin?: boolean): Promise<IResponseReturn<CultivationGarden>>;
    bedDetail(id: string, userId: string, isAdmin?: boolean): Promise<IResponseReturn<ICultivationBedDetail>>;
    treeDetail(id: string, userId: string, isAdmin?: boolean): Promise<IResponseReturn<ICultivationTreeDetail>>;

    getBedLocations(bedCode: string): Promise<IResponseReturn<CultivationBedLocation[]>>;
    generateBedLocations(bedCode: string, rows: number, cols: number): Promise<IResponseReturn<ICultivationBedLocationsGenerateResult>>;
    updateBedLocation(id: string, status: string, treeCode?: string): Promise<IResponseReturn<CultivationBedLocation>>;
    deleteBedLocation(id: string): Promise<IResponseReturn<void>>;
    listAllTreesAdmin(): Promise<IResponseReturn<CultivationTree[]>>;
    listAllTreesAdminPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationTreeSelect,
            Prisma.CultivationTreeWhereInput
        >,
        status?: Record<string, IPaginationEqual>,
        health?: Record<string, IPaginationEqual>,
        ownerUserId?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CultivationTree>>;
}

