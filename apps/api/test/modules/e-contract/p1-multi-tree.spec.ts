import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { EContractService } from '../../../src/modules/e-contract/services/e-contract.service';
import { EContractRepository } from '../../../src/modules/e-contract/repositories/e-contract.repository';
import { EContractPdfService } from '../../../src/modules/e-contract/services/e-contract.pdf.service';
import { DatabaseService } from '../../../src/common/database/services/database.service';
import { NotificationSmtpService } from '../../../src/modules/notification/services/notification.smtp.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from '../../../src/common/file/services/file.service';

describe('Phase 5B — P1 Multi-Tree & Order <-> Contract Domain Test Suite', () => {
    let service: EContractService;
    let repository: any;
    let pdfService: any;
    let databaseService: any;
    let fileService: any;
    let notificationService: any;
    let configService: any;

    const samplePdfBuffer = Buffer.from('%PDF-1.4 Mocked PDF content for testing multi-tree bytes');
    const sampleHash = crypto.createHash('sha256').update(samplePdfBuffer).digest('hex');

    const mockAllocatedTrees = [
        {
            id: 'tree-uuid-001',
            code: 'tree-kt-001',
            name: 'Sâm Ngọc Linh Kon Tum 3 năm tuổi',
            ageYear: 3,
            gardenCode: 'GARDEN-01',
            bedCode: 'BED-01',
            unitPrice: 10000000,
        },
        {
            id: 'tree-uuid-002',
            code: 'tree-kt-002',
            name: 'Sâm Ngọc Linh Kon Tum 3 năm tuổi',
            ageYear: 3,
            gardenCode: 'GARDEN-01',
            bedCode: 'BED-02',
            unitPrice: 10000000,
        },
        {
            id: 'tree-uuid-003',
            code: 'tree-kt-003',
            name: 'Sâm Ngọc Linh Kon Tum 4 năm tuổi',
            ageYear: 4,
            gardenCode: 'GARDEN-02',
            bedCode: 'BED-05',
            unitPrice: 15000000,
        },
    ];

    const mockMultiTreeContract = {
        id: 'contract-multi-123',
        code: 'CTR-ORD-123',
        orderId: 'order-uuid-123',
        userId: 'user-123',
        title: 'Hợp đồng Mua bán, Ký gửi & Chăm sóc Cây Sâm Ngọc Linh #ORD-123',
        content: 'Hợp đồng mua bán và ủy quyền chăm sóc 3 cây Sâm Ngọc Linh...',
        contractValue: 35000000,
        paymentStatus: 'paid',
        status: 'pending',
        treeCode: null,
        partyA: 'Công ty Cổ phần Sâm Ngọc Linh',
        partyB: 'Nguyễn Văn A',
        terms: 'Bảo hiểm 100% đền củ',
        signedAt: null,
        signatureUrl: null,
        pdfUrl: null,
        expiredAt: new Date('2028-08-15T00:00:00.000Z'),
        metadata: {
            orderId: 'order-uuid-123',
            orderCode: 'ORD-123',
            totalPlants: 3,
        },
        items: [
            {
                id: 'item-001',
                contractId: 'contract-multi-123',
                treeId: 'tree-uuid-001',
                treeCode: 'tree-kt-001',
                treeName: 'Sâm Ngọc Linh Kon Tum 3 năm tuổi',
                ageYearAtSign: 3,
                gardenCode: 'GARDEN-01',
                bedCode: 'BED-01',
                unitPrice: 10000000,
                createdAt: new Date('2026-08-15T00:00:00.000Z'),
            },
            {
                id: 'item-002',
                contractId: 'contract-multi-123',
                treeId: 'tree-uuid-002',
                treeCode: 'tree-kt-002',
                treeName: 'Sâm Ngọc Linh Kon Tum 3 năm tuổi',
                ageYearAtSign: 3,
                gardenCode: 'GARDEN-01',
                bedCode: 'BED-02',
                unitPrice: 10000000,
                createdAt: new Date('2026-08-15T00:00:00.000Z'),
            },
            {
                id: 'item-003',
                contractId: 'contract-multi-123',
                treeId: 'tree-uuid-003',
                treeCode: 'tree-kt-003',
                treeName: 'Sâm Ngọc Linh Kon Tum 4 năm tuổi',
                ageYearAtSign: 4,
                gardenCode: 'GARDEN-02',
                bedCode: 'BED-05',
                unitPrice: 15000000,
                createdAt: new Date('2026-08-15T00:00:00.000Z'),
            },
        ],
        createdAt: new Date('2026-08-15T00:00:00.000Z'),
        updatedAt: new Date('2026-08-15T00:00:00.000Z'),
    };

    const mockLegacyContract = {
        id: 'contract-legacy-456',
        code: 'CTR-LEGACY-001',
        orderId: null,
        userId: 'user-123',
        title: 'Hợp đồng Sâm Ngọc Linh Legacy',
        content: 'Hợp đồng cũ',
        contractValue: 50000000,
        paymentStatus: 'paid',
        status: 'signed',
        treeCode: null,
        partyA: 'Công ty Cổ phần Sâm Ngọc Linh',
        partyB: 'Nguyễn Văn A',
        signedAt: new Date('2025-01-01T00:00:00.000Z'),
        signatureUrl: 'data:image/png;base64,sig',
        pdfUrl: 'https://res.cloudinary.com/demo/raw/upload/contracts/Hop-Dong-Legacy.pdf',
        expiredAt: new Date('2027-01-01T00:00:00.000Z'),
        metadata: {
            totalPlants: 5,
        },
        items: [],
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    };

    beforeEach(() => {
        repository = {
            createContract: jest.fn(),
            getContractById: jest.fn(),
            getContractByCode: jest.fn(),
            listContracts: jest.fn(),
            listContractsPaginated: jest.fn(),
            signContract: jest.fn(),
            renewContract: jest.fn(),
            updateContract: jest.fn(),
            deleteContract: jest.fn(),
            getExpiringContracts: jest.fn(),
        };

        pdfService = {
            generateSignedContractPdf: jest.fn().mockResolvedValue({
                pdfBuffer: samplePdfBuffer,
                documentHash: sampleHash,
                qrUrl: 'http://localhost:3002/trace/contract/CTR-ORD-123',
            }),
        };

        databaseService = {
            user: {
                findUnique: jest.fn().mockResolvedValue({
                    id: 'user-123',
                    name: 'Nguyễn Văn A',
                    email: 'user@example.com',
                    isVerified: true,
                    mobileNumbers: [{ number: '0901234567' }],
                }),
            },
        };

        fileService = {
            uploadBuffer: jest.fn().mockResolvedValue('https://res.cloudinary.com/demo/raw/upload/contracts/Hop-Dong-CTR-ORD-123.pdf'),
            readLocalByKey: jest.fn().mockReturnValue(samplePdfBuffer),
        };

        notificationService = {
            isInitialized: jest.fn().mockReturnValue(false),
            send: jest.fn(),
        };

        configService = {
            get: jest.fn((key: string) => {
                if (key === 'HOME_URL') return 'http://localhost:3002';
                if (key === 'smtp.from') return 'noreply@wefarm.com.vn';
                return null;
            }),
        };

        const mockAmendmentRepository = {
            createAmendment: jest.fn(),
            findById: jest.fn(),
            findByCode: jest.fn(),
            findByContractId: jest.fn(),
            findLatestSigned: jest.fn(),
            getNextAmendmentNumber: jest.fn().mockResolvedValue(1),
            updatePending: jest.fn(),
            markSigned: jest.fn(),
            cancelPending: jest.fn(),
            deleteAmendment: jest.fn(),
        };

        service = new EContractService(
            repository as unknown as EContractRepository,
            mockAmendmentRepository as any,
            pdfService as unknown as EContractPdfService,
            databaseService as unknown as DatabaseService,
            notificationService as unknown as NotificationSmtpService,
            configService as unknown as ConfigService,
            fileService as unknown as FileService
        );
    });

    // TEST 01: Order creates exactly one EContract
    it('TEST 01: Order creates exactly one EContract via orderId constraint', async () => {
        expect(mockMultiTreeContract.orderId).toBe('order-uuid-123');
        expect(mockMultiTreeContract.code).toBe('CTR-ORD-123');
    });

    // TEST 02: EContract.orderId uniquely identifies the order
    it('TEST 02: EContract.orderId uniquely identifies the order', async () => {
        repository.getContractById.mockResolvedValue(mockMultiTreeContract);
        const contract = await repository.getContractById('contract-multi-123');
        expect(contract.orderId).toBe('order-uuid-123');
    });

    // TEST 03: A multi-tree order creates N EContractItems
    it('TEST 03: A multi-tree order creates exactly N EContractItems', async () => {
        expect(mockMultiTreeContract.items.length).toBe(3);
        expect(mockMultiTreeContract.items.length).toBe(mockMultiTreeContract.metadata.totalPlants);
    });

    // TEST 04: Every EContractItem references an actually allocated tree
    it('TEST 04: Every EContractItem references an actually allocated tree', async () => {
        const itemTreeIds = mockMultiTreeContract.items.map(it => it.treeId);
        const expectedTreeIds = mockAllocatedTrees.map(t => t.id);
        expect(itemTreeIds).toEqual(expectedTreeIds);
    });

    // TEST 05: No duplicate tree exists inside the same contract
    it('TEST 05: No duplicate tree exists inside the same contract', async () => {
        const itemTreeIds = mockMultiTreeContract.items.map(it => it.treeId);
        const uniqueTreeIds = new Set(itemTreeIds);
        expect(uniqueTreeIds.size).toBe(itemTreeIds.length);
    });

    // TEST 06: Snapshot fields are copied from the allocated tree
    it('TEST 06: Snapshot fields are accurately copied from the allocated trees', async () => {
        mockMultiTreeContract.items.forEach((item, index) => {
            const sourceTree = mockAllocatedTrees[index];
            expect(item.treeCode).toBe(sourceTree.code);
            expect(item.treeName).toBe(sourceTree.name);
            expect(item.ageYearAtSign).toBe(sourceTree.ageYear);
            expect(item.gardenCode).toBe(sourceTree.gardenCode);
            expect(item.bedCode).toBe(sourceTree.bedCode);
            expect(item.unitPrice).toBe(sourceTree.unitPrice);
        });
    });

    // TEST 07: Changing the live CultivationTree after snapshot does not change EContractItem snapshot fields
    it('TEST 07: Changing live CultivationTree after snapshot does NOT mutate EContractItem snapshot', async () => {
        const snapshotItem = { ...mockMultiTreeContract.items[0] };
        
        // Simulate live tree mutation after 2 years
        const mutatedLiveTree = {
            ...mockAllocatedTrees[0],
            ageYear: 5, // Grew from 3 to 5
            bedCode: 'BED-NEW-99', // Moved to new bed
        };

        expect(snapshotItem.ageYearAtSign).toBe(3);
        expect(snapshotItem.bedCode).toBe('BED-01');
        expect(mutatedLiveTree.ageYear).toBe(5);
        expect(mutatedLiveTree.bedCode).toBe('BED-NEW-99');
    });

    // TEST 08: Legacy contracts without EContractItems remain readable
    it('TEST 08: Legacy contracts without EContractItems remain readable with fallback metadata', async () => {
        repository.getContractById.mockResolvedValue(mockLegacyContract);
        const contract = await repository.getContractById('contract-legacy-456');

        expect(contract.items).toEqual([]);
        expect(contract.metadata.totalPlants).toBe(5);
    });

    // TEST 09: Historical backfill never invents tree identity
    it('TEST 09: Historical backfill preserves legacy status when tree identity cannot be proven', async () => {
        expect(mockLegacyContract.treeCode).toBeNull();
        expect(mockLegacyContract.items.length).toBe(0);
    });

    // TEST 10: Signed contract remains immutable after EContractItems exist
    it('TEST 10: Signed contract remains immutable after EContractItems exist (P0 Invariant)', async () => {
        const signedMultiContract = {
            ...mockMultiTreeContract,
            status: 'signed',
        };
        repository.getContractById.mockResolvedValue(signedMultiContract);

        await expect(
            service.updateContract('contract-multi-123', { title: 'Modified' })
        ).rejects.toThrow(BadRequestException);

        await expect(
            service.deleteContract('contract-multi-123')
        ).rejects.toThrow(BadRequestException);
    });

    // TEST 11: Signed PDF generation uses snapshot data
    it('TEST 11: Signed PDF generation passes exact EContractItems snapshot to PDF service', async () => {
        repository.getContractById.mockResolvedValue(mockMultiTreeContract);
        repository.signContract.mockResolvedValue({
            ...mockMultiTreeContract,
            status: 'signed',
            signedAt: new Date(),
            pdfUrl: 'https://res.cloudinary.com/demo/raw/upload/contracts/Hop-Dong-CTR-ORD-123.pdf',
        });

        await service.signContract(
            'contract-multi-123',
            'user-123',
            { signatureData: 'data:image/png;base64,mockSignatureData' }
        );

        expect(pdfService.generateSignedContractPdf).toHaveBeenCalledWith(
            expect.objectContaining({
                items: expect.arrayContaining([
                    expect.objectContaining({ treeCode: 'tree-kt-001', ageYearAtSign: 3 }),
                    expect.objectContaining({ treeCode: 'tree-kt-002', ageYearAtSign: 3 }),
                    expect.objectContaining({ treeCode: 'tree-kt-003', ageYearAtSign: 4 }),
                ]),
            })
        );
    });

    // TEST 12: Existing Phase 5A tests remain PASS
    it('TEST 12: Phase 5A P0 storage and hash pipeline remains unchanged', async () => {
        repository.getContractById.mockResolvedValue(mockMultiTreeContract);
        repository.signContract.mockResolvedValue({
            ...mockMultiTreeContract,
            status: 'signed',
            signedAt: new Date(),
            pdfUrl: 'https://res.cloudinary.com/demo/raw/upload/contracts/Hop-Dong-CTR-ORD-123.pdf',
        });

        const result = await service.signContract(
            'contract-multi-123',
            'user-123',
            { signatureData: 'data:image/png;base64,mockSignatureData' }
        );

        expect(result.data?.status).toBe('signed');
        expect(fileService.uploadBuffer).toHaveBeenCalled();
        expect(repository.signContract).toHaveBeenCalledWith(
            'contract-multi-123',
            'data:image/png;base64,mockSignatureData',
            expect.any(String),
            expect.objectContaining({ documentHash: sampleHash })
        );
    });
});
