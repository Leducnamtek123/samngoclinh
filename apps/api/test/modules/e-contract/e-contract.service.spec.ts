import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import { EContractService } from '../../../src/modules/e-contract/services/e-contract.service';
import { EContractRepository } from '../../../src/modules/e-contract/repositories/e-contract.repository';
import { EContractPdfService } from '../../../src/modules/e-contract/services/e-contract.pdf.service';
import { DatabaseService } from '../../../src/common/database/services/database.service';
import { NotificationSmtpService } from '../../../src/modules/notification/services/notification.smtp.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from '../../../src/common/file/services/file.service';

describe('EContractService - Phase 5A P0 Invariants & Immutability Suite', () => {
    let service: EContractService;
    let repository: any;
    let pdfService: any;
    let databaseService: any;
    let fileService: any;
    let notificationService: any;
    let configService: any;

    const samplePdfBuffer = Buffer.from('%PDF-1.4 Mocked PDF content for testing bytes');
    const sampleHash = crypto.createHash('sha256').update(samplePdfBuffer).digest('hex');

    const mockPendingContract = {
        id: 'contract-pending-123',
        code: 'CTR-PENDING-001',
        userId: 'user-123',
        title: 'Hợp đồng Sâm Ngọc Linh',
        content: 'Nội dung hợp đồng mẫu',
        contractValue: 50000000,
        paymentStatus: 'paid',
        status: 'pending',
        treeCode: 'tree-01',
        partyA: 'Công ty Cổ phần Sâm Ngọc Linh',
        partyB: 'Nguyễn Văn A',
        terms: 'Điều khoản bảo hiểm 100%',
        contractUrl: null,
        signedAt: null,
        signatureUrl: null,
        pdfUrl: null,
        expiredAt: new Date('2028-08-15T00:00:00.000Z'),
        metadata: {
            orderId: 'order-123',
            orderCode: 'ORD-123',
            totalPlants: 5,
        },
        createdAt: new Date('2026-08-15T00:00:00.000Z'),
        updatedAt: new Date('2026-08-15T00:00:00.000Z'),
    };

    const mockSignedContract = {
        ...mockPendingContract,
        id: 'contract-signed-456',
        code: 'CTR-SIGNED-001',
        status: 'signed',
        signedAt: new Date('2026-08-15T12:00:00.000Z'),
        signatureUrl: 'data:image/png;base64,mockSignatureData',
        pdfUrl: 'https://res.cloudinary.com/demo/raw/upload/contracts/Hop-Dong-CTR-SIGNED-001.pdf',
        metadata: {
            ...mockPendingContract.metadata,
            documentHash: sampleHash,
            signedIp: '127.0.0.1',
            signedAt: '2026-08-15T12:00:00.000Z',
            ekycVerified: true,
            qrUrl: 'http://localhost:3002/trace/contract/CTR-SIGNED-001',
        },
    };

    const mockDraftContract = {
        ...mockPendingContract,
        id: 'contract-draft-789',
        code: 'CTR-DRAFT-001',
        status: 'draft',
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
                qrUrl: 'http://localhost:3002/trace/contract/CTR-PENDING-001',
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
            uploadBuffer: jest.fn().mockResolvedValue('https://res.cloudinary.com/demo/raw/upload/contracts/Hop-Dong-CTR-PENDING-001.pdf'),
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

        const mockTemplateService = {
            getTemplate: jest.fn().mockResolvedValue({ contentHtml: '<p>{{TEN_KHACH_HANG}}</p>' }),
        };

        service = new EContractService(
            repository as unknown as EContractRepository,
            mockAmendmentRepository as any,
            pdfService as unknown as EContractPdfService,
            mockTemplateService as any,
            databaseService as unknown as DatabaseService,
            notificationService as unknown as NotificationSmtpService,
            configService as unknown as ConfigService,
            fileService as unknown as FileService
        );
    });

    // TEST 01: PENDING -> SIGNED succeeds
    it('TEST 01: PENDING -> SIGNED transition succeeds and stores immutable artifact', async () => {
        repository.getContractById.mockResolvedValue(mockPendingContract);
        repository.signContract.mockResolvedValue({
            ...mockPendingContract,
            status: 'signed',
            signedAt: new Date(),
            pdfUrl: 'https://res.cloudinary.com/demo/raw/upload/contracts/Hop-Dong-CTR-PENDING-001.pdf',
        });

        const result = await service.signContract(
            'contract-pending-123',
            'user-123',
            { signatureData: 'data:image/png;base64,mockSignatureData', otpCode: '123456' },
            '192.168.1.100'
        );

        expect(result.data?.status).toBe('signed');
        expect(repository.signContract).toHaveBeenCalledWith(
            'contract-pending-123',
            'data:image/png;base64,mockSignatureData',
            'https://res.cloudinary.com/demo/raw/upload/contracts/Hop-Dong-CTR-PENDING-001.pdf',
            expect.objectContaining({
                documentHash: sampleHash,
                signedIp: '192.168.1.100',
            })
        );
    });

    // TEST 02: SIGNED -> UPDATE fails (INV-01)
    it('TEST 02: SIGNED -> UPDATE fails with explicit immutable error', async () => {
        repository.getContractById.mockResolvedValue(mockSignedContract);

        await expect(
            service.updateContract('contract-signed-456', { title: 'New Modified Title' })
        ).rejects.toThrow(BadRequestException);

        await expect(
            service.updateContract('contract-signed-456', { title: 'New Modified Title' })
        ).rejects.toThrow('Signed contract is immutable and cannot be modified.');

        expect(repository.updateContract).not.toHaveBeenCalled();
    });

    // TEST 03: SIGNED -> DELETE fails (INV-02)
    it('TEST 03: SIGNED -> DELETE fails with explicit delete protection error', async () => {
        repository.getContractById.mockResolvedValue(mockSignedContract);

        await expect(
            service.deleteContract('contract-signed-456')
        ).rejects.toThrow(BadRequestException);

        await expect(
            service.deleteContract('contract-signed-456')
        ).rejects.toThrow('Signed contract cannot be deleted.');

        expect(repository.deleteContract).not.toHaveBeenCalled();
    });

    // TEST 04: SIGNED contract cannot change content
    it('TEST 04: SIGNED contract cannot change content', async () => {
        repository.getContractById.mockResolvedValue(mockSignedContract);

        await expect(
            service.updateContract('contract-signed-456', { content: 'Tampered content' })
        ).rejects.toThrow('Signed contract is immutable and cannot be modified.');
    });

    // TEST 05: SIGNED contract cannot change contractValue
    it('TEST 05: SIGNED contract cannot change contractValue', async () => {
        repository.getContractById.mockResolvedValue(mockSignedContract);

        await expect(
            service.updateContract('contract-signed-456', { contractValue: 999999999 })
        ).rejects.toThrow('Signed contract is immutable and cannot be modified.');
    });

    // TEST 06: SIGNED contract cannot change expiredAt
    it('TEST 06: SIGNED contract cannot change expiredAt via update', async () => {
        repository.getContractById.mockResolvedValue(mockSignedContract);

        await expect(
            service.updateContract('contract-signed-456', { expiredAt: '2099-01-01T00:00:00.000Z' })
        ).rejects.toThrow('Signed contract is immutable and cannot be modified.');
    });

    // TEST 07: SIGNED contract cannot change signatureUrl
    it('TEST 07: SIGNED contract cannot change signatureUrl via update', async () => {
        repository.getContractById.mockResolvedValue(mockSignedContract);

        await expect(
            service.updateContract('contract-signed-456', { metadata: { fakeSig: 'true' } })
        ).rejects.toThrow('Signed contract is immutable and cannot be modified.');
    });

    // TEST 08: SIGNED contract cannot change pdfUrl
    it('TEST 08: SIGNED contract cannot change pdfUrl via update', async () => {
        repository.getContractById.mockResolvedValue(mockSignedContract);

        await expect(
            service.updateContract('contract-signed-456', { pdfUrl: 'https://fake-url.com/fake.pdf' })
        ).rejects.toThrow('Signed contract is immutable and cannot be modified.');
    });

    // TEST 09: SIGNED contract cannot change documentHash
    it('TEST 09: SIGNED contract cannot change documentHash via update', async () => {
        repository.getContractById.mockResolvedValue(mockSignedContract);

        await expect(
            service.updateContract('contract-signed-456', { metadata: { documentHash: '00000000000000000000' } })
        ).rejects.toThrow('Signed contract is immutable and cannot be modified.');
    });

    // TEST 10: Signing generates exactly one PDF
    it('TEST 10: Signing generates exactly one PDF call to PDF service', async () => {
        repository.getContractById.mockResolvedValue(mockPendingContract);
        repository.signContract.mockResolvedValue({ ...mockPendingContract, status: 'signed' });

        await service.signContract(
            'contract-pending-123',
            'user-123',
            { signatureData: 'data:image/png;base64,mockSignatureData' }
        );

        expect(pdfService.generateSignedContractPdf).toHaveBeenCalledTimes(1);
    });

    // TEST 11: SHA-256 equals hash of uploaded PDF bytes
    it('TEST 11: SHA-256 equals exact hash of uploaded PDF byte buffer', async () => {
        repository.getContractById.mockResolvedValue(mockPendingContract);
        repository.signContract.mockResolvedValue({ ...mockPendingContract, status: 'signed' });

        await service.signContract(
            'contract-pending-123',
            'user-123',
            { signatureData: 'data:image/png;base64,mockSignatureData' }
        );

        const expectedHash = crypto.createHash('sha256').update(samplePdfBuffer).digest('hex');
        expect(fileService.uploadBuffer).toHaveBeenCalledWith(
            samplePdfBuffer,
            'contracts',
            'Hop-Dong-CTR-PENDING-001.pdf'
        );
        expect(repository.signContract).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.objectContaining({ documentHash: expectedHash })
        );
    });

    // TEST 12: GET signed PDF uses stored PDF, not regeneration
    it('TEST 12: GET signed PDF loads stored artifact and does NOT call generateSignedContractPdf', async () => {
        const localSignedContract = {
            ...mockSignedContract,
            pdfUrl: '/uploads/contracts/Hop-Dong-CTR-SIGNED-001.pdf',
        };
        repository.getContractByCode.mockResolvedValue(localSignedContract);

        const result = await service.getContractPdfBuffer('CTR-SIGNED-001');

        expect(result.buffer).toEqual(samplePdfBuffer);
        expect(fileService.readLocalByKey).toHaveBeenCalledWith('contracts/Hop-Dong-CTR-SIGNED-001.pdf');
        expect(pdfService.generateSignedContractPdf).not.toHaveBeenCalled();
    });

    // TEST 13: Missing pdfUrl on SIGNED contract produces explicit integrity error
    it('TEST 13: Missing pdfUrl on SIGNED contract produces explicit integrity error', async () => {
        const brokenSignedContract = {
            ...mockSignedContract,
            pdfUrl: null,
        };
        repository.getContractByCode.mockResolvedValue(brokenSignedContract);

        await expect(
            service.getContractPdfBuffer('CTR-SIGNED-001')
        ).rejects.toThrow(BadRequestException);

        await expect(
            service.getContractPdfBuffer('CTR-SIGNED-001')
        ).rejects.toThrow('SIGNED contract is missing immutable PDF storage.');
    });

    // TEST 14: Storage upload failure does NOT result in SIGNED status
    it('TEST 14: Storage upload failure throws InternalServerErrorException and does not mark contract SIGNED', async () => {
        repository.getContractById.mockResolvedValue(mockPendingContract);
        fileService.uploadBuffer.mockRejectedValue(new Error('Cloudinary connection timeout'));

        await expect(
            service.signContract(
                'contract-pending-123',
                'user-123',
                { signatureData: 'data:image/png;base64,mockSignatureData' }
            )
        ).rejects.toThrow(InternalServerErrorException);

        expect(repository.signContract).not.toHaveBeenCalled();
    });

    // TEST 15: Second signing attempt does not replace signed artifact
    it('TEST 15: Second signing attempt on already signed contract is rejected with BadRequestException', async () => {
        repository.getContractById.mockResolvedValue(mockSignedContract);

        await expect(
            service.signContract(
                'contract-signed-456',
                'user-123',
                { signatureData: 'data:image/png;base64,anotherSignature' }
            )
        ).rejects.toThrow(BadRequestException);

        await expect(
            service.signContract(
                'contract-signed-456',
                'user-123',
                { signatureData: 'data:image/png;base64,anotherSignature' }
            )
        ).rejects.toThrow('Hợp đồng này đã được ký kết trước đó.');

        expect(pdfService.generateSignedContractPdf).not.toHaveBeenCalled();
        expect(fileService.uploadBuffer).not.toHaveBeenCalled();
        expect(repository.signContract).not.toHaveBeenCalled();
    });

    // TEST 16: DRAFT behavior remains unchanged (can update & delete)
    it('TEST 16: DRAFT contract can be updated and deleted normally', async () => {
        repository.getContractById.mockResolvedValue(mockDraftContract);
        repository.updateContract.mockResolvedValue({ ...mockDraftContract, title: 'Updated Draft' });
        repository.deleteContract.mockResolvedValue(true);

        const updateResult = await service.updateContract('contract-draft-789', { title: 'Updated Draft' });
        expect(updateResult.data?.title).toBe('Updated Draft');
        expect(repository.updateContract).toHaveBeenCalled();

        const deleteResult = await service.deleteContract('contract-draft-789');
        expect(deleteResult.data?.success).toBe(true);
        expect(repository.deleteContract).toHaveBeenCalledWith('contract-draft-789');
    });

    // TEST 17: PENDING behavior remains unchanged (can update & delete before signing)
    it('TEST 17: PENDING contract can be updated and deleted before signing', async () => {
        repository.getContractById.mockResolvedValue(mockPendingContract);
        repository.updateContract.mockResolvedValue({ ...mockPendingContract, title: 'Updated Pending' });
        repository.deleteContract.mockResolvedValue(true);

        const updateResult = await service.updateContract('contract-pending-123', { title: 'Updated Pending' });
        expect(updateResult.data?.title).toBe('Updated Pending');

        const deleteResult = await service.deleteContract('contract-pending-123');
        expect(deleteResult.data?.success).toBe(true);
    });
});
