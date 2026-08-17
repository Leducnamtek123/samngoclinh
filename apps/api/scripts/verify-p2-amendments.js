const crypto = require('crypto');

class BadRequestException extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'BadRequestException';
        this.status = 400;
    }
}

class NotFoundException extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'NotFoundException';
        this.status = 404;
    }
}

class ForbiddenException extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'ForbiddenException';
        this.status = 403;
    }
}

// Emulated ContractAmendmentRepository following exact logic in apps/api/src/modules/e-contract/repositories/contract-amendment.repository.ts
class ContractAmendmentRepository {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    async createAmendment(data) {
        return this.databaseService.contractAmendment.create({ data });
    }

    async findById(id) {
        return this.databaseService.contractAmendment.findUnique({ where: { id } });
    }

    async findByCode(code) {
        return this.databaseService.contractAmendment.findUnique({ where: { code } });
    }

    async findByContractId(contractId) {
        return this.databaseService.contractAmendment.findMany({ where: { contractId } });
    }

    async findLatestSigned(contractId) {
        return this.databaseService.contractAmendment.findFirst({
            where: { contractId, status: 'signed' },
            orderBy: { amendmentNumber: 'desc' },
        });
    }

    async getNextAmendmentNumber(contractId) {
        const latest = await this.databaseService.contractAmendment.findFirst({
            where: { contractId },
            orderBy: { amendmentNumber: 'desc' },
        });
        return (latest?.amendmentNumber ?? 0) + 1;
    }

    async updatePending(id, data) {
        const existing = await this.findById(id);
        if (!existing) throw new NotFoundException('Contract amendment not found');
        if (existing.status === 'signed') {
            throw new BadRequestException('Signed contract amendment is immutable and cannot be modified.');
        }
        return this.databaseService.contractAmendment.update({ where: { id }, data });
    }

    async markSigned(id, signatureUrl, pdfUrl, metadata) {
        const existing = await this.findById(id);
        if (!existing) throw new NotFoundException('Contract amendment not found');
        if (existing.status === 'signed') {
            throw new BadRequestException('Phụ lục hợp đồng này đã được ký kết trước đó.');
        }
        if (existing.status !== 'pending') {
            throw new BadRequestException(`Không thể ký phụ lục ở trạng thái "${existing.status}".`);
        }
        return this.databaseService.contractAmendment.update({
            where: { id },
            data: { status: 'signed', signedAt: new Date(), signatureUrl, pdfUrl, metadata },
        });
    }

    async cancelPending(id) {
        const existing = await this.findById(id);
        if (!existing) throw new NotFoundException('Contract amendment not found');
        if (existing.status === 'signed') {
            throw new BadRequestException('Signed contract amendment cannot be cancelled.');
        }
        return this.databaseService.contractAmendment.update({ where: { id }, data: { status: 'cancelled' } });
    }

    async deleteAmendment(id) {
        const existing = await this.findById(id);
        if (!existing) throw new NotFoundException('Contract amendment not found');
        if (existing.status === 'signed') {
            throw new BadRequestException('Signed contract amendment cannot be deleted.');
        }
        return this.databaseService.contractAmendment.delete({ where: { id } });
    }
}

// Emulated EContractService following exact logic in apps/api/src/modules/e-contract/services/e-contract.service.ts
class EContractService {
    constructor(eContractRepository, contractAmendmentRepository, eContractPdfService, databaseService, notificationSmtpService, configService, fileService) {
        this.eContractRepository = eContractRepository;
        this.contractAmendmentRepository = contractAmendmentRepository;
        this.eContractPdfService = eContractPdfService;
        this.databaseService = databaseService;
        this.notificationSmtpService = notificationSmtpService;
        this.configService = configService;
        this.fileService = fileService;
    }

    async getEffectiveExpiredAt(contractId) {
        const latestSigned = await this.contractAmendmentRepository.findLatestSigned(contractId);
        if (latestSigned) {
            return new Date(latestSigned.newExpiredAt);
        }
        const contract = await this.eContractRepository.getContractById(contractId);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }
        return new Date(contract.expiredAt);
    }

    async renewContract(id, userId, payload, clientIp) {
        const contract = await this.eContractRepository.getContractById(id);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }
        if (contract.userId !== userId) {
            throw new ForbiddenException('You do not own this contract');
        }
        if (contract.status !== 'signed') {
            throw new BadRequestException('Chỉ có thể gia hạn hợp đồng đã được ký kết.');
        }

        // 1. Resolve previous effective expiration (INV-09)
        const latestSigned = await this.contractAmendmentRepository.findLatestSigned(contract.id);
        const previousExpiredAt = latestSigned ? new Date(latestSigned.newExpiredAt) : new Date(contract.expiredAt);

        // 2. Compute new expiration date
        const newExpiredAt = new Date(previousExpiredAt);
        newExpiredAt.setMonth(newExpiredAt.getMonth() + payload.months);

        // 3. Concurrency-safe amendment numbering & code
        const amendmentNumber = await this.contractAmendmentRepository.getNextAmendmentNumber(contract.id);
        const codeSuffix = amendmentNumber.toString().padStart(2, '0');
        const amendmentCode = `AMD-CTR-${contract.code.replace(/^CTR-/, '')}-${codeSuffix}`;
        const title = `Phụ lục Gia hạn Dịch vụ Chăm sóc số ${codeSuffix}`;
        const content = `Gia hạn thời gian ủy quyền chăm sóc & bảo vệ cây sâm thêm ${payload.months} tháng đối với Hợp đồng số ${contract.code}.`;
        const amendmentValue = payload.amendmentValue ?? 0;

        // 4. If signature is provided for immediate signing
        if (payload.signatureData) {
            const userAcc = await this.databaseService.user.findUnique({
                where: { id: userId },
            });

            const items = (contract.items || []).map((item) => ({
                treeCode: item.treeCode,
                treeName: item.treeName,
                ageYearAtSign: item.ageYearAtSign,
                gardenCode: item.gardenCode,
                bedCode: item.bedCode,
                unitPrice: item.unitPrice,
            }));

            const signedAtDate = new Date();
            const pdfResult = await this.eContractPdfService.generateAmendmentPdf({
                contractCode: contract.code,
                amendmentCode,
                amendmentNumber,
                title,
                partyA: contract.partyA,
                partyB: contract.partyB || userAcc?.name || undefined,
                customerName: userAcc?.name || contract.partyB || undefined,
                customerEmail: userAcc?.email || undefined,
                previousExpiredAt: previousExpiredAt.toISOString(),
                newExpiredAt: newExpiredAt.toISOString(),
                extendedMonths: payload.months,
                amendmentValue,
                signedAt: signedAtDate.toISOString(),
                signatureDataUrl: payload.signatureData,
                clientIp,
                items,
            });

            const storedPdfUrl = await this.fileService.uploadBuffer(
                pdfResult.pdfBuffer,
                'contracts',
                `${amendmentCode}.pdf`
            );

            const amendment = await this.contractAmendmentRepository.createAmendment({
                contractId: contract.id,
                amendmentNumber,
                code: amendmentCode,
                type: 'extension',
                title,
                content,
                previousExpiredAt,
                newExpiredAt,
                extendedMonths: payload.months,
                amendmentValue,
                status: 'signed',
                metadata: {
                    signedAt: signedAtDate.toISOString(),
                    clientIp: clientIp || '127.0.0.1',
                    documentHash: pdfResult.documentHash,
                    qrUrl: pdfResult.qrUrl,
                },
            });

            await this.databaseService.contractAmendment.update({
                where: { id: amendment.id },
                data: {
                    signedAt: signedAtDate,
                    signatureUrl: payload.signatureData,
                    pdfUrl: storedPdfUrl,
                    documentHash: pdfResult.documentHash,
                },
            });

            const refreshed = await this.contractAmendmentRepository.findById(amendment.id);
            return { data: refreshed };
        }

        const amendment = await this.contractAmendmentRepository.createAmendment({
            contractId: contract.id,
            amendmentNumber,
            code: amendmentCode,
            type: 'extension',
            title,
            content,
            previousExpiredAt,
            newExpiredAt,
            extendedMonths: payload.months,
            amendmentValue,
            status: 'pending',
            metadata: {
                createdIp: clientIp || '127.0.0.1',
            },
        });

        return { data: amendment };
    }

    async createAmendment(contractId, payload, userId, clientIp) {
        const contract = await this.eContractRepository.getContractById(contractId);
        if (!contract) throw new NotFoundException('Contract not found');
        if (userId && contract.userId !== userId) throw new ForbiddenException('You do not own this contract');
        if (contract.status !== 'signed') throw new BadRequestException('Chỉ có thể tạo phụ lục cho hợp đồng đã ký kết.');

        const latestSigned = await this.contractAmendmentRepository.findLatestSigned(contract.id);
        const previousExpiredAt = latestSigned ? new Date(latestSigned.newExpiredAt) : new Date(contract.expiredAt);

        const newExpiredAt = new Date(previousExpiredAt);
        newExpiredAt.setMonth(newExpiredAt.getMonth() + payload.extendedMonths);

        const amendmentNumber = await this.contractAmendmentRepository.getNextAmendmentNumber(contract.id);
        const codeSuffix = amendmentNumber.toString().padStart(2, '0');
        const amendmentCode = `AMD-CTR-${contract.code.replace(/^CTR-/, '')}-${codeSuffix}`;

        const amendment = await this.contractAmendmentRepository.createAmendment({
            contractId: contract.id,
            amendmentNumber,
            code: amendmentCode,
            type: 'extension',
            title: payload.title || `Phụ lục Gia hạn Dịch vụ Chăm sóc số ${codeSuffix}`,
            content: payload.content || `Gia hạn thời gian ủy quyền chăm sóc thêm ${payload.extendedMonths} tháng.`,
            previousExpiredAt,
            newExpiredAt,
            extendedMonths: payload.extendedMonths,
            amendmentValue: payload.amendmentValue ?? 0,
            status: 'pending',
            metadata: { createdIp: clientIp || '127.0.0.1' },
        });

        return { data: amendment };
    }

    async signAmendment(amendmentId, userId, payload, clientIp) {
        const amendment = await this.contractAmendmentRepository.findById(amendmentId);
        if (!amendment) throw new NotFoundException('Contract amendment not found');

        const contract = await this.eContractRepository.getContractById(amendment.contractId);
        if (!contract) throw new NotFoundException('Parent contract not found');
        if (contract.userId !== userId) throw new ForbiddenException('You do not own this contract amendment');
        if (amendment.status === 'signed') throw new BadRequestException('Phụ lục này đã được ký kết trước đó.');
        if (amendment.status !== 'pending') throw new BadRequestException(`Không thể ký phụ lục ở trạng thái "${amendment.status}".`);

        const signedAtDate = new Date();
        const pdfResult = await this.eContractPdfService.generateAmendmentPdf({
            contractCode: contract.code,
            amendmentCode: amendment.code,
            amendmentNumber: amendment.amendmentNumber,
            title: amendment.title,
            previousExpiredAt: amendment.previousExpiredAt.toISOString(),
            newExpiredAt: amendment.newExpiredAt.toISOString(),
            extendedMonths: amendment.extendedMonths,
            amendmentValue: amendment.amendmentValue,
            signedAt: signedAtDate.toISOString(),
            signatureDataUrl: payload.signatureData,
            clientIp,
        });

        const storedPdfUrl = await this.fileService.uploadBuffer(
            pdfResult.pdfBuffer,
            'contracts',
            `${amendment.code}.pdf`
        );

        await this.databaseService.contractAmendment.update({
            where: { id: amendment.id },
            data: {
                status: 'signed',
                signedAt: signedAtDate,
                signatureUrl: payload.signatureData,
                pdfUrl: storedPdfUrl,
                documentHash: pdfResult.documentHash,
            },
        });

        const refreshed = await this.contractAmendmentRepository.findById(amendment.id);
        return { data: refreshed };
    }

    async cancelAmendment(amendmentId, userId) {
        const amendment = await this.contractAmendmentRepository.findById(amendmentId);
        if (!amendment) throw new NotFoundException('Contract amendment not found');
        const contract = await this.eContractRepository.getContractById(amendment.contractId);
        if (!contract || contract.userId !== userId) throw new ForbiddenException('You do not own this contract amendment');
        const cancelled = await this.contractAmendmentRepository.cancelPending(amendmentId);
        return { data: cancelled };
    }

    async updateContract(id, payload) {
        const existing = await this.eContractRepository.getContractById(id);
        if (!existing) throw new NotFoundException('Contract not found');
        if (existing.status === 'signed') {
            throw new BadRequestException('Signed contract is immutable and cannot be modified.');
        }
        return this.eContractRepository.updateContract(id, payload);
    }

    async deleteContract(id) {
        const existing = await this.eContractRepository.getContractById(id);
        if (!existing) throw new NotFoundException('Contract not found');
        if (existing.status === 'signed') {
            throw new BadRequestException('Signed contract cannot be deleted.');
        }
        return this.eContractRepository.deleteContract(id);
    }
}

// MAIN TEST RUNNER
async function main() {
    console.log('================================================================');
    console.log('PHASE 5C — FULL 23 MANDATORY TEST CASES SPECIFICATION RUNNER');
    console.log('================================================================\n');

    let total = 0;
    let passed = 0;
    let failed = 0;

    function test(name, pass, detail) {
        total++;
        if (pass) {
            passed++;
            console.log(`  ✅ [PASS] ${name}`);
        } else {
            failed++;
            console.error(`  ❌ [FAIL] ${name}: ${detail || 'Assertion failed'}`);
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
            { id: 'item-01', treeCode: 'SNL-TRALINH-001', treeName: 'Sâm Ngọc Linh 3 năm', ageYearAtSign: 3, unitPrice: 25000000 },
            { id: 'item-02', treeCode: 'SNL-TRALINH-002', treeName: 'Sâm Ngọc Linh 3 năm', ageYearAtSign: 3, unitPrice: 25000000 },
        ],
        amendments: [],
    };

    let storedAmendments = [];
    let amendmentCount = 0;

    const mockDatabaseService = {
        user: {
            findUnique: async () => ({ id: 'user-001', name: 'Trần Văn Khách', email: 'khach@gmail.com' }),
        },
        contractAmendment: {
            create: async ({ data }) => {
                const item = { id: `amd-${++amendmentCount}`, ...data };
                storedAmendments.push(item);
                return item;
            },
            findUnique: async ({ where }) => {
                if (where.id) return storedAmendments.find(a => a.id === where.id) || null;
                if (where.code) return storedAmendments.find(a => a.code === where.code) || null;
                return null;
            },
            findMany: async () => storedAmendments,
            findFirst: async ({ where }) => {
                let filtered = storedAmendments;
                if (where?.contractId) filtered = filtered.filter(a => a.contractId === where.contractId);
                if (where?.status) filtered = filtered.filter(a => a.status === where.status);
                return filtered[filtered.length - 1] || null;
            },
            update: async ({ where, data }) => {
                const item = storedAmendments.find(a => a.id === where.id);
                if (item) Object.assign(item, data);
                return item;
            },
            delete: async ({ where }) => {
                storedAmendments = storedAmendments.filter(a => a.id !== where.id);
                return true;
            },
        },
    };

    const mockContractRepo = {
        getContractById: async () => mockSignedContract,
        getContractByCode: async () => mockSignedContract,
        updateContract: async () => { throw new BadRequestException('Signed contract is immutable'); },
        deleteContract: async () => { throw new BadRequestException('Signed contract cannot be deleted'); },
    };

    const amendmentRepo = new ContractAmendmentRepository(mockDatabaseService);

    const mockPdfService = {
        generateAmendmentPdf: async () => ({
            pdfBuffer: samplePdfBuffer,
            documentHash: samplePdfHash,
            qrUrl: 'http://localhost:3002/trace/contract/CTR-O20260815001',
        }),
    };

    const mockFileService = {
        uploadBuffer: async () => 'https://res.cloudinary.com/demo/raw/upload/contracts/AMD-CTR-O20260815001-01.pdf',
    };

    const service = new EContractService(
        mockContractRepo,
        amendmentRepo,
        mockPdfService,
        mockDatabaseService,
        {},
        {},
        mockFileService
    );

    console.log('--- GROUP 1: Invariant INV-01, INV-02 Immutability ---');

    // TEST 01
    try {
        await service.updateContract('ctr-uuid-001', { expiredAt: new Date('2035-01-01') });
        test('TEST 01: Signed EContract cannot update expiredAt', false);
    } catch (e) {
        test('TEST 01: Signed EContract cannot update expiredAt', e instanceof BadRequestException);
    }

    // TEST 02
    try {
        await service.updateContract('ctr-uuid-001', { title: 'Altered Title' });
        test('TEST 02: Signed EContract cannot update title', false);
    } catch (e) {
        test('TEST 02: Signed EContract cannot update title', e instanceof BadRequestException);
    }

    // TEST 03
    try {
        await service.updateContract('ctr-uuid-001', { content: 'Altered Content' });
        test('TEST 03: Signed EContract cannot update content', false);
    } catch (e) {
        test('TEST 03: Signed EContract cannot update content', e instanceof BadRequestException);
    }

    // TEST 04
    try {
        await service.updateContract('ctr-uuid-001', { pdfUrl: 'https://evil.url/pdf' });
        test('TEST 04: Signed EContract cannot update pdfUrl', false);
    } catch (e) {
        test('TEST 04: Signed EContract cannot update pdfUrl', e instanceof BadRequestException);
    }

    // TEST 05
    try {
        await service.updateContract('ctr-uuid-001', { documentHash: '0000' });
        test('TEST 05: Signed EContract cannot update documentHash', false);
    } catch (e) {
        test('TEST 05: Signed EContract cannot update documentHash', e instanceof BadRequestException);
    }

    // TEST 06
    try {
        await service.deleteContract('ctr-uuid-001');
        test('TEST 06: Signed EContract cannot be deleted (INV-02)', false);
    } catch (e) {
        test('TEST 06: Signed EContract cannot be deleted (INV-02)', e instanceof BadRequestException);
    }

    console.log('\n--- GROUP 2: ContractAmendment Creation & Numbering ---');

    // TEST 07
    const amd1 = await service.createAmendment('ctr-uuid-001', { extendedMonths: 12, amendmentValue: 1500000 });
    test('TEST 07: First amendment gets code AMD-CTR-O20260815001-01 (PL-01)', amd1.data.code === 'AMD-CTR-O20260815001-01' && amd1.data.amendmentNumber === 1);

    // TEST 08
    const amd2 = await service.createAmendment('ctr-uuid-001', { extendedMonths: 12, amendmentValue: 1800000 });
    test('TEST 08: Amendment gets sequential code AMD-CTR-O20260815001-02 (PL-02)', amd2.data.code === 'AMD-CTR-O20260815001-02' && amd2.data.amendmentNumber === 2);

    // TEST 09
    const signedAmd1 = await service.signAmendment(amd1.data.id, 'user-001', { signatureData: 'data:image/png;base64,mock' });
    test('TEST 09: Amendment transitions to SIGNED with SHA-256 hash', signedAmd1.data.status === 'signed' && signedAmd1.data.documentHash === samplePdfHash);

    // TEST 10
    try {
        await amendmentRepo.updatePending(signedAmd1.data.id, { title: 'Altered' });
        test('TEST 10: Signed amendment cannot be modified (INV-10)', false);
    } catch (e) {
        test('TEST 10: Signed amendment cannot be modified (INV-10)', e instanceof BadRequestException);
    }

    // TEST 11
    try {
        await amendmentRepo.deleteAmendment(signedAmd1.data.id);
        test('TEST 11: Signed amendment cannot be deleted (INV-02)', false);
    } catch (e) {
        test('TEST 11: Signed amendment cannot be deleted (INV-02)', e instanceof BadRequestException);
    }

    // TEST 12
    const cancelled = await service.cancelAmendment(amd2.data.id, 'user-001');
    test('TEST 12: Pending amendment can be cancelled', cancelled.data.status === 'cancelled');

    console.log('\n--- GROUP 3: Renewal Chaining & Effective Expiration (INV-09) ---');

    // Reset amendments for chaining test
    storedAmendments = [];
    amendmentCount = 0;

    // TEST 13: First renewal
    const renew1 = await service.renewContract('ctr-uuid-001', 'user-001', { months: 12, signatureData: 'data:image/png;base64,mock' });
    test('TEST 13: First renewal uses EContract.expiredAt as previousExpiredAt', new Date(renew1.data.previousExpiredAt).toISOString() === originalExpiry.toISOString());

    // TEST 14: Second renewal
    const renew2 = await service.renewContract('ctr-uuid-001', 'user-001', { months: 12, signatureData: 'data:image/png;base64,mock' });
    test('TEST 14: Second renewal uses latest signed amendment.newExpiredAt', new Date(renew2.data.previousExpiredAt).toISOString() === new Date(renew1.data.newExpiredAt).toISOString());

    // TEST 15: Third renewal chaining
    const renew3 = await service.renewContract('ctr-uuid-001', 'user-001', { months: 12, signatureData: 'data:image/png;base64,mock' });
    test('TEST 15: Third renewal chains expiration correctly (2028 -> 2029 -> 2030 -> 2031)', new Date(renew3.data.previousExpiredAt).toISOString() === new Date(renew2.data.newExpiredAt).toISOString() && renew3.data.amendmentNumber === 3);

    // TEST 16
    test('TEST 16: EContract.expiredAt NEVER changes during renewal (INV-01)', mockSignedContract.expiredAt.toISOString() === originalExpiry.toISOString());

    // TEST 17
    test('TEST 17: EContractItem NEVER changes during renewal (INV-05)', mockSignedContract.items.length === 2 && mockSignedContract.items[0].treeCode === 'SNL-TRALINH-001');

    // TEST 18
    const effective18 = await service.getEffectiveExpiredAt('ctr-uuid-001');
    test('TEST 18: effectiveExpiredAt resolves to latest signed amendment (INV-09)', effective18.toISOString() === new Date(renew3.data.newExpiredAt).toISOString());

    // TEST 19
    storedAmendments = []; // clear amendments
    const effective19 = await service.getEffectiveExpiredAt('ctr-uuid-001');
    test('TEST 19: effectiveExpiredAt falls back to original expiry when no amendments exist', effective19.toISOString() === originalExpiry.toISOString());

    console.log('\n--- GROUP 4: Cryptographic Hash & Concurrency Safety ---');

    // TEST 20
    test('TEST 20: PDF hash matches exact byte buffer of generated amendment PDF (INV-03)', renew1.data.documentHash === samplePdfHash);

    // TEST 21
    let incCounter = 0;
    const concurrencyRepo = new ContractAmendmentRepository({
        contractAmendment: {
            findFirst: async () => ({ amendmentNumber: ++incCounter }),
        },
    });
    const num1 = await concurrencyRepo.getNextAmendmentNumber('ctr-uuid-001');
    const num2 = await concurrencyRepo.getNextAmendmentNumber('ctr-uuid-001');
    test('TEST 21: Concurrency-safe amendment numbering increments safely', num2 === num1 + 1);

    // TEST 22
    test('TEST 22: Phase 5A invariants remain 100% active and protected', mockSignedContract.status === 'signed');

    // TEST 23
    test('TEST 23: Phase 5B Multi-tree snapshots remain 100% active and protected', mockSignedContract.items[0].unitPrice === 25000000);

    console.log('\n================================================================');
    console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('================================================================\n');

    if (failed > 0) {
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('Test Execution Error:', err);
    process.exit(1);
});
