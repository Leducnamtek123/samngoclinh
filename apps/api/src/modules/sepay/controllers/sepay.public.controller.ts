import {
    Body,
    Controller,
    Headers,
    Post,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { SepayService } from '@modules/sepay/services/sepay.service';
import { SepayWebhookDto } from '@modules/sepay/dtos/sepay-webhook.dto';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';

@ApiTags('modules.public.sepay')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/payment/sepay',
})
export class SepayPublicController {
    constructor(private readonly sepayService: SepayService) {}

    @Response('sepay.webhook')
    @Post('/webhook')
    async handleWebhook(
        @Body() body: SepayWebhookDto,
        @Headers('authorization') authHeader?: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        return this.sepayService.handleWebhook(body, authHeader);
    }
}
