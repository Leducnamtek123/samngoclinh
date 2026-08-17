import { describe, it, expect, vi, beforeEach } from 'vitest';
import { econtractService } from '@/services/econtract.service';

describe('Web Contract Lifecycle & End-to-End Client Service Test Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockContractData = {
    id: '873500c8-40a9-4682-8407-b47a3352f031',
    code: 'CTR-SNL-2026/7191',
    userId: 'user-long-123',
    title: 'Hợp đồng Mua bán & Ủy quyền Chăm sóc Cây Sâm',
    status: 'draft',
    contractValue: 90_000_000,
    paymentStatus: 'paid',
    partyA: 'Công ty Cổ phần Sâm Ngọc Linh',
    partyB: 'Lê Hoàng Long',
  };

  it('1. should fetch my contracts list with normalized data shape', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        statusCode: 200,
        message: 'Success',
        data: [mockContractData],
      }),
    } as any);

    const contracts = await econtractService.getMyContracts();
    expect(contracts).toHaveLength(1);
    expect(contracts[0]?.id).toBe('873500c8-40a9-4682-8407-b47a3352f031');
    expect(contracts[0]?.code).toBe('CTR-SNL-2026/7191');
  });

  it('2. should fetch single contract detail by ID', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        statusCode: 200,
        message: 'Success',
        data: mockContractData,
      }),
    } as any);

    const contract = await econtractService.getContract('873500c8-40a9-4682-8407-b47a3352f031');
    expect(contract).toBeDefined();
    expect(contract?.id).toBe('873500c8-40a9-4682-8407-b47a3352f031');
    expect(contract?.code).toBe('CTR-SNL-2026/7191');
  });

  it('3. should sign contract with signature data and OTP code', async () => {
    const signedMock = {
      ...mockContractData,
      status: 'signed',
      signatureUrl: 'data:image/png;base64,mock',
    };
    global.fetch = vi.fn().mockImplementation(async (url: string, options: RequestInit) => {
      expect(url).toContain('/api/proxy/user/contracts/873500c8-40a9-4682-8407-b47a3352f031/sign');
      expect(options.method).toBe('POST');
      const body = JSON.parse(options.body as string);
      expect(body.signatureData).toBe('data:image/png;base64,mock');
      expect(body.otpCode).toBe('123456');

      return {
        ok: true,
        status: 200,
        json: async () => ({
          statusCode: 200,
          message: 'Signed successfully',
          data: signedMock,
        }),
      } as any;
    });

    const res = await econtractService.signContract(
      '873500c8-40a9-4682-8407-b47a3352f031',
      'data:image/png;base64,mock',
      '123456',
    );
    expect(res.data?.status).toBe('signed');
  });

  it('4. should verify contract authenticity via public verification endpoint', async () => {
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      expect(url).toContain('/api/proxy/public/contracts/verify/CTR-SNL-2026%2F7191');
      return {
        ok: true,
        status: 200,
        json: async () => ({
          statusCode: 200,
          data: {
            isValid: true,
            code: 'CTR-SNL-2026/7191',
            status: 'signed',
          },
        }),
      } as any;
    });

    const verification = await econtractService.verifyContract('CTR-SNL-2026/7191');
    expect(verification.isValid).toBeTruthy();
    expect(verification.code).toBe('CTR-SNL-2026/7191');
  });

  it('5. should handle API error properly when signing or fetching fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({
        statusCode: 404,
        message: 'Không tìm thấy hợp đồng',
      }),
    } as any);

    await expect(econtractService.getContract('invalid-id')).rejects.toThrow(
      'Không tìm thấy hợp đồng',
    );
  });
});
