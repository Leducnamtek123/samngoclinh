import { NotFoundException } from '@nestjs/common';
import { EContractService } from '../../../src/modules/e-contract/services/e-contract.service';
import { EContractRepository } from '../../../src/modules/e-contract/repositories/e-contract.repository';

describe('EContract - Get Contract Full Flow Test Suite', () => {
    let service: EContractService;
    let repository: any;
    let databaseService: any;
    let pdfService: any;
    let notificationService: any;

    const mockContract = {
        id: '873500c8-40a9-4682-8407-b47a3352f031',
        code: 'CTR-SNL-2026/7191',
        userId: 'user-long-123',
        title: 'Hợp đồng Mua bán & Ủy quyền Chăm sóc Cây Sâm',
        content: '<p>Nội dung hợp đồng</p>',
        status: 'signed',
        contractValue: 90000000,
        paymentStatus: 'paid',
        expiredAt: new Date('2028-08-17T00:00:00.000Z'),
        partyA: 'Sâm Ngọc Linh Farm',
        partyB: 'Lê Hoàng Long',
        metadata: { customerName: 'Lê Hoàng Long' },
        items: [],
        order: null,
        amendments: [],
    };

    beforeEach(() => {
        databaseService = {
            eContract: {
                findUnique: jest.fn().mockImplementation(({ where }) => {
                    if (where.id === mockContract.id) return Promise.resolve(mockContract);
                    if (where.code === mockContract.code) return Promise.resolve(mockContract);
                    return Promise.resolve(null);
                }),
                findFirst: jest.fn().mockImplementation(({ where }) => {
                    if (where?.OR?.some((cond: any) => cond.id === mockContract.id || cond.code === mockContract.code)) {
                        return Promise.resolve(mockContract);
                    }
                    return Promise.resolve(null);
                }),
            },
        };

        const paginationService: any = {};
        repository = new EContractRepository(databaseService, paginationService);

        pdfService = {
            generateSignedContractPdf: jest.fn(),
            getContractPdfBuffer: jest.fn(),
        };

        notificationService = {
            sendContractIssuedEmail: jest.fn(),
        };

        service = new EContractService(
            repository,
            {} as any,
            pdfService,
            {} as any,
            databaseService,
            notificationService,
            {} as any,
            {} as any
        );
    });

    it('should find contract by UUID id directly', async () => {
        const result = await service.getContract('873500c8-40a9-4682-8407-b47a3352f031');
        expect(result.data).toBeDefined();
        expect(result.data.id).toBe('873500c8-40a9-4682-8407-b47a3352f031');
        expect(result.data.code).toBe('CTR-SNL-2026/7191');
    });

    it('should fallback to finding contract by code if code was passed instead of id', async () => {
        const result = await service.getContract('CTR-SNL-2026/7191');
        expect(result.data).toBeDefined();
        expect(result.data.id).toBe('873500c8-40a9-4682-8407-b47a3352f031');
        expect(result.data.code).toBe('CTR-SNL-2026/7191');
    });

    it('should throw NotFoundException when neither id nor code matches', async () => {
        await expect(service.getContract('non-existent-uuid')).rejects.toThrow(NotFoundException);
    });

    it('should handle repository include fallback if database relation query fails', async () => {
        databaseService.eContract.findUnique = jest.fn()
            .mockRejectedValueOnce(new Error('Relation items does not exist'))
            .mockResolvedValueOnce(mockContract);

        const result = await service.getContract('873500c8-40a9-4682-8407-b47a3352f031');
        expect(result.data).toBeDefined();
        expect(result.data.id).toBe('873500c8-40a9-4682-8407-b47a3352f031');
    });
});
