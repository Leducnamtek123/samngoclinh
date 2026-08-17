import { UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { SepayService } from '@modules/sepay/services/sepay.service';
import { OrdersService } from '@modules/orders/services/orders.service';
import { OrdersExpirationService } from '@modules/orders/services/orders-expiration.service';

describe('Security & Expiration Remediation Verification Tests', () => {
    describe('1. SePay Webhook Fail-Closed Security (BE-SEC-002)', () => {
        let sepayService: SepayService;
        let configServiceMock: any;

        beforeEach(() => {
            configServiceMock = {
                get: jest.fn(),
            };
            sepayService = new SepayService(
                {} as any,
                {} as any,
                {} as any,
                configServiceMock
            );
        });

        it('should return false when webhookApiKey is not configured in env (Fail-Closed)', () => {
            configServiceMock.get.mockReturnValue(undefined);
            const result = sepayService.verifyWebhookAuth('Apikey secret-123');
            expect(result).toBe(false);
        });

        it('should return false when authHeader is missing', () => {
            configServiceMock.get.mockReturnValue('expected-secret-key');
            const result = sepayService.verifyWebhookAuth(undefined);
            expect(result).toBe(false);
        });

        it('should return false when authHeader has wrong token', () => {
            configServiceMock.get.mockReturnValue('expected-secret-key');
            const result = sepayService.verifyWebhookAuth('Apikey wrong-secret');
            expect(result).toBe(false);
        });

        it('should return true when authHeader has matching Apikey token', () => {
            configServiceMock.get.mockReturnValue('expected-secret-key');
            const result = sepayService.verifyWebhookAuth('Apikey expected-secret-key');
            expect(result).toBe(true);
        });

        it('should return true when authHeader has matching Bearer token', () => {
            configServiceMock.get.mockReturnValue('expected-secret-key');
            const result = sepayService.verifyWebhookAuth('Bearer expected-secret-key');
            expect(result).toBe(true);
        });
    });

    describe('2. Payment Webhook Signature Enforcement (BE-SEC-001)', () => {
        let ordersService: OrdersService;
        let configServiceMock: any;
        let databaseServiceMock: any;
        const testSecret = 'super_secret_webhook_key_2026';

        beforeEach(() => {
            configServiceMock = {
                get: jest.fn((key: string) => {
                    if (key === 'payment.webhookSecret') return testSecret;
                    return null;
                }),
            };
            const mockOrder = {
                id: 'ord-1',
                code: 'ORD_TEST_001',
                total: 500000,
                status: 'pending',
                items: [],
                metadata: {},
            };
            databaseServiceMock = {
                order: {
                    findUnique: jest.fn().mockResolvedValue(mockOrder),
                    findFirst: jest.fn().mockResolvedValue(mockOrder),
                    update: jest.fn().mockResolvedValue({ ...mockOrder, status: 'paid' }),
                },
                paymentWebhookLog: {
                    findUnique: jest.fn().mockResolvedValue(null),
                    create: jest.fn().mockResolvedValue({}),
                },
                cultivationTree: {
                    update: jest.fn().mockResolvedValue({}),
                    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
                },
                stockReservation: {
                    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
                    findMany: jest.fn().mockResolvedValue([]),
                },
                catalogPlant: {
                    update: jest.fn().mockResolvedValue({}),
                },
                catalogProduct: {
                    update: jest.fn().mockResolvedValue({}),
                },
                $transaction: jest.fn(async (cb: any) => cb({
                    order: { update: jest.fn().mockResolvedValue({ id: 'ord-1', status: 'paid', code: 'ORD_TEST_001', total: 500000, items: [] }) },
                    stockReservation: {
                        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
                        findMany: jest.fn().mockResolvedValue([]),
                    },
                    stockMovement: { create: jest.fn() },
                    catalogPlant: { update: jest.fn().mockResolvedValue({}) },
                    catalogProduct: { update: jest.fn().mockResolvedValue({}) },
                    cultivationTree: { update: jest.fn().mockResolvedValue({}) },
                    walletAccount: {
                        findUnique: jest.fn().mockResolvedValue(null),
                        create: jest.fn().mockResolvedValue({}),
                        update: jest.fn().mockResolvedValue({}),
                    },
                    walletTransaction: { create: jest.fn().mockResolvedValue({}) },
                })),
            };
            ordersService = new OrdersService(
                {} as any,
                databaseServiceMock,
                {} as any,
                {} as any,
                configServiceMock,
                {} as any,
                {} as any
            );
        });

        it('should reject with 401 Unauthorized when signature is missing from payload', async () => {
            databaseServiceMock.order.findFirst.mockResolvedValue({
                id: 'ord-1',
                code: 'ORD_TEST_001',
                total: 500000,
                status: 'pending',
            });

            const attackPayload = {
                orderCode: 'ORD_TEST_001',
                amount: 500000,
                status: 'SUCCESS',
                gatewayRef: 'ATTACK_REF_001',
            };

            await expect(
                ordersService.handlePaymentWebhook(attackPayload as any)
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should reject with 401 Unauthorized when signature is invalid', async () => {
            databaseServiceMock.order.findFirst.mockResolvedValue({
                id: 'ord-1',
                code: 'ORD_TEST_001',
                total: 500000,
                status: 'pending',
            });

            const fakeSignaturePayload = {
                orderCode: 'ORD_TEST_001',
                amount: 500000,
                status: 'SUCCESS',
                gatewayRef: 'ATTACK_REF_001',
                signature: 'invalid_forged_hmac_hash',
            };

            await expect(
                ordersService.handlePaymentWebhook(fakeSignaturePayload as any)
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should accept and process payment when signature matches HMAC SHA-256', async () => {
            databaseServiceMock.order.findFirst.mockResolvedValue({
                id: 'ord-1',
                code: 'ORD_TEST_001',
                total: 500000,
                status: 'pending',
                items: [],
            });

            const rawData = 'ORD_TEST_001|500000|SUCCESS|SEPAY_GATEWAY_123';
            const validSignature = crypto
                .createHmac('sha256', testSecret)
                .update(rawData)
                .digest('hex');

            const validPayload = {
                orderCode: 'ORD_TEST_001',
                amount: 500000,
                status: 'SUCCESS',
                gatewayRef: 'SEPAY_GATEWAY_123',
                signature: validSignature,
            };

            const result = await ordersService.handlePaymentWebhook(validPayload as any);
            expect(result).toBeDefined();
            expect(result.data?.status).toBe('paid');
        });
    });

    describe('3. Stock Expiration Scheduler (BE-ASYNC-001)', () => {
        let expirationService: OrdersExpirationService;
        let databaseServiceMock: any;

        beforeEach(() => {
            databaseServiceMock = {
                stockReservation: {
                    findMany: jest.fn(),
                },
                $transaction: jest.fn(async (cb: any) => cb({
                    stockReservation: { update: jest.fn() },
                    order: { findUnique: jest.fn(), update: jest.fn() },
                    stockMovement: { create: jest.fn() },
                    walletAccount: { findUnique: jest.fn(), update: jest.fn() },
                    walletTransaction: { create: jest.fn() },
                })),
            };
            expirationService = new OrdersExpirationService(databaseServiceMock);
        });

        it('should return 0 when no expired reservations exist', async () => {
            databaseServiceMock.stockReservation.findMany.mockResolvedValue([]);
            const result = await expirationService.cleanExpiredReservations();
            expect(result).toEqual({ releasedCount: 0, cancelledOrdersCount: 0 });
        });

        it('should release expired reservations and return count', async () => {
            const pastDate = new Date(Date.now() - 30 * 60 * 1000);
            databaseServiceMock.stockReservation.findMany.mockResolvedValue([
                {
                    id: 'res-1',
                    orderId: 'ord-expired-1',
                    productId: 'plant-1',
                    productType: 'plant',
                    quantity: 2,
                    status: 'active',
                    expiresAt: pastDate,
                },
            ]);

            databaseServiceMock.$transaction.mockImplementation(async (cb: any) => {
                const tx = {
                    stockReservation: { update: jest.fn() },
                    order: {
                        findUnique: jest.fn().mockResolvedValue({
                            id: 'ord-expired-1',
                            status: 'pending',
                            metadata: {},
                        }),
                        update: jest.fn(),
                    },
                    stockMovement: { create: jest.fn() },
                };
                return cb(tx);
            });

            const result = await expirationService.cleanExpiredReservations();
            expect(result.releasedCount).toBe(1);
            expect(result.cancelledOrdersCount).toBe(1);
        });
    });
});
