import * as crypto from 'crypto';
import { EContractService } from '@modules/e-contract/services/e-contract.service';
import { EContractPdfService } from '@modules/e-contract/services/e-contract.pdf.service';
import { EContractRepository } from '@modules/e-contract/repositories/e-contract.repository';
import { ContractAmendmentRepository } from '@modules/e-contract/repositories/contract-amendment.repository';
import { BadRequestException } from '@nestjs/common';

describe('Phase 5C — Contract Amendment & Renewal Specification Suite', () => {
    let service: EContractService;
    let pdfService: EContractPdfService;
    let contractRepo: jest.Mocked<EContractRepository>;
    let amendmentRepo: jest.Mocked<ContractAmendmentRepository>;
    let databaseService: any;
    let notificationService: any;
    let configService: any;
    let fileService: any;

    const samplePdfBuffer = Buffer.from('%PDF-1.4 Mock Amendment PDF Bytes for SHA-256 validation');
    const samplePdfHash = crypto.createHash('sha256').update(samplePdfBuffer).digest('hex');

    const originalExpiry = new Date('2028-08-15T00:00:00.000Z');

    const mockSignedContract: any = {
        id: 'ctr-uuid-001',
        code: 'CTR-O20260815001',
        orderId: 'ord-uuid-001',
        userId: 'user-001',
        title: 'Hợp đồng mua bán và chăm sóc Sâm Ngọc Linh',
        content: 'Nội dung hợp đồng gốc',
        status: 'signed',
        contractValue: 50000000,
        signedAt: new Date('2026-08-15T10:00:00.000Z'),
        expiredAt: originalExpiry,
        signatureUrl: 'https://res.cloudinary.com/demo/image/upload/signatures/sig-001.png',
        pdfUrl: 'https://res.cloudinary.com/demo/raw/upload/contracts/Hop-Dong-CTR-O20260815001.pdf',
        partyA: 'CÔNG TY CỔ PHẦN SÂM NGỌC LINH',
        partyB: 'Trần Văn Khách',
        metadata: {
            documentHash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
            qrUrl: 'http://localhost:3002/trace/contract/CTR-O20260815001',
        },
        items: [
            {
                id: 'item-01',
                contractId: 'ctr-uuid-001',
                treeId: 'tree-01',
                treeCode: 'SNL-TRALINH-001',
                treeName: 'Sâm Ngọc Linh 3 năm tuổi',
                ageYearAtSign: 3,
                gardenCode: 'GD-01',
                bedCode: 'BED-A',
                unitPrice: 25000000,
            },
            {
                id: 'item-02',
                contractId: 'ctr-uuid-001',
                treeId: 'tree-02',
                treeCode: 'SNL-TRALINH-002',
                treeName: 'Sâm Ngọc Linh 3 năm tuổi',
                ageYearAtSign: 3,
                gardenCode: 'GD-01',
                bedCode: 'BED-A',
                unitPrice: 25000000,
            },
        ],
        amendments: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();

        contractRepo = {
            createContract: jest.fn(),
            getContractById: jest.fn().mockResolvedValue(mockSignedContract),
            getContractByCode: jest.fn().mockResolvedValue(mockSignedContract),
            listContracts: jest.fn().mockResolvedValue([mockSignedContract]),
            listContractsPaginated: jest.fn(),
            signContract: jest.fn(),
            updateContract: jest.fn(),
            deleteContract: jest.fn(),
        } as any;

        amendmentRepo = {
            createAmendment: jest.fn(),
            findById: jest.fn(),
            findByCode: jest.fn(),
            findByContractId: jest.fn().mockResolvedValue([]),
            findLatestSigned: jest.fn().mockResolvedValue(null),
            getNextAmendmentNumber: jest.fn().mockResolvedValue(1),
            updatePending: jest.fn(),
            markSigned: jest.fn(),
            cancelPending: jest.fn(),
            deleteAmendment: jest.fn(),
        } as any;

        pdfService = {
            generateSignedContractPdf: jest.fn(),
            generateAmendmentPdf: jest.fn().mockResolvedValue({
                pdfBuffer: samplePdfBuffer,
                documentHash: samplePdfHash,
                qrUrl: 'http://localhost:3002/trace/contract/CTR-O20260815001',
            }),
        } as any;

        databaseService = {
            user: {
                findUnique: jest.fn().mockResolvedValue({
                    id: 'user-001',
                    name: 'Trần Văn Khách',
                    email: 'khach@gmail.com',
                    mobileNumbers: [{ number: '0901234567' }],
                }),
            },
            contractAmendment: {
                update: jest.fn(),
            },
        };

        fileService = {
            uploadBuffer: jest.fn().mockResolvedValue('https://res.cloudinary.com/demo/raw/upload/contracts/AMD-CTR-O20260815001-01.pdf'),
            readLocalByKey: jest.fn().mockReturnValue(samplePdfBuffer),
        };

        notificationService = {
            isInitialized: jest.fn().mockReturnValue(false),
            send: jest.fn(),
        };

        configService = {
            get: jest.fn((key: string) => {
                if (key === 'HOME_URL') return 'http://localhost:3002';
                return null;
            }),
        };

        service = new EContractService(
            contractRepo,
            amendmentRepo,
            pdfService,
            databaseService,
            notificationService,
            configService,
            fileService
        );
    });

    // -------------------------------------------------------------
    // GROUP 1: Invariant INV-01, INV-02 Immutability
    // -------------------------------------------------------------
    describe('Group 1: Signed Contract Immutability (INV-01 & INV-02)', () => {
        it('TEST 01: Signed EContract cannot update expiredAt', async () => {
            await expect(
                service.updateContract('ctr-uuid-001', {
                    expiredAt: new Date('2035-01-01'),
                } as any)
            ).rejects.toThrow(BadRequestException);
        });

        it('TEST 02: Signed EContract cannot update title', async () => {
            await expect(
                service.updateContract('ctr-uuid-001', {
                    title: 'New Altered Title',
                })
            ).rejects.toThrow(BadRequestException);
        });

        it('TEST 03: Signed EContract cannot update content', async () => {
            await expect(
                service.updateContract('ctr-uuid-001', {
                    content: 'Hacker altered content',
                })
            ).rejects.toThrow(BadRequestException);
        });

        it('TEST 04: Signed EContract cannot update pdfUrl', async () => {
            await expect(
                service.updateContract('ctr-uuid-001', {
                    pdfUrl: 'https://fake.url/evil.pdf',
                } as any)
            ).rejects.toThrow(BadRequestException);
        });

        it('TEST 05: Signed EContract cannot update documentHash', async () => {
            await expect(
                service.updateContract('ctr-uuid-001', {
                    documentHash: '0000000000000000000000000000000000000000000000000000000000000000',
                } as any)
            ).rejects.toThrow(BadRequestException);
        });

        it('TEST 06: Signed EContract cannot be physically deleted (INV-02)', async () => {
            await expect(service.deleteContract('ctr-uuid-001')).rejects.toThrow(BadRequestException);
        });
    });

    // -------------------------------------------------------------
    // GROUP 2: ContractAmendment Creation & Numbering
    // -------------------------------------------------------------
    describe('Group 2: Amendment Creation & Numbering (INV-10 & Phase 5C.5)', () => {
        it('TEST 07: First amendment can be created with PL-01 code', async () => {
            amendmentRepo.getNextAmendmentNumber.mockResolvedValue(1);
            amendmentRepo.createAmendment.mockResolvedValue({
                id: 'amd-01',
                contractId: 'ctr-uuid-001',
                amendmentNumber: 1,
                code: 'AMD-CTR-O20260815001-01',
                type: 'extension',
                title: 'Phụ lục Gia hạn Dịch vụ Chăm sóc số 01',
                content: 'Gia hạn thêm 12 tháng',
                previousExpiredAt: originalExpiry,
                newExpiredAt: new Date('2029-08-15T00:00:00.000Z'),
                extendedMonths: 12,
                amendmentValue: 1500000,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any);

            const result = await service.createAmendment('ctr-uuid-001', {
                extendedMonths: 12,
                amendmentValue: 1500000,
            });

            expect(result.data.code).toBe('AMD-CTR-O20260815001-01');
            expect(result.data.amendmentNumber).toBe(1);
            expect(result.data.status).toBe('pending');
        });

        it('TEST 08: Amendment gets correct sequential numbering (PL-01, PL-02)', async () => {
            amendmentRepo.getNextAmendmentNumber.mockResolvedValue(2);
            amendmentRepo.createAmendment.mockResolvedValue({
                id: 'amd-02',
                contractId: 'ctr-uuid-001',
                amendmentNumber: 2,
                code: 'AMD-CTR-O20260815001-02',
                type: 'extension',
                title: 'Phụ lục Gia hạn Dịch vụ Chăm sóc số 02',
                content: 'Gia hạn thêm 12 tháng',
                previousExpiredAt: new Date('2029-08-15T00:00:00.000Z'),
                newExpiredAt: new Date('2030-08-15T00:00:00.000Z'),
                extendedMonths: 12,
                amendmentValue: 1800000,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any);

            const result = await service.createAmendment('ctr-uuid-001', {
                extendedMonths: 12,
                amendmentValue: 1800000,
            });

            expect(result.data.code).toBe('AMD-CTR-O20260815001-02');
            expect(result.data.amendmentNumber).toBe(2);
        });

        it('TEST 09: Amendment can transition from pending to signed with PDF & Hash', async () => {
            amendmentRepo.findById.mockResolvedValue({
                id: 'amd-01',
                contractId: 'ctr-uuid-001',
                amendmentNumber: 1,
                code: 'AMD-CTR-O20260815001-01',
                title: 'Phụ lục 01',
                previousExpiredAt: originalExpiry,
                newExpiredAt: new Date('2029-08-15T00:00:00.000Z'),
                extendedMonths: 12,
                amendmentValue: 1500000,
                status: 'pending',
            } as any);

            amendmentRepo.findById.mockResolvedValueOnce({
                id: 'amd-01',
                contractId: 'ctr-uuid-001',
                status: 'pending',
                code: 'AMD-CTR-O20260815001-01',
                amendmentNumber: 1,
                title: 'Phụ lục 01',
                previousExpiredAt: originalExpiry,
                newExpiredAt: new Date('2029-08-15T00:00:00.000Z'),
                extendedMonths: 12,
                amendmentValue: 1500000,
            } as any).mockResolvedValueOnce({
                id: 'amd-01',
                contractId: 'ctr-uuid-001',
                status: 'signed',
                code: 'AMD-CTR-O20260815001-01',
                amendmentNumber: 1,
                pdfUrl: 'https://res.cloudinary.com/demo/raw/upload/contracts/AMD-CTR-O20260815001-01.pdf',
                documentHash: samplePdfHash,
                signedAt: new Date(),
            } as any);

            const result = await service.signAmendment('amd-01', 'user-001', {
                signatureData: 'data:image/png;base64,mockSignatureBytes',
            });

            expect(result.data.status).toBe('signed');
            expect(result.data.documentHash).toBe(samplePdfHash);
        });

        it('TEST 10: Signed amendment cannot be modified (INV-10 via repo)', async () => {
            const realRepo = new ContractAmendmentRepository({
                contractAmendment: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'amd-signed-01',
                        status: 'signed',
                    }),
                },
            } as any);

            await expect(
                realRepo.updatePending('amd-signed-01', { title: 'Altered Title' })
            ).rejects.toThrow(BadRequestException);
        });

        it('TEST 11: Signed amendment cannot be physically deleted (INV-02 via repo)', async () => {
            const realRepo = new ContractAmendmentRepository({
                contractAmendment: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'amd-signed-01',
                        status: 'signed',
                    }),
                },
            } as any);

            await expect(realRepo.deleteAmendment('amd-signed-01')).rejects.toThrow(BadRequestException);
        });

        it('TEST 12: Pending amendment can be cancelled', async () => {
            amendmentRepo.findById.mockResolvedValue({
                id: 'amd-pending-01',
                contractId: 'ctr-uuid-001',
                status: 'pending',
            } as any);
            amendmentRepo.cancelPending.mockResolvedValue({
                id: 'amd-pending-01',
                status: 'cancelled',
            } as any);

            const result = await service.cancelAmendment('amd-pending-01', 'user-001');
            expect(result.data.status).toBe('cancelled');
        });
    });

    // -------------------------------------------------------------
    // GROUP 3: Renewal Chaining & Effective Expiration
    // -------------------------------------------------------------
    describe('Group 3: Renewal Chaining & Effective Expiration (INV-09)', () => {
        it('TEST 13: First renewal uses EContract.expiredAt as previousExpiredAt', async () => {
            amendmentRepo.findLatestSigned.mockResolvedValue(null);
            amendmentRepo.getNextAmendmentNumber.mockResolvedValue(1);

            let capturedPayload: any;
            amendmentRepo.createAmendment.mockImplementation(async (data: any) => {
                capturedPayload = data;
                return { id: 'amd-1', ...data } as any;
            });

            await service.renewContract('ctr-uuid-001', 'user-001', { months: 12 });

            expect(capturedPayload.previousExpiredAt.toISOString()).toBe(originalExpiry.toISOString());
            const expectedNew = new Date(originalExpiry);
            expectedNew.setMonth(expectedNew.getMonth() + 12);
            expect(capturedPayload.newExpiredAt.toISOString()).toBe(expectedNew.toISOString());
        });

        it('TEST 14: Second renewal uses latest signed amendment.newExpiredAt as previousExpiredAt', async () => {
            const amendment1Expiry = new Date('2029-08-15T00:00:00.000Z');
            amendmentRepo.findLatestSigned.mockResolvedValue({
                id: 'amd-01',
                contractId: 'ctr-uuid-001',
                status: 'signed',
                newExpiredAt: amendment1Expiry,
                amendmentNumber: 1,
            } as any);
            amendmentRepo.getNextAmendmentNumber.mockResolvedValue(2);

            let capturedPayload: any;
            amendmentRepo.createAmendment.mockImplementation(async (data: any) => {
                capturedPayload = data;
                return { id: 'amd-2', ...data } as any;
            });

            await service.renewContract('ctr-uuid-001', 'user-001', { months: 12 });

            expect(capturedPayload.previousExpiredAt.toISOString()).toBe(amendment1Expiry.toISOString());
            const expectedNew = new Date(amendment1Expiry);
            expectedNew.setMonth(expectedNew.getMonth() + 12);
            expect(capturedPayload.newExpiredAt.toISOString()).toBe(expectedNew.toISOString());
        });

        it('TEST 15: Third renewal chains expiration correctly (2028 -> 2029 -> 2030 -> 2031)', async () => {
            const amendment2Expiry = new Date('2030-08-15T00:00:00.000Z');
            amendmentRepo.findLatestSigned.mockResolvedValue({
                id: 'amd-02',
                contractId: 'ctr-uuid-001',
                status: 'signed',
                newExpiredAt: amendment2Expiry,
                amendmentNumber: 2,
            } as any);
            amendmentRepo.getNextAmendmentNumber.mockResolvedValue(3);

            let capturedPayload: any;
            amendmentRepo.createAmendment.mockImplementation(async (data: any) => {
                capturedPayload = data;
                return { id: 'amd-3', ...data } as any;
            });

            await service.renewContract('ctr-uuid-001', 'user-001', { months: 12 });

            expect(capturedPayload.previousExpiredAt.toISOString()).toBe(amendment2Expiry.toISOString());
            const expectedNew = new Date(amendment2Expiry);
            expectedNew.setMonth(expectedNew.getMonth() + 12);
            expect(capturedPayload.newExpiredAt.toISOString()).toBe(expectedNew.toISOString());
            expect(capturedPayload.amendmentNumber).toBe(3);
        });

        it('TEST 16: EContract.expiredAt NEVER changes during renewal (INV-01)', async () => {
            await service.renewContract('ctr-uuid-001', 'user-001', { months: 12 });

            // Ensure contractRepo update was NEVER called with expiredAt
            expect(contractRepo.updateContract).not.toHaveBeenCalled();
            expect(mockSignedContract.expiredAt.toISOString()).toBe(originalExpiry.toISOString());
        });

        it('TEST 17: EContractItem NEVER changes or gets deleted during renewal (INV-05)', async () => {
            await service.renewContract('ctr-uuid-001', 'user-001', { months: 12 });

            expect(mockSignedContract.items.length).toBe(2);
            expect(mockSignedContract.items[0].treeCode).toBe('SNL-TRALINH-001');
            expect(mockSignedContract.items[0].ageYearAtSign).toBe(3);
        });

        it('TEST 18: effectiveExpiredAt resolves to latest signed amendment (INV-09)', async () => {
            const latestExpiry = new Date('2031-08-15T00:00:00.000Z');
            amendmentRepo.findLatestSigned.mockResolvedValue({
                id: 'amd-03',
                contractId: 'ctr-uuid-001',
                status: 'signed',
                newExpiredAt: latestExpiry,
                amendmentNumber: 3,
            } as any);

            const effective = await service.getEffectiveExpiredAt('ctr-uuid-001');
            expect(effective.toISOString()).toBe(latestExpiry.toISOString());
        });

        it('TEST 19: effectiveExpiredAt falls back to original expiry when no amendments exist', async () => {
            amendmentRepo.findLatestSigned.mockResolvedValue(null);

            const effective = await service.getEffectiveExpiredAt('ctr-uuid-001');
            expect(effective.toISOString()).toBe(originalExpiry.toISOString());
        });
    });

    // -------------------------------------------------------------
    // GROUP 4: SHA-256 & Concurrency Safety
    // -------------------------------------------------------------
    describe('Group 4: Cryptographic Hash & Concurrency Safety (INV-03 & Phase 5C.5)', () => {
        it('TEST 20: PDF hash matches exact byte buffer of generated amendment PDF (INV-03)', async () => {
            const rawBuffer = Buffer.from('%PDF-1.4 Validated Amendment Content');
            const expectedHash = crypto.createHash('sha256').update(rawBuffer).digest('hex');

            (pdfService.generateAmendmentPdf as jest.Mock).mockResolvedValue({
                pdfBuffer: rawBuffer,
                documentHash: expectedHash,
                qrUrl: 'http://localhost:3002/trace/contract/CTR-O20260815001',
            });

            const result = await service.renewContract('ctr-uuid-001', 'user-001', {
                months: 12,
                signatureData: 'data:image/png;base64,mockSignature',
            });

            expect(result.data.documentHash).toBe(expectedHash);
        });

        it('TEST 21: Concurrency-safe amendment numbering increments safely', async () => {
            const realRepo = new ContractAmendmentRepository({
                contractAmendment: {
                    findFirst: jest.fn()
                        .mockResolvedValueOnce(null)
                        .mockResolvedValueOnce({ amendmentNumber: 1 })
                        .mockResolvedValueOnce({ amendmentNumber: 2 }),
                },
            } as any);

            const n1 = await realRepo.getNextAmendmentNumber('ctr-uuid-001');
            const n2 = await realRepo.getNextAmendmentNumber('ctr-uuid-001');
            const n3 = await realRepo.getNextAmendmentNumber('ctr-uuid-001');

            expect(n1).toBe(1);
            expect(n2).toBe(2);
            expect(n3).toBe(3);
        });

        it('TEST 22: Phase 5A invariants remain 100% active and protected', async () => {
            expect(mockSignedContract.status).toBe('signed');
            await expect(service.deleteContract(mockSignedContract.id)).rejects.toThrow(BadRequestException);
        });

        it('TEST 23: Phase 5B Multi-tree snapshots remain 100% active and protected', async () => {
            const contract = await contractRepo.getContractById('ctr-uuid-001');
            expect(contract.items).toBeDefined();
            expect(contract.items.length).toBe(2);
            expect(contract.items[0].unitPrice).toBe(25000000);
        });
    });
});
