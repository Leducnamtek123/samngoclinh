import { Test, TestingModule } from '@nestjs/testing';
import { EContractAdminController } from '@modules/e-contract/controllers/e-contract.admin.controller';
import { ContactAdminController } from '@modules/contact/controllers/contact.admin.controller';
import { EContractService } from '@modules/e-contract/services/e-contract.service';
import { ContactService } from '@modules/contact/services/contact.service';

describe('API Contract Consistency Tests', () => {
  let eContractAdminController: EContractAdminController;
  let contactAdminController: ContactAdminController;

  const mockEContractService = {
    listContractsPaginated: jest.fn(),
    getContract: jest.fn(),
    createContract: jest.fn(),
    updateContract: jest.fn(),
    issueContract: jest.fn(),
    deleteContract: jest.fn(),
  };

  const mockContactService = {
    adminListPaginated: jest.fn(),
    adminGetDetail: jest.fn(),
    adminDelete: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [EContractAdminController, ContactAdminController],
      providers: [
        {
          provide: EContractService,
          useValue: mockEContractService,
        },
        {
          provide: ContactService,
          useValue: mockContactService,
        },
      ],
    }).compile();

    eContractAdminController = moduleRef.get<EContractAdminController>(EContractAdminController);
    contactAdminController = moduleRef.get<ContactAdminController>(ContactAdminController);
  });

  describe('EContractAdminController', () => {
    it('should have getContractDetail method matching GET /:id', async () => {
      expect(eContractAdminController.getContractDetail).toBeDefined();
      const mockResult: any = { id: 'contract-123', contractCode: 'CT-001' };
      mockEContractService.getContract.mockResolvedValue(mockResult);

      const result = await eContractAdminController.getContractDetail('contract-123');
      expect(mockEContractService.getContract).toHaveBeenCalledWith('contract-123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('ContactAdminController', () => {
    it('should have delete method matching DELETE /:id', async () => {
      expect(contactAdminController.delete).toBeDefined();
      mockContactService.adminDelete.mockResolvedValue(undefined);

      await contactAdminController.delete('contact-456');
      expect(mockContactService.adminDelete).toHaveBeenCalledWith('contact-456');
    });
  });
});
