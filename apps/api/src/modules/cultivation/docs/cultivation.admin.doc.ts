import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { CultivationUpdateBookingStatusRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-booking-status.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function CultivationAdminUpdateBookingStatusDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Approve or reject a garden visit booking request',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Booking ID',
                    required: true,
                    type: 'string',
                },
            ],
            bodyType: EnumDocRequestBodyType.json,
            dto: CultivationUpdateBookingStatusRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.adminUpdateBookingStatus')
    );
}

export function CultivationAdminListBookingsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List all garden visit bookings for admin review',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.adminListBookings')
    );
}
