import { EContractAdminController } from '@modules/e-contract/controllers/e-contract.admin.controller';
import { ContactAdminController } from '@modules/contact/controllers/contact.admin.controller';

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

  beforeAll(() => {
    eContractAdminController = new EContractAdminController(
      mockEContractService as any,
      { listTemplates: jest.fn(), getTemplate: jest.fn(), updateTemplate: jest.fn(), importHtml: jest.fn() } as any
    );
    contactAdminController = new ContactAdminController(mockContactService as any);
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
