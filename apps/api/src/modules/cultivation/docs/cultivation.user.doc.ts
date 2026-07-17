import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { CultivationTreeResponseDto } from '@modules/cultivation/dtos/response/cultivation.tree.response.dto';
import { CultivationGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.garden.response.dto';
import { CultivationBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.bed.response.dto';
import { CultivationCreateBookingRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-booking.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function CultivationUserTreesDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get user tree portfolio grouped by age',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.trees', {
            dto: CultivationTreeResponseDto,
        })
    );
}

export function CultivationUserGardensDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get user garden summary',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.gardens', {
            dto: CultivationGardenResponseDto,
        })
    );
}

export function CultivationUserBedsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get user beds list',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.beds', {
            dto: CultivationBedResponseDto,
        })
    );
}

export function CultivationUserListCareLogsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get care history logs for a bed or tree',
        }),
        DocRequest({
            queries: [
                {
                    name: 'bedCode',
                    description: 'Optional bed code to filter logs',
                    required: false,
                    type: 'string',
                },
                {
                    name: 'treeCode',
                    description: 'Optional tree code to filter logs',
                    required: false,
                    type: 'string',
                },
            ],
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.listCareLogs')
    );
}

export function CultivationUserCreateBookingDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create a new garden visit booking',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: CultivationCreateBookingRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.createBooking')
    );
}

export function CultivationUserListBookingsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List user garden visit bookings',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.listBookings')
    );
}

export function CultivationUserGardenDetailDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get details of a specific garden by ID',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Garden ID',
                    required: true,
                    type: 'string',
                },
            ],
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.gardens')
    );
}

export function CultivationUserBedDetailDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get details of a specific bed by ID',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Bed ID',
                    required: true,
                    type: 'string',
                },
            ],
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.beds')
    );
}

export function CultivationUserTreeDetailDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get details of a specific tree by ID',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Tree ID',
                    required: true,
                    type: 'string',
                },
            ],
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.trees')
    );
}

