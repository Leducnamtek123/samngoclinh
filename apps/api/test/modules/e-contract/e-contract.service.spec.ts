import { Test, TestingModule } from '@nestjs/testing';
import { EContractService } from '../../../src/modules/e-contract/services/e-contract.service';
import { EContractRepository } from '../../../src/modules/e-contract/repositories/e-contract.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('EContractService', () => {
    let service: EContractService;
    let repository: jest.Mocked<EContractRepository>;

    const mockContract = {
        id: 'contract-123',
        code: 'CTR001',
        userId: 'user-123',
        title: 'Hợp đồng Sâm Ngọc Linh',
        status: 'draft',
        contractUrl: null,
        signedAt: null,
        signatureUrl: null,
        expiredAt: new Date('2027-01-01'),
        metadata: {},
        createdAt: new Date(),
        createdBy: null,
        updatedAt: new Date(),
        updatedBy: null,
    };

    beforeEach(async () => {
        const mockRepo = {
            createContract: jest.fn(),
            getContractById: jest.fn(),
            listContracts: jest.fn(),
            listContractsPaginated: jest.fn(),
            signContract: jest.fn(),
            renewContract: jest.fn(),
            updateContract: jest.fn(),
            deleteContract: jest.fn(),
            getExpiringContracts: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EContractService,
                {
                    provide: EContractRepository,
                    useValue: mockRepo,
                },
            ],
        }).compile();

        service = module.get<EContractService>(EContractService);
        repository = module.get(EContractRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getContract', () => {
        it('should return contract if user owns it', async () => {
            repository.getContractById.mockResolvedValue(mockContract as any);

            const result = await service.getContract('contract-123', 'user-123');
            expect(result.data).toEqual(mockContract);
        });

        it('should throw NotFoundException if contract not found', async () => {
            repository.getContractById.mockResolvedValue(null);

            await expect(service.getContract('invalid-id')).rejects.toThrow(NotFoundException);
        });

        it('should throw ForbiddenException if user does not own contract', async () => {
            repository.getContractById.mockResolvedValue(mockContract as any);

            await expect(service.getContract('contract-123', 'other-user')).rejects.toThrow(ForbiddenException);
        });
    });

    describe('signContract', () => {
        it('should sign contract successfully with IP and OTP', async () => {
            repository.getContractById.mockResolvedValue(mockContract as any);
            repository.signContract.mockResolvedValue({
                ...mockContract,
                status: 'signed',
                signatureUrl: 'data:image/png;base64,...',
            } as any);

            const result = await service.signContract(
                'contract-123',
                'user-123',
                { signatureData: 'data:image/png;base64,...', otpCode: '123456' },
                '192.168.1.1'
            );

            expect(repository.signContract).toHaveBeenCalledWith(
                'contract-123',
                expect.stringContaining('sig_CTR001'),
                expect.objectContaining({
                    signedIp: '192.168.1.1',
                    otpVerified: true,
                })
            );
            expect(result.data?.status).toBe('signed');
        });
    });
});
