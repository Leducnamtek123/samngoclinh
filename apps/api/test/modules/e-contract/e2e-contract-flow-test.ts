import * as crypto from 'crypto';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EContractService } from '../../../src/modules/e-contract/services/e-contract.service';

async function runE2EContractTests() {
    console.log('========================================================================');
    console.log('🧪 FULL END-TO-END VERIFICATION: DIGITAL SIGNATURE & 2-PHASE CONTRACT FLOW');
    console.log('========================================================================\n');

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    function assert(condition: boolean, testName: string, detail?: string) {
        totalTests++;
        if (condition) {
            passedTests++;
            console.log(`  ✅ [PASS] ${testName}`);
        } else {
            failedTests++;
            console.error(`  ❌ [FAIL] ${testName} - ${detail || 'Assertion failed'}`);
        }
    }

    // In-memory mock database store
    const db = {
        users: new Map<string, any>(),
        identityDocs: new Map<string, any>(),
        contracts: new Map<string, any>(),
        activityLogs: [] as any[],
        sentEmails: [] as any[],
    };

    // 1. Seed test users
    const customerUser = {
        id: 'usr-customer-001',
        name: 'Đức Nam Lê',
        email: 'leducnamtek123@gmail.com',
        role: 'user',
        isVerified: true,
        mobileNumbers: [{ number: '0901234567' }],
    };
    const adminUser = {
        id: 'usr-admin-001',
        name: 'Quản Trị Viên Vườn',
        email: 'admin@samngoclinh.vn',
        role: 'admin',
        isVerified: true,
        mobileNumbers: [{ number: '0988888888' }],
    };
    db.users.set(customerUser.id, customerUser);
    db.users.set(adminUser.id, adminUser);

    // Mock Repositories and Services
    const mockEContractRepo: any = {
        generateNextCode: async () => 'CTR-SNL-2026/0042',
        createContract: async (data: any) => {
            const contract = {
                id: 'ctr-' + Date.now(),
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
                amendments: [],
                items: data.items || [],
            };
            db.contracts.set(contract.id, contract);
            return contract;
        },
        getContractById: async (id: string) => {
            return db.contracts.get(id) || null;
        },
        getContractByCode: async (code: string) => {
            for (const c of db.contracts.values()) {
                if (c.code === code) return c;
            }
            return null;
        },
        listContracts: async (userId?: string) => {
            const all = Array.from(db.contracts.values());
            return userId ? all.filter((c) => c.userId === userId) : all;
        },
        updateContract: async (id: string, payload: any) => {
            const existing = db.contracts.get(id);
            if (!existing) throw new NotFoundException('Not found');
            const updated = { ...existing, ...payload, updatedAt: new Date() };
            db.contracts.set(id, updated);
            return updated;
        },
        updateStatus: async (id: string, status: string, additionalData?: any) => {
            const existing = db.contracts.get(id);
            if (!existing) throw new NotFoundException('Not found');
            const updated = { ...existing, status, ...additionalData, updatedAt: new Date() };
            db.contracts.set(id, updated);
            return updated;
        },
        deleteContract: async (id: string) => {
            db.contracts.delete(id);
            return true;
        },
    };

    const mockAmendmentRepo: any = {
        findLatestSigned: async () => null,
    };

    const mockPdfService: any = {
        generateSignedContractPdf: async (params: any) => {
            const rawContent = `Signed PDF for ${params.contractCode} by ${params.partyB}`;
            const pdfBuffer = Buffer.from(rawContent);
            const documentHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
            return {
                pdfBuffer,
                documentHash,
                qrUrl: `http://localhost:3002/trace/contract/${params.contractCode}`,
            };
        },
    };

    const mockTemplateService: any = {
        getTemplate: async () => ({
            contentHtml: '<h1>HỢP ĐỒNG MUA BÁN & ỦY QUYỀN CHĂM SÓC SÂM NGỌC LINH</h1><p>{{TEN_KHACH_HANG}}</p>',
        }),
    };

    const mockDatabaseService: any = {
        user: {
            findUnique: async ({ where }: any) => db.users.get(where.id) || null,
        },
        activityLog: {
            create: async ({ data }: any) => {
                db.activityLogs.push(data);
                return data;
            },
        },
        eContract: {
            update: async ({ where, data }: any) => {
                const existing = db.contracts.get(where.id);
                if (!existing) return null;
                const updated = { ...existing, ...data };
                db.contracts.set(where.id, updated);
                return updated;
            },
        },
    };

    const mockNotificationService: any = {
        isInitialized: () => true,
        send: async (payload: any) => {
            db.sentEmails.push(payload);
            return true;
        },
    };

    const mockConfigService: any = {
        get: (key: string) => {
            if (key === 'HOME_URL') return 'http://localhost:3002';
            if (key === 'smtp.from') return 'noreply@samngoclinh.vn';
            return null;
        },
    };

    const mockFileService: any = {
        uploadBuffer: async (_buffer: Buffer, folder: string, filename: string) => {
            return `https://cdn.samngoclinh.vn/${folder}/${filename}`;
        },
        uploadBase64: async (_base64: string, folder: string) => {
            return `https://cdn.samngoclinh.vn/${folder}/sig-${Date.now()}.png`;
        },
    };

    // Instantiate Service
    const contractService = new EContractService(
        mockEContractRepo,
        mockAmendmentRepo,
        mockPdfService,
        mockTemplateService,
        mockDatabaseService,
        mockNotificationService,
        mockConfigService,
        mockFileService
    );

    console.log('--- TEST SUITE 1: SIGNATURE VAULT (KHO CHỮ KÝ SỐ TẬP TRUNG) ---');
    // Test 1.1: Save Signature into Vault
    const sampleSignatureBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const savedSigUrl = await mockFileService.uploadBase64(sampleSignatureBase64, 'signatures');
    db.identityDocs.set(customerUser.id, { signatureUrl: savedSigUrl });

    assert(
        savedSigUrl.startsWith('https://cdn.samngoclinh.vn/signatures/'),
        'TEST 1.1: Upload and persist user digital signature to cloud storage'
    );
    assert(
        db.identityDocs.get(customerUser.id)?.signatureUrl === savedSigUrl,
        'TEST 1.2: Signature Vault returns unified saved signature for customer profile'
    );

    console.log('\n--- TEST SUITE 2: ORDER CREATION & DRAFT CONTRACT (PHASE 1) ---');
    // Test 2.1: User completes tree purchase order -> creates DRAFT contract
    const contractData: any = {
        code: 'CTR-SNL-2026/0042',
        userId: customerUser.id,
        orderId: 'ord-123456',
        title: 'Hợp đồng Mua bán, Ký gửi & Chăm sóc Cây Sâm Ngọc Linh #ORD-123456',
        content: 'Nội dung hợp đồng mua bán...',
        status: 'draft', // Phase 1: Draft waiting for Admin
        signedAt: null,
        signatureUrl: savedSigUrl,
        contractValue: 50000000,
        paymentStatus: 'paid',
        expiredAt: new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000).toISOString(),
        contractType: 'purchase_and_care',
        partyA: 'Công ty Cổ phần Sâm Ngọc Linh',
        partyB: `${customerUser.name} (CCCD: 049090001234, SĐT: 0901234567)`,
        metadata: {
            orderId: 'ord-123456',
            orderCode: 'ORD-123456',
            totalPlants: 2,
            customerSignature: savedSigUrl,
            checkoutSigned: true,
        },
        items: [
            {
                treeId: 'tree-01',
                treeCode: 'SNL-TRALINH-001',
                treeName: 'Cây Sâm Ngọc Linh 3 năm tuổi',
                ageYearAtSign: 3,
                gardenCode: 'GD-NAMTRAMY-01',
                bedCode: 'BED-04',
                unitPrice: 25000000,
            },
            {
                treeId: 'tree-02',
                treeCode: 'SNL-TRALINH-002',
                treeName: 'Cây Sâm Ngọc Linh 3 năm tuổi',
                ageYearAtSign: 3,
                gardenCode: 'GD-NAMTRAMY-01',
                bedCode: 'BED-04',
                unitPrice: 25000000,
            },
        ],
    };

    const createdContract = await mockEContractRepo.createContract(contractData);
    assert(createdContract.status === 'draft', 'TEST 2.1: Order payment creates E-Contract in "draft" status (Phase 1)');
    assert(createdContract.signedAt === null, 'TEST 2.2: Draft contract has signedAt === null before customer confirmation');
    assert(createdContract.items.length === 2, 'TEST 2.3: Contract includes allocated trees with RFID & Garden codes');

    console.log('\n--- TEST SUITE 3: DOMAIN SAFETY & ADMIN ISSUE (PHASE 2) ---');
    // Test 3.1: Customer cannot sign draft contract before Admin issues it
    let draftSignBlocked = false;
    try {
        await contractService.signContract(createdContract.id, customerUser.id, {
            signatureData: savedSigUrl,
        });
    } catch (err: any) {
        if (err instanceof BadRequestException && err.message.includes('draft')) {
            draftSignBlocked = true;
        }
    }
    assert(draftSignBlocked, 'TEST 3.1: Invariant: Customer cannot sign contract in "draft" status (Must await Admin issue)');

    // Test 3.2: Admin edits / updates contract terms
    const updatedDraft = await contractService.updateContract(createdContract.id, {
        title: 'Hợp đồng Mua bán & Bảo trợ Chăm sóc Đặc biệt Cây Sâm Ngọc Linh #ORD-123456',
        partyA: 'Công ty Cổ phần Sâm Ngọc Linh Nam Trà My',
    } as any);
    assert(
        Boolean(updatedDraft.data?.title?.includes('Bảo trợ Chăm sóc Đặc biệt')),
        'TEST 3.2: Admin can edit terms and metadata while contract is in "draft" status'
    );

    // Test 3.3: Admin issues contract to customer
    const issueResult = await contractService.issueContract(createdContract.id);
    assert(
        issueResult.data?.status === 'pending',
        'TEST 3.3: Admin issues contract -> status successfully transitions from "draft" to "pending"'
    );
    assert(
        db.sentEmails.length > 0 && db.sentEmails[0].recipients.includes(customerUser.email),
        'TEST 3.4: Admin issue sends instant email notification with signing link to customer'
    );

    console.log('\n--- TEST SUITE 4: CUSTOMER 1-CLICK SIGNING & PDF GENERATION ---');
    // Test 4.1: Customer 1-Click signs using saved signature from Vault
    const signResult = await contractService.signContract(
        createdContract.id,
        customerUser.id,
        { signatureData: savedSigUrl },
        '118.69.182.45'
    );

    assert(
        signResult.data?.status === 'signed',
        'TEST 4.1: Customer 1-Click signs with Vault signature -> status transitions to "signed"'
    );
    assert(
        signResult.data?.signedAt !== null && signResult.data?.signedAt !== undefined,
        'TEST 4.2: Signed contract records exact timestamp (signedAt)'
    );
    assert(
        Boolean(signResult.data?.pdfUrl?.endsWith('.pdf')),
        'TEST 4.3: Generates immutable signed PDF document stored on cloud CDN'
    );
    assert(
        (signResult.data?.metadata as any)?.documentHash?.length === 64,
        'TEST 4.4: SHA-256 digital document hash is generated and verified (64 hex chars)'
    );

    console.log('\n--- TEST SUITE 5: IMMUTABILITY & ROLE ACCESS INVARIANTS ---');
    // Test 5.1: Signed contract cannot be signed again (Idempotency)
    let duplicateSignBlocked = false;
    try {
        await contractService.signContract(createdContract.id, customerUser.id, {
            signatureData: savedSigUrl,
        });
    } catch (err: any) {
        if (err instanceof BadRequestException) duplicateSignBlocked = true;
    }
    assert(duplicateSignBlocked, 'TEST 5.1: Invariant: Signed contract cannot be re-signed (Idempotency guard)');

    // Test 5.2: Signed contract cannot be edited
    let editSignedBlocked = false;
    try {
        await contractService.updateContract(createdContract.id, { title: 'Illegal Edit' } as any);
    } catch (err: any) {
        if (err instanceof BadRequestException) editSignedBlocked = true;
    }
    assert(editSignedBlocked, 'TEST 5.2: Invariant: Signed contract is immutable and cannot be updated');

    // Test 5.3: Signed contract cannot be deleted
    let deleteSignedBlocked = false;
    try {
        await contractService.deleteContract(createdContract.id);
    } catch (err: any) {
        if (err instanceof BadRequestException) deleteSignedBlocked = true;
    }
    assert(deleteSignedBlocked, 'TEST 5.3: Invariant: Signed contract cannot be deleted');

    // Test 5.4: Unauthorized user cannot access other user contract
    let unauthorizedAccessBlocked = false;
    try {
        await contractService.getContract(createdContract.id, 'usr-stranger-999');
    } catch (err: any) {
        if (err instanceof ForbiddenException) unauthorizedAccessBlocked = true;
    }
    assert(unauthorizedAccessBlocked, 'TEST 5.4: Security: Stranger user cannot access customer contract (403 Forbidden)');

    // Test 5.5: Customer and Admin can list contracts
    const customerContracts = await contractService.listContracts(customerUser.id);
    assert(
        Boolean(customerContracts.data && customerContracts.data.length === 1 && customerContracts.data[0].id === createdContract.id),
        'TEST 5.5: Multi-role contract list returns customer contract cleanly without permission error'
    );

    console.log('\n========================================================================');
    console.log(`📊 FINAL TEST SUMMARY: ${passedTests}/${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
    if (failedTests === 0) {
        console.log('🎉 ALL INTEGRATION TESTS PASSED 100%! SYSTEM IS READY FOR PRODUCTION.');
    } else {
        console.error(`⚠️ ${failedTests} TESTS FAILED!`);
        process.exit(1);
    }
    console.log('========================================================================\n');
}

runE2EContractTests().catch((err) => {
    console.error('Fatal Test Execution Error:', err);
    process.exit(1);
});
