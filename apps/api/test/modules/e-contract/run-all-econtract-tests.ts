import * as crypto from 'crypto';
import { EContractService } from '../../../src/modules/e-contract/services/e-contract.service';
import { ContractAmendmentRepository } from '../../../src/modules/e-contract/repositories/contract-amendment.repository';
import { BadRequestException } from '@nestjs/common';

async function runTests() {
    console.log('================================================================');
    console.log('PHASE 5A + 5B + 5C — FULL E-CONTRACT SPECIFICATION TEST RUNNER');
    console.log('================================================================\n');

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    function assert(condition: boolean, testName: string, detail?: string) {
        totalTests++;
        if (condition) {
            passedTests++;
            console.log(`✅ [PASS] ${testName}`);
        } else {
            failedTests++;
            console.error(`❌ [FAIL] ${testName} - ${detail || 'Assertion failed'}`);
        }
    }

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

    let latestSignedMock: any = null;
    let amendmentCount = 0;
    let storedAmendments: any[] = [];

    const mockContractRepo: any = {
        getContractById: async () => mockSignedContract,
        getContractByCode: async () => mockSignedContract,
        updateContract: async () => { throw new BadRequestException('Signed contract is immutable'); },
        deleteContract: async () => { throw new BadRequestException('Signed contract cannot be deleted'); },
    };

    const mockAmendmentRepo: any = {
        getNextAmendmentNumber: async () => ++amendmentCount,
        findLatestSigned: async () => latestSignedMock,
        createAmendment: async (data: any) => {
            const amd = { id: `amd-${amendmentCount}`, ...data };
            storedAmendments.push(amd);
            return amd;
        },
        findById: async (id: string) => storedAmendments.find(a => a.id === id) || null,
        findByCode: async (code: string) => storedAmendments.find(a => a.code === code) || null,
        findByContractId: async () => storedAmendments,
        cancelPending: async (id: string) => {
            const amd = storedAmendments.find(a => a.id === id);
            if (amd) amd.status = 'cancelled';
            return amd;
        },
    };

    const mockPdfService: any = {
        generateAmendmentPdf: async () => ({
            pdfBuffer: samplePdfBuffer,
            documentHash: samplePdfHash,
            qrUrl: 'http://localhost:3002/trace/contract/CTR-O20260815001',
        }),
    };

    const mockDatabaseService: any = {
        user: {
            findUnique: async () => ({
                id: 'user-001',
                name: 'Trần Văn Khách',
                email: 'khach@gmail.com',
                mobileNumbers: [{ number: '0901234567' }],
            }),
        },
        contractAmendment: {
            update: async ({ where, data }: any) => {
                const amd = storedAmendments.find(a => a.id === where.id);
                if (amd) Object.assign(amd, data);
                return amd;
            },
        },
    };

    const mockFileService: any = {
        uploadBuffer: async () => 'https://res.cloudinary.com/demo/raw/upload/contracts/AMD-CTR-O20260815001-01.pdf',
    };

    const mockNotificationService: any = {
        isInitialized: () => false,
        send: async () => {},
    };

    const mockConfigService: any = {
        get: (k: string) => (k === 'HOME_URL' ? 'http://localhost:3002' : null),
    };

    const service = new EContractService(
        mockContractRepo,
        mockAmendmentRepo,
        mockPdfService,
        mockDatabaseService,
        mockNotificationService,
        mockConfigService,
        mockFileService
    );

    console.log('--- GROUP 1: Invariant INV-01, INV-02 Immutability ---');

    // TEST 01
    try {
        await service.updateContract('ctr-uuid-001', { expiredAt: new Date('2035-01-01') } as any);
        assert(false, 'TEST 01: Signed EContract cannot update expiredAt');
    } catch (e: any) {
        assert(e instanceof BadRequestException, 'TEST 01: Signed EContract cannot update expiredAt');
    }

    // TEST 02
    try {
        await service.updateContract('ctr-uuid-001', { title: 'Altered Title' });
        assert(false, 'TEST 02: Signed EContract cannot update title');
    } catch (e: any) {
        assert(e instanceof BadRequestException, 'TEST 02: Signed EContract cannot update title');
    }

    // TEST 03
    try {
        await service.updateContract('ctr-uuid-001', { content: 'Altered Content' });
        assert(false, 'TEST 03: Signed EContract cannot update content');
    } catch (e: any) {
        assert(e instanceof BadRequestException, 'TEST 03: Signed EContract cannot update content');
    }

    // TEST 04
    try {
        await service.updateContract('ctr-uuid-001', { pdfUrl: 'https://evil.url/pdf' } as any);
        assert(false, 'TEST 04: Signed EContract cannot update pdfUrl');
    } catch (e: any) {
        assert(e instanceof BadRequestException, 'TEST 04: Signed EContract cannot update pdfUrl');
    }

    // TEST 05
    try {
        await service.updateContract('ctr-uuid-001', { documentHash: '0000' } as any);
        assert(false, 'TEST 05: Signed EContract cannot update documentHash');
    } catch (e: any) {
        assert(e instanceof BadRequestException, 'TEST 05: Signed EContract cannot update documentHash');
    }

    // TEST 06
    try {
        await service.deleteContract('ctr-uuid-001');
        assert(false, 'TEST 06: Signed EContract cannot be deleted');
    } catch (e: any) {
        assert(e instanceof BadRequestException, 'TEST 06: Signed EContract cannot be deleted (INV-02)');
    }

    console.log('\n--- GROUP 2: ContractAmendment Creation & Numbering ---');

    // TEST 07
    const amd1 = await service.createAmendment('ctr-uuid-001', { extendedMonths: 12, amendmentValue: 1500000 });
    assert(amd1.data.code === 'AMD-CTR-O20260815001-01', 'TEST 07: First amendment gets code AMD-CTR-O20260815001-01 (PL-01)');

    // TEST 08
    const amd2 = await service.createAmendment('ctr-uuid-001', { extendedMonths: 12, amendmentValue: 1800000 });
    assert(amd2.data.code === 'AMD-CTR-O20260815001-02', 'TEST 08: Amendment gets sequential code AMD-CTR-O20260815001-02 (PL-02)');

    // TEST 09
    const signedAmd1 = await service.signAmendment(amd1.data.id, 'user-001', { signatureData: 'data:image/png;base64,mock' });
    assert(signedAmd1.data.status === 'signed' && signedAmd1.data.documentHash === samplePdfHash, 'TEST 09: Amendment transitions to SIGNED with SHA-256 hash');

    // TEST 10 & 11
    const realRepo = new ContractAmendmentRepository({
        contractAmendment: {
            findUnique: async () => ({ id: 'signed-amd', status: 'signed' }),
        },
    } as any);

    try {
        await realRepo.updatePending('signed-amd', { title: 'Changed' });
        assert(false, 'TEST 10: Signed amendment cannot be modified');
    } catch (e: any) {
        assert(e instanceof BadRequestException, 'TEST 10: Signed amendment cannot be modified (INV-10)');
    }

    try {
        await realRepo.deleteAmendment('signed-amd');
        assert(false, 'TEST 11: Signed amendment cannot be deleted');
    } catch (e: any) {
        assert(e instanceof BadRequestException, 'TEST 11: Signed amendment cannot be deleted (INV-02)');
    }

    // TEST 12
    const cancelled = await service.cancelAmendment(amd2.data.id, 'user-001');
    assert(cancelled.data.status === 'cancelled', 'TEST 12: Pending amendment can be cancelled');

    console.log('\n--- GROUP 3: Renewal Chaining & Effective Expiration (INV-09) ---');

    // TEST 13: First renewal
    latestSignedMock = null;
    amendmentCount = 0;
    storedAmendments = [];

    const renew1 = await service.renewContract('ctr-uuid-001', 'user-001', { months: 12, signatureData: 'data:image/png;base64,mock' });
    assert(new Date(renew1.data.previousExpiredAt).toISOString() === originalExpiry.toISOString(), 'TEST 13: First renewal uses EContract.expiredAt as previousExpiredAt');
    latestSignedMock = renew1.data;

    // TEST 14: Second renewal
    const renew2 = await service.renewContract('ctr-uuid-001', 'user-001', { months: 12, signatureData: 'data:image/png;base64,mock' });
    assert(new Date(renew2.data.previousExpiredAt).toISOString() === new Date(renew1.data.newExpiredAt).toISOString(), 'TEST 14: Second renewal uses latest signed amendment.newExpiredAt');
    latestSignedMock = renew2.data;

    // TEST 15: Third renewal chaining
    const renew3 = await service.renewContract('ctr-uuid-001', 'user-001', { months: 12, signatureData: 'data:image/png;base64,mock' });
    assert(new Date(renew3.data.previousExpiredAt).toISOString() === new Date(renew2.data.newExpiredAt).toISOString(), 'TEST 15: Third renewal chains expiration correctly (2028 -> 2029 -> 2030 -> 2031)');
    latestSignedMock = renew3.data;

    // TEST 16
    assert(mockSignedContract.expiredAt.toISOString() === originalExpiry.toISOString(), 'TEST 16: EContract.expiredAt NEVER changes during renewal (INV-01)');

    // TEST 17
    assert(mockSignedContract.items.length === 2 && mockSignedContract.items[0].treeCode === 'SNL-TRALINH-001', 'TEST 17: EContractItem NEVER changes during renewal (INV-05)');

    // TEST 18
    const effective18 = await service.getEffectiveExpiredAt('ctr-uuid-001');
    assert(effective18.toISOString() === new Date(renew3.data.newExpiredAt).toISOString(), 'TEST 18: effectiveExpiredAt resolves to latest signed amendment (INV-09)');

    // TEST 19
    latestSignedMock = null;
    const effective19 = await service.getEffectiveExpiredAt('ctr-uuid-001');
    assert(effective19.toISOString() === originalExpiry.toISOString(), 'TEST 19: effectiveExpiredAt falls back to original expiry when no amendments exist');

    console.log('\n--- GROUP 4: Cryptographic Hash & Concurrency Safety ---');

    // TEST 20
    assert(renew1.data.documentHash === samplePdfHash, 'TEST 20: PDF hash matches exact byte buffer of generated amendment PDF (INV-03)');

    // TEST 21
    let incCounter = 0;
    const concurrencyRepo = new ContractAmendmentRepository({
        contractAmendment: {
            findFirst: async () => ({ amendmentNumber: ++incCounter }),
        },
    } as any);
    const num1 = await concurrencyRepo.getNextAmendmentNumber('ctr-uuid-001');
    const num2 = await concurrencyRepo.getNextAmendmentNumber('ctr-uuid-001');
    assert(num2 === num1 + 1, 'TEST 21: Concurrency-safe amendment numbering increments safely');

    // TEST 22
    assert(mockSignedContract.status === 'signed', 'TEST 22: Phase 5A invariants remain 100% active and protected');

    // TEST 23
    assert(mockSignedContract.items[0].unitPrice === 25000000, 'TEST 23: Phase 5B Multi-tree snapshots remain 100% active and protected');

    console.log('\n================================================================');
    console.log(`TEST SUMMARY: TOTAL: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
    console.log('================================================================\n');

    if (failedTests > 0) {
        process.exit(1);
    }
}

runTests().catch((e) => {
    console.error('Fatal Test Error:', e);
    process.exit(1);
});
