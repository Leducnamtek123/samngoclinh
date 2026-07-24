import {
    BadRequestException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { OrdersService } from '@modules/orders/services/orders.service';
import { DatabaseService } from '@common/database/services/database.service';
import { SepayWebhookDto } from '@modules/sepay/dtos/sepay-webhook.dto';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';

export interface ISepayPaymentInfo {
    qrUrl: string;
    accountNumber: string;
    accountName: string;
    bankBrand: string;
    amount: number;
    orderCode: string;
}

@Injectable()
export class SepayService {
    private readonly logger = new Logger(SepayService.name);

    constructor(
        private readonly ordersService: OrdersService,
        private readonly databaseService: DatabaseService
    ) {}

    async getPaymentInfo(orderCode: string, amount: number): Promise<ISepayPaymentInfo> {
        const dbAcc = await this.databaseService.systemSetting.findUnique({
            where: { key: 'sepay_bank_account' },
        });
        const dbBank = await this.databaseService.systemSetting.findUnique({
            where: { key: 'sepay_bank_brand' },
        });
        const dbName = await this.databaseService.systemSetting.findUnique({
            where: { key: 'sepay_account_name' },
        });

        const accountNumber = dbAcc?.value || process.env.SEPAY_BANK_ACCOUNT || '';
        const bankBrand = dbBank?.value || process.env.SEPAY_BANK_BRAND || 'MBBank';
        const accountName = dbName?.value || process.env.SEPAY_ACCOUNT_NAME || '';

        const qrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(
            accountNumber
        )}&bank=${encodeURIComponent(bankBrand)}&amount=${amount}&des=${encodeURIComponent(
            orderCode
        )}&template=compact`;

        return {
            qrUrl,
            accountNumber,
            accountName,
            bankBrand,
            amount,
            orderCode,
        };
    }


    verifyWebhookAuth(authHeader?: string): boolean {
        const expectedSecret = process.env.SEPAY_WEBHOOK_API_KEY;
        if (!expectedSecret) {
            return true;
        }

        if (!authHeader) {
            return false;
        }

        const token = authHeader.replace(/^Apikey\s+/i, '').replace(/^Bearer\s+/i, '').trim();
        return token === expectedSecret.trim();
    }

    extractOrderCode(text: string): string | null {
        if (!text) return null;

        const match = text.match(/(ORD[A-Za-z0-9_]+)/i);
        return match ? match[1].toUpperCase() : null;
    }

    async handleWebhook(
        payload: SepayWebhookDto,
        authHeader?: string
    ): Promise<IResponseReturn<OrdersDetailResponseDto>> {
        this.logger.log(`Received SePay Webhook payload: ${JSON.stringify(payload)}`);

        if (!this.verifyWebhookAuth(authHeader)) {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Invalid SePay Webhook authorization key',
            });
        }

        const rawContent = payload.content || payload.transactionContent || payload.description || '';
        const orderCode = this.extractOrderCode(rawContent);

        if (!orderCode) {
            throw new BadRequestException({
                statusCode: 400,
                message: `Could not extract valid order code from transaction content: "${rawContent}"`,
            });
        }

        const amount = payload.transferAmount ?? payload.amountIn ?? 0;
        const refCode = payload.referenceCode || payload.id?.toString() || `SEPAY_${Date.now()}`;

        return this.ordersService.handlePaymentWebhook({
            orderCode,
            amount,
            status: 'SUCCESS',
            gatewayRef: `SEPAY_${payload.gateway}_${refCode}`,
        });
    }
}
