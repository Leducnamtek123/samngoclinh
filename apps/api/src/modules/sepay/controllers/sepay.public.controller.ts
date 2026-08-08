import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Res,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { SepayService } from '@modules/sepay/services/sepay.service';
import { SepayWebhookDto } from '@modules/sepay/dtos/sepay-webhook.dto';
import { SepayPgIpnDto } from '@modules/sepay/dtos/sepay-pg-ipn.dto';
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

    @Get('/pay/:orderCode')
    async pay(
        @Param('orderCode') orderCode: string,
        @Res() res: ExpressResponse
    ): Promise<void> {
        const html = await this.sepayService.getCheckoutRedirectHtml(orderCode);
        // Nới CSP của helmet cho riêng trang chuyển hướng: cho phép script inline auto-submit
        // và form POST sang cổng thanh toán SePay.
        res.setHeader(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'unsafe-inline'; form-action https://pay.sepay.vn https://pay-sandbox.sepay.vn"
        );
        res.type('html').send(html);
    }

    @Post('/ipn')
    async ipn(
        @Body() body: SepayPgIpnDto,
        @Headers('x-secret-key') secretKey: string | undefined,
        @Res() res: ExpressResponse
    ): Promise<void> {
        const result = await this.sepayService.handlePgIpn(body, secretKey);
        res.status(200).json(result);
    }

    @Response('sepay.verify')
    @ApiKeyProtected()
    @Get('/verify/:orderCode')
    async verify(
        @Param('orderCode') orderCode: string
    ): Promise<IResponseReturn<{ code: string; status: string; total: number }>> {
        return { data: await this.sepayService.verifyOrder(orderCode) };
    }
}
