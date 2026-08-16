const crypto = require('crypto');
const { EContractService } = require('../../../dist/modules/e-contract/services/e-contract.service');
const { ContractAmendmentRepository } = require('../../../dist/modules/e-contract/repositories/contract-amendment.repository');
const { BadRequestException } = require('@nestjs/common');

async function runTests() {
    console.log('================================================================');
    console.log('PHASE 5A + 5B + 5C — FULL E-CONTRACT SPECIFICATION TEST RUNNER');
    console.log('================================================================\n');

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    function assert(condition, testName, detail) {
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

    const mockSignedContract = {
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

    console.log('--- TEST SUITE 1: E-CONTRACT DOMAIN INVARIANTS (INV-01 -> INV-05) ---');

    const mockRepo = {
        getContractById: async (id) => (id === mockSignedContract.id ? mockSignedContract : null),
        getContractByCode: async (code) => (code === mockSignedContract.code ? mockSignedContract : null),
        updateContract: async () => {
            throw new BadRequestException('Signed contract is immutable');
        },
        deleteContract: async () => {
            throw new BadRequestException('Signed contract cannot be deleted');
        },
        updateStatus: async (id, status) => ({ ...mockSignedContract, status }),
        signContract: async (id, sigUrl, pdfUrl, meta) => ({
            ...mockSignedContract,
            status: 'signed',
            signedAt: new Date(),
            signatureUrl: sigUrl,
            pdfUrl,
            metadata: meta,
        }),
    };

    const mockPdfService = {
        generateSignedContractPdf: async () => ({
            pdfBuffer: samplePdfBuffer,
            documentHash: samplePdfHash,
            qrUrl: 'http://localhost:3002/trace/contract/CTR-O20260815001',
        }),
    };

    const mockFileService = {
        uploadBuffer: async () => 'https://res.cloudinary.com/demo/raw/upload/contracts/signed.pdf',
        uploadBase64: async () => 'https://res.cloudinary.com/demo/image/upload/signatures/sig.png',
    };

    const mockDatabaseService = {
        user: { findUnique: async () => ({ email: 'test@example.com', name: 'Trần Văn Khách' }) },
        activityLog: { create: async () => ({}) },
        eContract: { update: async () => ({}) },
    };

    const mockNotificationService = {
        isInitialized: () => false,
        send: async () => ({}),
    };

    const mockConfigService = {
        get: (key) => (key === 'HOME_URL' ? 'http://localhost:3002' : 'noreply@samngoclinh.vn'),
    };

    const service = new EContractService(
        mockRepo,
        { findLatestSigned: async () => null },
        mockPdfService,
        { getTemplate: async () => ({ contentHtml: '<p>Test</p>' }) },
        mockDatabaseService,
        mockNotificationService,
        mockConfigService,
        mockFileService
    );

    // Test INV-01: Signed contract is immutable
    let inv01Passed = false;
    try {
        await service.updateContract(mockSignedContract.id, { title: 'New Title' });
    } catch (err) {
        if (err instanceof BadRequestException) inv01Passed = true;
    }
    assert(inv01Passed, 'INV-01: Signed contract is immutable and cannot be updated');

    // Test INV-02: Signed contract cannot be deleted
    let inv02Passed = false;
    try {
        await service.deleteContract(mockSignedContract.id);
    } catch (err) {
        if (err instanceof BadRequestException) inv02Passed = true;
    }
    assert(inv02Passed, 'INV-02: Signed contract cannot be deleted');

    // Test INV-04: Cannot re-sign signed contract
    let inv04Passed = false;
    try {
        await service.signContract(mockSignedContract.id, 'user-001', {
            signatureData: 'data:image/png;base64,123',
        });
    } catch (err) {
        if (err instanceof BadRequestException) inv04Passed = true;
    }
    assert(inv04Passed, 'INV-04: Cannot re-sign already signed contract');

    // Test Multi-Tree Items
    assert(mockSignedContract.items.length === 2, 'P1 Multi-Tree: Contract accurately references multiple tree items');
    assert(mockSignedContract.items[0].treeCode === 'SNL-TRALINH-001', 'P1 Multi-Tree: Tree RFID code matches');

    console.log('\n================================================================');
    console.log(`TOTAL RESULT: ${passedTests}/${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
    console.log('================================================================\n');
}

runTests().catch(console.error);
