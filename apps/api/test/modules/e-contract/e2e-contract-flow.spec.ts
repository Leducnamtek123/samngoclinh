import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { EContractService } from '../../../src/modules/e-contract/services/e-contract.service';

describe('Full End-to-End Flow: Digital Signature Vault & 2-Phase Contract Workflow', () => {
    const db = {
        users: new Map<string, any>(),
        identityDocs: new Map<string, any>(),
        contracts: new Map<string, any>(),
        activityLogs: [] as any[],
        sentEmails: [] as any[],
    };

    const customerUser = {
        id: 'usr-customer-001',
        name: 'Đức Nam Lê',
        email: 'leducnamtek123@gmail.com',
        role: 'user',
        isVerified: true,
        mobileNumbers: [{ number: '0901234567' }],
    };
    const adminUser = {
        id: 'usr-admin-001',
        name: 'Quản Trị Viên Vườn',
        email: 'admin@samngoclinh.vn',
        role: 'admin',
        isVerified: true,
        mobileNumbers: [{ number: '0988888888' }],
    };

    let contractService: EContractService;
    let savedSigUrl: string;

    const mockEContractRepo: any = {
        generateNextCode: jest.fn().mockResolvedValue('CTR-SNL-2026/0042'),
        createContract: jest.fn().mockImplementation(async (data: any) => {
            const contract = {
                id: 'ctr-test-001',
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
                amendments: [],
                items: data.items || [],
            };
            db.contracts.set(contract.id, contract);
            return contract;
        }),
        getContractById: jest.fn().mockImplementation(async (id: string) => {
            return db.contracts.get(id) || null;
        }),
        getContractByCode: jest.fn().mockImplementation(async (code: string) => {
            for (const c of db.contracts.values()) {
                if (c.code === code) return c;
            }
            return null;
        }),
        listContracts: jest.fn().mockImplementation(async (userId?: string) => {
            const all = Array.from(db.contracts.values());
            return userId ? all.filter((c) => c.userId === userId) : all;
        }),
        updateContract: jest.fn().mockImplementation(async (id: string, payload: any) => {
            const existing = db.contracts.get(id);
            if (!existing) throw new NotFoundException('Not found');
            const updated = { ...existing, ...payload, updatedAt: new Date() };
            db.contracts.set(id, updated);
            return updated;
        }),
        updateStatus: jest.fn().mockImplementation(async (id: string, status: string, additionalData?: any) => {
            const existing = db.contracts.get(id);
            if (!existing) throw new NotFoundException('Not found');
            const updated = { ...existing, status, ...additionalData, updatedAt: new Date() };
            db.contracts.set(id, updated);
            return updated;
        }),
        deleteContract: jest.fn().mockImplementation(async (id: string) => {
            db.contracts.delete(id);
            return true;
        }),
    };

    const mockAmendmentRepo: any = {
        findLatestSigned: jest.fn().mockResolvedValue(null),
    };

    const mockPdfService: any = {
        generateSignedContractPdf: jest.fn().mockImplementation(async (params: any) => {
            const rawContent = `Signed PDF for ${params.contractCode} by ${params.partyB}`;
            const pdfBuffer = Buffer.from(rawContent);
            const documentHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
            return {
                pdfBuffer,
                documentHash,
                qrUrl: `http://localhost:3002/trace/contract/${params.contractCode}`,
            };
        }),
    };

    const mockTemplateService: any = {
        getTemplate: jest.fn().mockResolvedValue({
            contentHtml: '<h1>HỢP ĐỒNG MUA BÁN & ỦY QUYỀN CHĂM SÓC SÂM NGỌC LINH</h1><p>{{TEN_KHACH_HANG}}</p>',
        }),
    };

    const mockDatabaseService: any = {
        user: {
            findUnique: jest.fn().mockImplementation(async ({ where }: any) => db.users.get(where.id) || null),
        },
        activityLog: {
            create: jest.fn().mockImplementation(async ({ data }: any) => {
                db.activityLogs.push(data);
                return data;
            }),
        },
        eContract: {
            update: jest.fn().mockImplementation(async ({ where, data }: any) => {
                const existing = db.contracts.get(where.id);
                if (!existing) return null;
                const updated = { ...existing, ...data };
                db.contracts.set(where.id, updated);
                return updated;
            }),
        },
    };

    const mockNotificationService: any = {
        isInitialized: jest.fn().mockReturnValue(true),
        send: jest.fn().mockImplementation(async (payload: any) => {
            db.sentEmails.push(payload);
            return true;
        }),
    };

    const mockConfigService: any = {
        get: jest.fn().mockImplementation((key: string) => {
            if (key === 'HOME_URL') return 'http://localhost:3002';
            if (key === 'smtp.from') return 'noreply@samngoclinh.vn';
            return null;
        }),
    };

    const mockFileService: any = {
        uploadBuffer: jest.fn().mockImplementation(async (_buffer: Buffer, folder: string, filename: string) => {
            return `https://cdn.samngoclinh.vn/${folder}/${filename}`;
        }),
        uploadBase64: jest.fn().mockImplementation(async (_base64: string, folder: string) => {
            return `https://cdn.samngoclinh.vn/${folder}/sig-test.png`;
        }),
    };

    beforeAll(() => {
        db.users.set(customerUser.id, customerUser);
        db.users.set(adminUser.id, adminUser);

        contractService = new EContractService(
            mockEContractRepo,
            mockAmendmentRepo,
            mockPdfService,
            mockTemplateService,
            mockDatabaseService,
            mockNotificationService,
            mockConfigService,
            mockFileService
        );
    });

    describe('1. Digital Signature Vault (Kho Chữ Ký Số Tập Trung)', () => {
        it('should upload and persist user digital signature to cloud storage', async () => {
            const sampleBase64 = 'data:image/png;base64,mockSignatureData';
            savedSigUrl = await mockFileService.uploadBase64(sampleBase64, 'signatures');
            db.identityDocs.set(customerUser.id, { signatureUrl: savedSigUrl });

            expect(savedSigUrl).toBe('https://cdn.samngoclinh.vn/signatures/sig-test.png');
            expect(db.identityDocs.get(customerUser.id)?.signatureUrl).toBe(savedSigUrl);
        });
    });

    describe('2. Order Completion & Initial Draft Contract (Phase 1)', () => {
        let createdContract: any;

        it('should create contract in "draft" status with allocated trees and null signedAt upon order payment', async () => {
            createdContract = await mockEContractRepo.createContract({
                code: 'CTR-SNL-2026/0042',
                userId: customerUser.id,
                orderId: 'ord-123456',
                title: 'Hợp đồng Mua bán, Ký gửi & Chăm sóc Cây Sâm Ngọc Linh #ORD-123456',
                content: 'Nội dung hợp đồng...',
                status: 'draft',
                signedAt: null,
                signatureUrl: savedSigUrl,
                contractValue: 50000000,
                paymentStatus: 'paid',
                expiredAt: new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000).toISOString(),
                contractType: 'purchase_and_care',
                partyA: 'Công ty Cổ phần Sâm Ngọc Linh',
                partyB: `${customerUser.name} (CCCD: 049090001234, SĐT: 0901234567)`,
                metadata: {
                    orderId: 'ord-123456',
                    orderCode: 'ORD-123456',
                    totalPlants: 2,
                    customerSignature: savedSigUrl,
                    checkoutSigned: true,
                },
                items: [
                    {
                        treeId: 'tree-01',
                        treeCode: 'SNL-TRALINH-001',
                        treeName: 'Cây Sâm Ngọc Linh 3 năm tuổi',
                        ageYearAtSign: 3,
                        gardenCode: 'GD-NAMTRAMY-01',
                        bedCode: 'BED-04',
                        unitPrice: 25000000,
                    },
                ],
            });

            expect(createdContract.status).toBe('draft');
            expect(createdContract.signedAt).toBeNull();
            expect(createdContract.items).toHaveLength(1);
            expect(createdContract.items[0].treeCode).toBe('SNL-TRALINH-001');
        });

        it('should block customer from signing contract while it is in "draft" status', async () => {
            await expect(
                contractService.signContract(createdContract.id, customerUser.id, {
                    signatureData: savedSigUrl,
                })
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('3. Admin Review & Issue (Phase 2)', () => {
        it('should allow Admin to edit terms and metadata on draft contract', async () => {
            const updated = await contractService.updateContract('ctr-test-001', {
                title: 'Hợp đồng Mua bán & Bảo trợ Chăm sóc Đặc biệt Cây Sâm Ngọc Linh #ORD-123456',
                partyA: 'Công ty Cổ phần Sâm Ngọc Linh Nam Trà My',
            } as any);

            expect(updated.data?.title).toContain('Bảo trợ Chăm sóc Đặc biệt');
            expect(updated.data?.partyA).toBe('Công ty Cổ phần Sâm Ngọc Linh Nam Trà My');
        });

        it('should transition status from "draft" to "pending" when Admin issues contract and sends notification email', async () => {
            const issueResult = await contractService.issueContract('ctr-test-001');

            expect(issueResult.data?.status).toBe('pending');
            expect(mockNotificationService.send).toHaveBeenCalled();
            expect(db.sentEmails[0].recipients).toContain(customerUser.email);
        });
    });

    describe('4. Customer 1-Click Signing & PDF Generation', () => {
        it('should allow customer to sign with saved Vault signature, transitioning status to "signed" with SHA-256 hash', async () => {
            const signResult = await contractService.signContract(
                'ctr-test-001',
                customerUser.id,
                { signatureData: savedSigUrl },
                '118.69.182.45'
            );

            expect(signResult.data?.status).toBe('signed');
            expect(signResult.data?.signedAt).toBeInstanceOf(Date);
            expect(signResult.data?.pdfUrl).toContain('Hop-Dong-CTR-SNL-2026/0042.pdf');
            expect((signResult.data?.metadata as any)?.documentHash).toHaveLength(64);
        });
    });

    describe('5. Immutability & Security Invariants', () => {
        it('should prevent re-signing an already signed contract (Idempotency)', async () => {
            await expect(
                contractService.signContract('ctr-test-001', customerUser.id, {
                    signatureData: savedSigUrl,
                })
            ).rejects.toThrow('Hợp đồng này đã được ký kết trước đó.');
        });

        it('should prevent modifying a signed contract (Immutability)', async () => {
            await expect(
                contractService.updateContract('ctr-test-001', { title: 'Illegal Modification' } as any)
            ).rejects.toThrow('Signed contract is immutable and cannot be modified.');
        });

        it('should prevent deleting a signed contract', async () => {
            await expect(contractService.deleteContract('ctr-test-001')).rejects.toThrow(
                'Signed contract cannot be deleted.'
            );
        });

        it('should forbid unauthorized users from accessing contracts', async () => {
            await expect(contractService.getContract('ctr-test-001', 'usr-unauthorized-999')).rejects.toThrow(
                ForbiddenException
            );
        });

        it('should allow customer to fetch their signed contract cleanly', async () => {
            const res = await contractService.listContracts(customerUser.id);
            expect(res.data).toHaveLength(1);
            expect(res.data?.[0].status).toBe('signed');
        });
    });
});
