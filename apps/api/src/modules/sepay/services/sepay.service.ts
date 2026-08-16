import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
    OnModuleInit,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '@modules/orders/services/orders.service';
import { DatabaseService } from '@common/database/services/database.service';
import { SepayWebhookDto } from '@modules/sepay/dtos/sepay-webhook.dto';
import { SepayPgIpnDto } from '@modules/sepay/dtos/sepay-pg-ipn.dto';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { OrdersDetailResponseDto } from '@modules/orders/dtos/response/orders.detail.response.dto';
import {
    IPaymentGatewayProvider,
    IPaymentQrInfo,
} from '@modules/payment-gateway/interfaces/payment-gateway.interface';
import { PaymentGatewayRegistry } from '@modules/payment-gateway/services/payment-gateway.registry';
import { SePayPgClient } from 'sepay-pg-node';

@Injectable()
export class SepayService implements IPaymentGatewayProvider, OnModuleInit {
    readonly name = 'sepay';
    private readonly logger = new Logger(SepayService.name);

    constructor(
        private readonly ordersService: OrdersService,
        private readonly databaseService: DatabaseService,
        private readonly paymentGatewayRegistry: PaymentGatewayRegistry,
        private readonly configService: ConfigService
    ) {}

    onModuleInit(): void {
        this.paymentGatewayRegistry.registerProvider(this);
    }

    async getPaymentInfo(orderCode: string, amount: number): Promise<IPaymentQrInfo> {
        const dbAcc = await this.databaseService.systemSetting.findUnique({
            where: { key: 'sepay_bank_account' },
        });
        const dbBank = await this.databaseService.systemSetting.findUnique({
            where: { key: 'sepay_bank_brand' },
        });
        const dbName = await this.databaseService.systemSetting.findUnique({
            where: { key: 'sepay_account_name' },
        });

        const accountNumber =
            dbAcc?.value ||
            this.configService.get<string>('sepay.bankAccount') ||
            '';
        const bankBrand =
            dbBank?.value ||
            this.configService.get<string>('sepay.bankBrand') ||
            '';
        const accountName =
            dbName?.value ||
            this.configService.get<string>('sepay.accountName') ||
            '';

        const qrUrl = accountNumber && bankBrand
            ? `https://qr.sepay.vn/img?acc=${encodeURIComponent(
                accountNumber
            )}&bank=${encodeURIComponent(bankBrand)}&amount=${amount}&des=${encodeURIComponent(
                orderCode
            )}&template=compact`
            : '';

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
        const expectedSecret = this.configService.get<string>(
            'sepay.webhookApiKey'
        );
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
        if (!text) {return null;}

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

    /**
     * IPN cổng thanh toán SePay: xác thực header X-Secret-Key, ORDER_PAID -> đánh dấu đơn đã thanh toán.
     * Trả { success: true } + HTTP 200 để SePay xác nhận đã nhận.
     */
    async handlePgIpn(
        payload: SepayPgIpnDto,
        secretKeyHeader?: string
    ): Promise<{ success: boolean }> {
        this.logger.log(`Received SePay PG IPN: ${JSON.stringify(payload)}`);

        const secret = this.configService.get<string>('sepay.pgSecretKey');
        if (secret && secretKeyHeader !== secret) {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Invalid SePay IPN secret key',
            });
        }

        if (payload.notification_type === 'ORDER_PAID') {
            const orderCode = payload.order?.order_invoice_number;
            const amount = Math.round(Number(payload.order?.order_amount ?? 0)) || 0;
            if (orderCode) {
                await this.ordersService.handlePaymentWebhook({
                    orderCode,
                    amount,
                    status: 'SUCCESS',
                    gatewayRef:
                        payload.transaction?.transaction_id ||
                        payload.transaction?.id ||
                        `SEPAY_PG_${Date.now()}`,
                });
            }
        }

        return { success: true };
    }

    /**
     * Xác thực trạng thái với SePay khi khách quay về từ cổng thanh toán: truy vấn SePay,
     * nếu đã thanh toán thì cập nhật đơn -> paid. Trả về trạng thái đơn hiện tại.
     */
    /**
     * Xác thực trạng thái với SePay khi khách quay về từ cổng thanh toán: truy vấn SePay,
     * nếu đã thanh toán thì cập nhật đơn -> paid. Trả về trạng thái đơn hiện tại.
     */
    async verifyOrder(
        orderCode: string
    ): Promise<{
        code: string;
        status: string;
        total: number;
        hasContract?: boolean;
        contractId?: string | null;
        contractCode?: string | null;
        contractStatus?: string | null;
        qrUrl?: string;
        accountNumber?: string;
        bankBrand?: string;
        accountName?: string;
    }> {
        const order = await this.databaseService.order.findFirst({
            where: { OR: [{ code: orderCode }, { id: orderCode }] },
        });
        if (!order) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'order.error.notFound',
            });
        }

        if (order.status === 'pending') {
            const merchantId =
                this.configService.get<string>('sepay.pgMerchantId');
            const secretKey =
                this.configService.get<string>('sepay.pgSecretKey');
            if (merchantId && secretKey) {
                try {
                    const env =
                        this.configService.get<'sandbox' | 'production'>(
                            'sepay.pgEnv'
                        ) ?? 'sandbox';
                    const client = new SePayPgClient({
                        env,
                        merchant_id: merchantId,
                        secret_key: secretKey,
                    });
                    const res = await client.order.retrieve(order.code);
                    const body = (res?.data ?? {}) as Record<string, unknown>;
                    const detail = (body.data ?? body) as Record<string, unknown>;
                    const sepayStatus = String(
                        detail.order_status ?? detail.status ?? ''
                    ).toUpperCase();
                    if (
                        [
                            'CAPTURED',
                            'PAID',
                            'COMPLETED',
                            'SUCCESS',
                            'APPROVED',
                        ].includes(sepayStatus)
                    ) {
                        await this.ordersService.handlePaymentWebhook({
                            orderCode: order.code,
                            amount: order.total,
                            status: 'SUCCESS',
                            gatewayRef: `SEPAY_PG_VERIFY_${order.code}`,
                        });
                    }
                } catch (error) {
                    this.logger.warn(
                        `SePay verify failed for ${order.code}: ${String(error)}`
                    );
                }
            }
        }

        const fresh = await this.databaseService.order.findUnique({
            where: { id: order.id },
            include: {
                contract: {
                    select: { id: true, code: true, status: true },
                },
            },
        });
        const paymentInfo = await this.getPaymentInfo(
            fresh?.code ?? order.code,
            fresh?.total ?? order.total
        );

        return {
            code: fresh?.code ?? order.code,
            status: fresh?.status ?? order.status,
            total: fresh?.total ?? order.total,
            hasContract: Boolean(fresh?.contract),
            contractId: fresh?.contract?.id ?? null,
            contractCode: fresh?.contract?.code ?? null,
            contractStatus: fresh?.contract?.status ?? null,
            accountNumber: paymentInfo.accountNumber,
            bankBrand: paymentInfo.bankBrand,
            accountName: paymentInfo.accountName,
            qrUrl: paymentInfo.qrUrl,
        };
    }

    /**
     * Trang HTML tự submit form checkout sang cổng thanh toán SePay (pay.sepay.vn),
     * chỉ dùng phương thức chuyển khoản QR (BANK_TRANSFER). Mở URL này trong trình duyệt.
     */
    async getCheckoutRedirectHtml(orderCode: string): Promise<string> {
        const order = await this.databaseService.order.findFirst({
            where: { OR: [{ code: orderCode }, { id: orderCode }] },
        });
        if (!order) {
            return this.renderMessage('Không tìm thấy đơn hàng.');
        }
        if (order.status !== 'pending') {
            return this.renderMessage('Đơn hàng không ở trạng thái chờ thanh toán.');
        }

        const merchantId = this.configService.get<string>('sepay.pgMerchantId');
        const secretKey = this.configService.get<string>('sepay.pgSecretKey');
        if (!merchantId || !secretKey) {
            return this.renderMessage(
                'Cổng thanh toán chưa được cấu hình (thiếu SEPAY_PG_MERCHANT_ID / SEPAY_PG_SECRET_KEY).'
            );
        }
        const env =
            this.configService.get<'sandbox' | 'production'>('sepay.pgEnv') ??
            'sandbox';
        const webUrl = this.configService.get<string>('app.webUrl');

        const client = new SePayPgClient({
            env,
            merchant_id: merchantId,
            secret_key: secretKey,
        });
        const fields = client.checkout.initOneTimePaymentFields({
            payment_method: 'BANK_TRANSFER',
            order_invoice_number: order.code,
            order_amount: order.total,
            currency: 'VND',
            order_description: `Thanh toan don hang ${order.code}`,
            customer_id: order.userId,
            success_url: `${webUrl}/thanh-toan/ket-qua?order=${order.code}&status=success`,
            error_url: `${webUrl}/thanh-toan/ket-qua?order=${order.code}&status=error`,
            cancel_url: `${webUrl}/thanh-toan/ket-qua?order=${order.code}&status=cancel`,
        });

        return this.renderAutoSubmitForm(client.checkout.initCheckoutUrl(), fields);
    }

    private escapeHtml(value: string): string {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    private renderAutoSubmitForm(
        action: string,
        fields: Record<string, unknown>
    ): string {
        const inputs = Object.entries(fields)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(
                ([k, v]) =>
                    `<input type="hidden" name="${this.escapeHtml(k)}" value="${this.escapeHtml(String(v))}" />`
            )
            .join('');
        return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Chuyển tới SePay</title></head><body style="font-family:sans-serif;text-align:center;padding:48px 24px;color:#1C3F24"><p>Đang chuyển tới cổng thanh toán SePay...</p><form id="sepay-form" action="${this.escapeHtml(action)}" method="POST">${inputs}</form><script>document.getElementById('sepay-form').submit();</script></body></html>`;
    }

    private renderMessage(message: string): string {
        return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thanh toán</title></head><body style="font-family:sans-serif;text-align:center;padding:48px 24px;color:#1C3F24"><p>${this.escapeHtml(message)}</p></body></html>`;
    }
}
