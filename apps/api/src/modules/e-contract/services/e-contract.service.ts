import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { IEContractService } from '@modules/e-contract/interfaces/e-contract.service.interface';
import { EContractRepository } from '@modules/e-contract/repositories/e-contract.repository';
import { ContractAmendmentRepository } from '@modules/e-contract/repositories/contract-amendment.repository';
import { EContractPdfService } from '@modules/e-contract/services/e-contract.pdf.service';
import { EContract, EnumActivityLogAction, Prisma } from '@generated/prisma-client';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';
import { EContractCreateRequestDto } from '@modules/e-contract/dtos/request/e-contract.create.request.dto';
import { EContractSignRequestDto } from '@modules/e-contract/dtos/request/e-contract.sign.request.dto';
import { EContractRenewRequestDto } from '@modules/e-contract/dtos/request/e-contract.renew.request.dto';
import { EContractUpdateRequestDto } from '@modules/e-contract/dtos/request/e-contract.update.request.dto';
import { ContractAmendmentCreateRequestDto } from '@modules/e-contract/dtos/request/contract-amendment.create.request.dto';
import { ContractAmendmentSignRequestDto } from '@modules/e-contract/dtos/request/contract-amendment.sign.request.dto';
import { DatabaseService } from '@common/database/services/database.service';
import { NotificationSmtpService } from '@modules/notification/services/notification.smtp.service';
import { EnumNotificationProcess } from '@modules/notification/enums/notification.enum';
import { ConfigService } from '@nestjs/config';
import { FileService } from '@common/file/services/file.service';
import { EContractTemplateService } from '@modules/e-contract/services/e-contract.template.service';

export interface IPublicContractVerification {
    isValid: boolean;
    contractCode: string;
    contractTitle: string;
    status: string;
    partyA: string;
    partyB: string;
    maskedCustomerName: string;
    maskedIdentity?: string;
    isEkycVerified: boolean;
    treeCode?: string;
    contractValue: number;
    signedAt?: string;
    expiredAt: string;
    effectiveExpiredAt?: string;
    documentHash?: string;
    qrUrl?: string;
    pdfDownloadUrl: string;
}

@Injectable()
export class EContractService implements IEContractService {
    private readonly logger = new Logger(EContractService.name);

    constructor(
        private readonly eContractRepository: EContractRepository,
        private readonly contractAmendmentRepository: ContractAmendmentRepository,
        private readonly eContractPdfService: EContractPdfService,
        private readonly eContractTemplateService: EContractTemplateService,
        private readonly databaseService: DatabaseService,
        private readonly notificationSmtpService: NotificationSmtpService,
        private readonly configService: ConfigService,
        private readonly fileService: FileService
    ) {}

    private interpolateTemplate(templateHtml: string, data: any): string {
        const meta = (data.metadata || {}) as any;
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        const expDate = data.expiredAt ? new Date(data.expiredAt) : new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000);
        const expDateStr = `${expDate.getDate().toString().padStart(2, '0')}/${(expDate.getMonth() + 1).toString().padStart(2, '0')}/${expDate.getFullYear()}`;

        const cName = meta.customerName || data.partyB || 'Quý Khách Hàng';
        const cCccd = meta.customerCccd || '079090001234';
        const cAddress = meta.customerAddress || 'Xã Trà Linh, Huyện Nam Trà My, Tỉnh Quảng Nam';
        const cPhone = meta.customerPhone || '090xxxxxxx';
        const cEmail = meta.customerEmail || 'contact@khachhang.vn';
        const cVal = Number(data.contractValue || 0).toLocaleString('vi-VN');
        const cFee = Number(meta.careFee || Math.round(Number(data.contractValue || 0) * 0.1)).toLocaleString('vi-VN');
        const cTreeQty = String(meta.treeQuantity || 1);

        let result = templateHtml
            .replace(/\{\{TEN_KHACH_HANG\}\}/g, cName)
            .replace(/\{\{CCCD_MST\}\}/g, cCccd)
            .replace(/\{\{DIA_CHI\}\}/g, cAddress)
            .replace(/\{\{SO_DIEN_THOAI\}\}/g, cPhone)
            .replace(/\{\{EMAIL\}\}/g, cEmail)
            .replace(/\{\{MA_HOP_DONG\}\}/g, data.contractCode || 'HĐ-SNL/2026/01')
            .replace(/\{\{TONG_GIA_TRI\}\}/g, cVal)
            .replace(/\{\{TONG_GIA_TRI_CHU\}\}/g, `${cVal} VNĐ`)
            .replace(/\{\{PHI_CHAM_SOC\}\}/g, cFee)
            .replace(/\{\{PHI_CHAM_SOC_CHU\}\}/g, `${cFee} VNĐ`)
            .replace(/\{\{SO_LUONG_CAY\}\}/g, cTreeQty)
            .replace(/\{\{SO_LUONG_CAY_CHU\}\}/g, `${cTreeQty} cây`)
            .replace(/\{\{NGAY_KY\}\}/g, todayStr)
            .replace(/\{\{NGAY_HET_HAN\}\}/g, expDateStr);

        // Dynamic extra custom fields
        if (meta.customFields && typeof meta.customFields === 'object') {
            for (const [key, val] of Object.entries(meta.customFields)) {
                if (val !== undefined && val !== null) {
                    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                    result = result.replace(regex, String(val));
                }
            }
        }

        return result;
    }

    async createContract(payload: EContractCreateRequestDto): Promise<IResponseReturn<EContract>> {
        const year = new Date().getFullYear();
        const generatedCode = await this.eContractRepository.generateNextCode(year);

        let finalContent = payload.content;
        const meta = (payload.metadata || {}) as any;
        const templateSlug = meta.templateSlug || 'hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh';

        if (!finalContent || (!finalContent.includes('<!DOCTYPE') && !finalContent.includes('<html'))) {
            try {
                const template = await this.eContractTemplateService.getTemplate(templateSlug);
                if (template?.contentHtml) {
                    finalContent = this.interpolateTemplate(template.contentHtml, {
                        ...payload,
                        contractCode: generatedCode,
                    });
                }
            } catch (err: any) {
                this.logger.warn(`Could not interpolate template ${templateSlug}: ${err?.message}`);
            }
        }

        const contract = await this.eContractRepository.createContract({
            ...payload,
            code: generatedCode,
            content: finalContent || payload.title,
            expiredAt: payload.expiredAt || new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000).toISOString(),
        } as any);

        await this.logActivity(
            payload.userId,
            EnumActivityLogAction.contractCreated,
            `Hợp đồng điện tử ${contract.code} đã được tạo mới`,
            { contractId: contract.id, code: contract.code, value: contract.contractValue }
        );

        return {
            data: contract,
        };
    }

    async getContract(id: string, userId?: string): Promise<IResponseReturn<any>> {
        const contract = await this.eContractRepository.getContractById(id);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (userId && contract.userId !== userId) {
            throw new ForbiddenException('You do not have access to this contract');
        }

        const latestSigned = (contract.amendments || []).slice().reverse().find((a: any) => a.status === 'signed');
        const effectiveExpiredAt = latestSigned ? latestSigned.newExpiredAt : contract.expiredAt;

        return {
            data: {
                ...contract,
                effectiveExpiredAt,
            },
        };
    }

    async listContracts(userId?: string): Promise<IResponseReturn<EContract[]>> {
        const contracts = await this.eContractRepository.listContracts(userId);
        return {
            data: contracts,
        };
    }

    async listContractsPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.EContractSelect,
            Prisma.EContractWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<EContract>> {
        return this.eContractRepository.listContractsPaginated(pagination, status);
    }

    async signContract(
        id: string,
        userId: string,
        payload: EContractSignRequestDto,
        clientIp?: string
    ): Promise<IResponseReturn<EContract>> {
        const contract = await this.eContractRepository.getContractById(id);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.userId !== userId) {
            throw new ForbiddenException('You do not own this contract');
        }

        // Domain Invariant: Idempotency & State Checking
        if (contract.status === 'signed') {
            throw new BadRequestException('Hợp đồng này đã được ký kết trước đó.');
        }

        if (contract.status !== 'pending') {
            throw new BadRequestException(`Không thể ký hợp đồng ở trạng thái "${contract.status}".`);
        }

        // Fetch User profile to bind eKYC information
        const userAcc = await this.databaseService.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                isVerified: true,
                mobileNumbers: {
                    select: { number: true },
                    take: 1,
                },
            },
        });

        const ekycApproved = Boolean(userAcc?.isVerified);
        const userPhone = userAcc?.mobileNumbers?.[0]?.number || undefined;
        const customerName = userAcc?.name || contract.partyB || 'Khách hàng';
        const signatureUrl = payload.signatureData;

        // Generate Signed PDF with Digital Seal & QR Code ONCE
        const signedAtIso = new Date().toISOString();
        const pdfResult = await this.eContractPdfService.generateSignedContractPdf({
            contractCode: contract.code,
            contractTitle: contract.title ?? undefined,
            partyA: contract.partyA ?? 'CONG TY CO PHAN SAM NGOC LINH',
            partyB: contract.partyB ?? customerName,
            customerName,
            customerEmail: userAcc?.email ?? undefined,
            customerPhone: userPhone,
            customerIdentity: ekycApproved ? 'Da xac thuc eKYC' : undefined,
            treeCode: contract.treeCode ?? undefined,
            contractValue: contract.contractValue,
            content: contract.content ?? undefined,
            terms: contract.terms ?? undefined,
            signedAt: signedAtIso,
            expiredAt: contract.expiredAt instanceof Date ? contract.expiredAt.toISOString() : new Date(contract.expiredAt).toISOString(),
            signatureDataUrl: signatureUrl,
            clientIp: clientIp || '127.0.0.1',
            items: (contract as any).items?.map((it: any) => ({
                treeCode: it.treeCode,
                treeName: it.treeName,
                ageYearAtSign: it.ageYearAtSign,
                gardenCode: it.gardenCode,
                bedCode: it.bedCode,
                unitPrice: it.unitPrice,
            })),
        });

        const exactBuffer = pdfResult.pdfBuffer;
        // Strict SHA-256 calculation directly from the exact bytes being uploaded
        const documentHash = crypto.createHash('sha256').update(exactBuffer).digest('hex');

        // Upload exact buffer to immutable storage (Cloudinary / Local storage)
        let storedPdfUrl: string;
        try {
            storedPdfUrl = await this.fileService.uploadBuffer(
                exactBuffer,
                'contracts',
                `Hop-Dong-${contract.code}.pdf`
            );
        } catch (uploadErr) {
            this.logger.error(`Failed to store immutable signed PDF for contract ${contract.code}:`, uploadErr);
            throw new InternalServerErrorException(
                'Lỗi lưu trữ tệp PDF hợp đồng bất biến. Trạng thái hợp đồng chưa được thay đổi.'
            );
        }

        if (!storedPdfUrl) {
            throw new InternalServerErrorException(
                'Lỗi lưu trữ tệp PDF hợp đồng bất biến. Trạng thái hợp đồng chưa được thay đổi.'
            );
        }

        const updatedMetadata = {
            ...((contract.metadata ?? {}) as Record<string, unknown>),
            signedIp: clientIp || '127.0.0.1',
            otpVerified: Boolean(payload.otpCode),
            ekycVerified: ekycApproved,
            documentHash,
            qrUrl: pdfResult.qrUrl,
            signedAt: signedAtIso,
        };

        const signed = await this.eContractRepository.signContract(
            id,
            signatureUrl,
            storedPdfUrl,
            updatedMetadata
        );

        // Send Contract Signed Email Notification asynchronously (non-blocking for signing state)
        try {
            if (userAcc?.email && this.notificationSmtpService?.isInitialized()) {
                const webUrl = this.configService.get<string>('HOME_URL') || 'http://localhost:3002';
                const sender = this.configService.get<string>('smtp.from') || 'noreply@samngoclinh.vn';
                const customerName = userAcc?.name || contract.partyB || 'Quý khách';
                await this.notificationSmtpService.send({
                    templateName: EnumNotificationProcess.contractSigned,
                    sender,
                    templateData: {
                        customerName,
                        contractNumber: contract.code,
                        contractCode: contract.code,
                        signedAt: new Date().toLocaleString('vi-VN'),
                        signedIp: clientIp || '127.0.0.1',
                        expiredAt: new Date(contract.expiredAt).toLocaleDateString('vi-VN'),
                        contractUrl: `${webUrl}/vi/trace/contract/${contract.code}`,
                        viewContractUrl: `${webUrl}/vi/trace/contract/${contract.code}`,
                    },
                    recipients: [userAcc.email],
                });
            }
        } catch (emailErr) {
            this.logger.error('Failed to send contract signed email:', emailErr);
        }

        await this.logActivity(
            userId,
            EnumActivityLogAction.contractSigned,
            `Khách hàng đã ký số thành công hợp đồng ${contract.code}`,
            { contractId: contract.id, code: contract.code, documentHash, signedIp: clientIp }
        );

        return {
            data: signed,
        };
    }

    async getContractPdfBuffer(code: string): Promise<{ buffer: Buffer; fileName: string }> {
        const contract = await this.eContractRepository.getContractByCode(code);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        // Domain Invariant: For SIGNED contracts, try to load stored immutable artifact first
        if (contract.status === 'signed' && contract.pdfUrl) {
            // Case 1: Remote URL (Cloudinary / S3)
            if (contract.pdfUrl.startsWith('http://') || contract.pdfUrl.startsWith('https://')) {
                try {
                    const response = await fetch(contract.pdfUrl);
                    if (response.ok) {
                        const arrayBuffer = await response.arrayBuffer();
                        return {
                            buffer: Buffer.from(arrayBuffer),
                            fileName: `Hop-Dong-${contract.code}.pdf`,
                        };
                    }
                } catch (fetchErr) {
                    this.logger.warn(`Failed to fetch stored remote PDF for contract ${contract.code}, will regenerate dynamically:`, fetchErr);
                }
            } else {
                // Case 2: Local storage path (/uploads/contracts/...)
                const localKey = contract.pdfUrl.replace(/^\/?uploads\//, '');
                try {
                    const buffer = this.fileService.readLocalByKey(localKey);
                    return {
                        buffer,
                        fileName: `Hop-Dong-${contract.code}.pdf`,
                    };
                } catch {
                    const directPath = path.join(
                        process.cwd(),
                        contract.pdfUrl.startsWith('/') ? contract.pdfUrl.slice(1) : contract.pdfUrl
                    );
                    if (fs.existsSync(directPath)) {
                        const buffer = fs.readFileSync(directPath);
                        return {
                            buffer,
                            fileName: `Hop-Dong-${contract.code}.pdf`,
                        };
                    }
                }
            }
        }

        // Case 3: Dynamic high-fidelity PDF Generation from contract data
        const userAcc = await this.databaseService.user.findUnique({
            where: { id: contract.userId },
            select: {
                name: true,
                email: true,
                isVerified: true,
                mobileNumbers: {
                    select: { number: true },
                    take: 1,
                },
            },
        });

        const ekycApproved = Boolean(userAcc?.isVerified);
        const userPhone = userAcc?.mobileNumbers?.[0]?.number || undefined;
        const customerName = userAcc?.name || contract.partyB || 'Khách hàng';

        const pdfResult = await this.eContractPdfService.generateSignedContractPdf({
            contractCode: contract.code,
            contractTitle: contract.title ?? undefined,
            partyA: contract.partyA ?? 'CONG TY CO PHAN SAM NGOC LINH',
            partyB: contract.partyB ?? customerName,
            customerName,
            customerEmail: userAcc?.email ?? undefined,
            customerPhone: userPhone,
            customerIdentity: ekycApproved ? 'Da xac thuc eKYC' : undefined,
            treeCode: contract.treeCode ?? undefined,
            contractValue: contract.contractValue,
            content: contract.content ?? undefined,
            terms: contract.terms ?? undefined,
            signedAt: (contract.signedAt ? (contract.signedAt instanceof Date ? contract.signedAt : new Date(contract.signedAt)) : (contract.createdAt instanceof Date ? contract.createdAt : new Date(contract.createdAt))).toISOString(),
            expiredAt: contract.expiredAt instanceof Date ? contract.expiredAt.toISOString() : new Date(contract.expiredAt).toISOString(),
            signatureDataUrl: contract.signatureUrl ?? undefined,
            clientIp: ((contract.metadata as Record<string, unknown>)?.signedIp as string) || '127.0.0.1',
        });

        return {
            buffer: pdfResult.pdfBuffer,
            fileName: `Hop-Dong-${contract.code}.pdf`,
        };
    }

    async verifyContractByCode(code: string): Promise<IResponseReturn<IPublicContractVerification>> {
        const contract = await this.eContractRepository.getContractByCode(code);
        if (!contract) {
            throw new NotFoundException('Không tìm thấy hợp đồng với mã định danh này');
        }

        const meta = (contract.metadata ?? {}) as Record<string, unknown>;
        const userAcc = await this.databaseService.user.findUnique({
            where: { id: contract.userId },
            select: { name: true, isVerified: true },
        });

        const rawName = userAcc?.name || contract.partyB || 'Khách hàng';
        const nameParts = rawName.trim().split(' ');
        const maskedName =
            nameParts.length > 2
                ? `${nameParts[0]} *** ${nameParts[nameParts.length - 1]}`
                : nameParts.length === 2
                ? `${nameParts[0]} ***`
                : rawName;

        const isSigned = contract.status === 'signed';
        const latestSigned = (contract.amendments || []).slice().reverse().find((a: any) => a.status === 'signed');
        const effectiveExpiredAt = latestSigned ? latestSigned.newExpiredAt : contract.expiredAt;

        const verificationData: IPublicContractVerification = {
            isValid: isSigned,
            contractCode: contract.code,
            contractTitle: contract.title,
            status: contract.status,
            partyA: contract.partyA || 'Công ty Cổ phần Sâm Ngọc Linh',
            partyB: contract.partyB || 'Nhà đầu tư sở hữu',
            maskedCustomerName: maskedName,
            isEkycVerified: Boolean(meta.ekycVerified ?? userAcc?.isVerified),
            treeCode: contract.treeCode ?? undefined,
            contractValue: contract.contractValue,
            signedAt: contract.signedAt ? (contract.signedAt instanceof Date ? contract.signedAt.toISOString() : new Date(contract.signedAt).toISOString()) : undefined,
            expiredAt: contract.expiredAt instanceof Date ? contract.expiredAt.toISOString() : new Date(contract.expiredAt).toISOString(),
            effectiveExpiredAt: effectiveExpiredAt instanceof Date ? effectiveExpiredAt.toISOString() : new Date(effectiveExpiredAt).toISOString(),
            documentHash: (meta.documentHash as string) || undefined,
            qrUrl: (meta.qrUrl as string) || undefined,
            pdfDownloadUrl: `/api/public/contracts/${contract.code}/pdf`,
        };

        return {
            data: verificationData,
        };
    }

    /**
     * Domain Invariant INV-09: effectiveExpiredAt is derived from latest signed amendment
     */
    async getEffectiveExpiredAt(contractId: string): Promise<Date> {
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

    /**
     * Phase 5C Renewal Domain Service:
     * - Never updates EContract.expiredAt (INV-01)
     * - Creates and optionally signs a ContractAmendment
     * - Derives effective expiration via INV-09
     */
    async renewContract(
        id: string,
        userId: string,
        payload: EContractRenewRequestDto,
        clientIp?: string
    ): Promise<IResponseReturn<any>> {
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

        // 3. Concurrency-safe amendment numbering & code (Phase 5C.5)
        const amendmentNumber = await this.contractAmendmentRepository.getNextAmendmentNumber(contract.id);
        const codeSuffix = amendmentNumber.toString().padStart(2, '0');
        const amendmentCode = `AMD-CTR-${contract.code.replace(/^CTR-/, '')}-${codeSuffix}`;
        const title = `Phụ lục Gia hạn Dịch vụ Chăm sóc số ${codeSuffix}`;
        const content = `Gia hạn thời gian ủy quyền chăm sóc & bảo vệ cây sâm thêm ${payload.months} tháng đối với Hợp đồng số ${contract.code}.`;
        const amendmentValue = payload.amendmentValue ?? 0;

        // 4. Check if signature is provided for immediate signing
        if (payload.signatureData) {
            const userAcc = await this.databaseService.user.findUnique({
                where: { id: userId },
                include: { mobileNumbers: true },
            });
            const userPhone = userAcc?.mobileNumbers?.[0]?.number || undefined;

            const items = (contract.items || []).map((item: any) => ({
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
                customerPhone: userPhone,
                customerIdentity: undefined,
                previousExpiredAt: previousExpiredAt.toISOString(),
                newExpiredAt: newExpiredAt.toISOString(),
                extendedMonths: payload.months,
                amendmentValue,
                signedAt: signedAtDate.toISOString(),
                signatureDataUrl: payload.signatureData,
                clientIp,
                items,
            });

            let storedPdfUrl = `/uploads/contracts/${contract.code}/${amendmentCode}.pdf`;
            try {
                storedPdfUrl = await this.fileService.uploadBuffer(
                    pdfResult.pdfBuffer,
                    'contracts',
                    `${amendmentCode}.pdf`
                );
            } catch {
                const uploadDir = path.join(process.cwd(), 'uploads', 'contracts', contract.code);
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                fs.writeFileSync(path.join(uploadDir, `${amendmentCode}.pdf`), pdfResult.pdfBuffer);
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
                    signatureUrl: payload.signatureData.startsWith('http') ? payload.signatureData : 'data:image/png;base64,...',
                    pdfUrl: storedPdfUrl,
                    documentHash: pdfResult.documentHash,
                },
            });

            const refreshed = await this.contractAmendmentRepository.findById(amendment.id);

            await this.logActivity(
                userId,
                EnumActivityLogAction.contractRenewed,
                `Khách hàng đã gia hạn thành công hợp đồng ${contract.code} qua phụ lục ${amendmentCode}`,
                { contractId: contract.id, code: contract.code, amendmentCode, newExpiredAt }
            );

            return {
                data: refreshed,
            };
        }

        // Pending amendment
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

        return {
            data: amendment,
        };
    }

    async createAmendment(
        contractId: string,
        payload: ContractAmendmentCreateRequestDto,
        userId?: string,
        clientIp?: string
    ): Promise<IResponseReturn<any>> {
        const contract = await this.eContractRepository.getContractById(contractId);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (userId && contract.userId !== userId) {
            throw new ForbiddenException('You do not own this contract');
        }

        if (contract.status !== 'signed') {
            throw new BadRequestException('Chỉ có thể tạo phụ lục cho hợp đồng đã ký kết.');
        }

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
            metadata: {
                createdIp: clientIp || '127.0.0.1',
            },
        });

        return {
            data: amendment,
        };
    }

    async signAmendment(
        amendmentId: string,
        userId: string,
        payload: ContractAmendmentSignRequestDto,
        clientIp?: string
    ): Promise<IResponseReturn<any>> {
        const amendment = await this.contractAmendmentRepository.findById(amendmentId);
        if (!amendment) {
            throw new NotFoundException('Contract amendment not found');
        }

        const contract = await this.eContractRepository.getContractById(amendment.contractId);
        if (!contract) {
            throw new NotFoundException('Parent contract not found');
        }

        if (contract.userId !== userId) {
            throw new ForbiddenException('You do not own this contract amendment');
        }

        if (amendment.status === 'signed') {
            throw new BadRequestException('Phụ lục này đã được ký kết trước đó.');
        }

        if (amendment.status !== 'pending') {
            throw new BadRequestException(`Không thể ký phụ lục ở trạng thái "${amendment.status}".`);
        }

        const userAcc = await this.databaseService.user.findUnique({
            where: { id: userId },
            include: { mobileNumbers: true },
        });
        const userPhone = userAcc?.mobileNumbers?.[0]?.number || undefined;

        const items = (contract.items || []).map((item: any) => ({
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
            amendmentCode: amendment.code,
            amendmentNumber: amendment.amendmentNumber,
            title: amendment.title,
            partyA: contract.partyA,
            partyB: contract.partyB || userAcc?.name || undefined,
            customerName: userAcc?.name || contract.partyB || undefined,
            customerEmail: userAcc?.email || undefined,
            customerPhone: userPhone,
            customerIdentity: undefined,
            previousExpiredAt: amendment.previousExpiredAt.toISOString(),
            newExpiredAt: amendment.newExpiredAt.toISOString(),
            extendedMonths: amendment.extendedMonths,
            amendmentValue: amendment.amendmentValue,
            signedAt: signedAtDate.toISOString(),
            signatureDataUrl: payload.signatureData,
            clientIp,
            items,
        });

        let storedPdfUrl = `/uploads/contracts/${contract.code}/${amendment.code}.pdf`;
        try {
            storedPdfUrl = await this.fileService.uploadBuffer(
                pdfResult.pdfBuffer,
                'contracts',
                `${amendment.code}.pdf`
            );
        } catch {
            const uploadDir = path.join(process.cwd(), 'uploads', 'contracts', contract.code);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            fs.writeFileSync(path.join(uploadDir, `${amendment.code}.pdf`), pdfResult.pdfBuffer);
        }

        await this.databaseService.contractAmendment.update({
            where: { id: amendment.id },
            data: {
                status: 'signed',
                signedAt: signedAtDate,
                signatureUrl: payload.signatureData.startsWith('http') ? payload.signatureData : 'data:image/png;base64,...',
                pdfUrl: storedPdfUrl,
                documentHash: pdfResult.documentHash,
                metadata: {
                    ...((amendment.metadata ?? {}) as Record<string, unknown>),
                    signedAt: signedAtDate.toISOString(),
                    clientIp: clientIp || '127.0.0.1',
                    otpVerified: Boolean(payload.otpCode),
                    documentHash: pdfResult.documentHash,
                    qrUrl: pdfResult.qrUrl,
                } as Prisma.InputJsonValue,
            },
        });

        const refreshed = await this.contractAmendmentRepository.findById(amendment.id);
        return {
            data: refreshed,
        };
    }

    async cancelAmendment(amendmentId: string, userId: string): Promise<IResponseReturn<any>> {
        const amendment = await this.contractAmendmentRepository.findById(amendmentId);
        if (!amendment) {
            throw new NotFoundException('Contract amendment not found');
        }

        const contract = await this.eContractRepository.getContractById(amendment.contractId);
        if (!contract || contract.userId !== userId) {
            throw new ForbiddenException('You do not own this contract amendment');
        }

        const cancelled = await this.contractAmendmentRepository.cancelPending(amendmentId);
        return {
            data: cancelled,
        };
    }

    async getAmendmentsByContractId(contractId: string): Promise<IResponseReturn<any>> {
        const amendments = await this.contractAmendmentRepository.findByContractId(contractId);
        return {
            data: amendments,
        };
    }

    async getAmendmentPdfBuffer(_contractCode: string, amendmentCode: string): Promise<{ buffer: Buffer; fileName: string }> {
        const amendment = await this.contractAmendmentRepository.findByCode(amendmentCode);
        if (!amendment) {
            throw new NotFoundException('Contract amendment not found');
        }

        if (amendment.status !== 'signed' || !amendment.pdfUrl) {
            throw new BadRequestException('Signed amendment PDF is not available yet.');
        }

        if (amendment.pdfUrl.startsWith('http://') || amendment.pdfUrl.startsWith('https://')) {
            const response = await fetch(amendment.pdfUrl);
            if (!response.ok) {
                throw new InternalServerErrorException('Không thể tải tệp PDF phụ lục từ kho lưu trữ.');
            }
            const arrayBuffer = await response.arrayBuffer();
            return {
                buffer: Buffer.from(arrayBuffer),
                fileName: `Phu-Luc-${amendment.code}.pdf`,
            };
        }

        const localKey = amendment.pdfUrl.replace(/^\/?uploads\//, '');
        try {
            const buffer = this.fileService.readLocalByKey(localKey);
            return {
                buffer,
                fileName: `Phu-Luc-${amendment.code}.pdf`,
            };
        } catch {
            const fallbackPath = path.join(process.cwd(), 'uploads', localKey);
            if (fs.existsSync(fallbackPath)) {
                return {
                    buffer: fs.readFileSync(fallbackPath),
                    fileName: `Phu-Luc-${amendment.code}.pdf`,
                };
            }
            throw new NotFoundException('Không tìm thấy tệp PDF phụ lục trên máy chủ.');
        }
    }

    /**
     * Domain Invariant INV-01: SIGNED contract is immutable and cannot be modified.
     */
    async updateContract(id: string, payload: EContractUpdateRequestDto): Promise<IResponseReturn<EContract>> {
        const existing = await this.eContractRepository.getContractById(id);
        if (!existing) {
            throw new NotFoundException('Contract not found');
        }

        if (existing.status === 'signed') {
            throw new BadRequestException('Signed contract is immutable and cannot be modified.');
        }

        const mergedMetadata = {
            ...((existing.metadata as Record<string, unknown>) || {}),
            ...(payload.metadata || {}),
        };

        const updated = await this.eContractRepository.updateContract(id, {
            ...payload,
            metadata: mergedMetadata,
        });
        return {
            data: updated,
        };
    }

    /**
     * Domain Invariant INV-02: SIGNED contract cannot be deleted.
     */
    async deleteContract(id: string): Promise<IResponseReturn<{ success: boolean }>> {
        const existing = await this.eContractRepository.getContractById(id);
        if (!existing) {
            throw new NotFoundException('Contract not found');
        }

        if (existing.status === 'signed') {
            throw new BadRequestException('Signed contract cannot be deleted.');
        }

        await this.eContractRepository.deleteContract(id);

        await this.logActivity(
            existing.userId,
            EnumActivityLogAction.contractCancelled,
            `Hợp đồng ${existing.code} chưa ký đã bị hủy/xóa`,
            { contractId: existing.id, code: existing.code }
        );

        return {
            data: { success: true },
        };
    }

    async checkExpiringContracts(): Promise<IResponseReturn<{ count: number; notified: string[] }>> {
        const expiring = await this.eContractRepository.getExpiringContracts(30);
        const notified: string[] = [];
        const webUrl = this.configService.get<string>('HOME_URL') || 'http://localhost:3002';
        const sender = this.configService.get<string>('smtp.from') || 'noreply@samngoclinh.vn';

        for (const contract of expiring) {
            const latestAmendment = contract.amendments?.[0];
            const effectiveExpiry = latestAmendment ? new Date(latestAmendment.newExpiredAt) : new Date(contract.expiredAt);
            const userEmail = contract.user?.email || (contract.metadata as any)?.customerEmail;
            const customerName = contract.user?.name || contract.partyB || 'Quý khách';

            if (userEmail && this.notificationSmtpService?.isInitialized() && !contract.isReminderSent) {
                try {
                    const contractMeta = (contract.metadata || {}) as any;
                    const treeCount = contractMeta.treeQuantity || ((contract as any).items as any[])?.length || 1;
                    const gardenName = contractMeta.gardenName || 'Vườn bảo tồn Nam Trà My, Kon Tum';
                    const createdAtStr = new Date(contract.createdAt).toLocaleDateString('vi-VN');

                    await this.notificationSmtpService.send({
                        templateName: EnumNotificationProcess.contractCreated,
                        sender,
                        templateData: {
                            customerName,
                            contractNumber: contract.code,
                            contractCode: contract.code,
                            partyA: contract.partyA || 'Công ty Cổ phần Sâm Ngọc Linh',
                            partyB: contract.partyB || customerName,
                            treeCount,
                            gardenName,
                            createdAt: createdAtStr,
                            contractValue: Number(contract.contractValue || 0).toLocaleString('vi-VN') + ' VNĐ',
                            expiredAt: effectiveExpiry.toLocaleDateString('vi-VN'),
                            signUrl: `${webUrl}/vi/profile?tabs=contracts`,
                            signContractUrl: `${webUrl}/vi/profile?tabs=contracts`,
                        },
                        recipients: [userEmail],
                    });
                } catch (emailErr: any) {
                    this.logger.error(`Failed to send expiration reminder for contract ${contract.code}: ${emailErr?.message}`);
                }
            }

            if (!contract.isReminderSent) {
                await this.databaseService.eContract.update({
                    where: { id: contract.id },
                    data: {
                        isReminderSent: true,
                        reminderSentAt: new Date(),
                    },
                });
                notified.push(contract.code);
            }
        }

        return {
            data: {
                count: notified.length,
                notified,
            },
        };
    }

    async issueContract(id: string): Promise<IResponseReturn<EContract>> {
        const contract = await this.eContractRepository.getContractById(id);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.status === 'signed') {
            throw new BadRequestException('Hợp đồng đã được ký kết.');
        }

        const updated = await this.eContractRepository.updateStatus(id, 'pending');

        await this.logActivity(
            contract.userId,
            EnumActivityLogAction.contractCreated,
            `Hợp đồng điện tử ${contract.code} đã được Ban Quản Trị phát hành và gửi cho khách hàng ký số`,
            { contractId: contract.id, code: contract.code }
        );

        const webUrl = this.configService.get<string>('HOME_URL') || 'http://localhost:3002';
        const sender = this.configService.get<string>('smtp.from') || 'noreply@samngoclinh.vn';

        const userAcc = await this.databaseService.user.findUnique({
            where: { id: contract.userId },
            select: { email: true, name: true },
        });
        const userEmail = userAcc?.email || (contract.metadata as any)?.customerEmail;
        const customerName = userAcc?.name || contract.partyB || 'Quý khách';

        if (userEmail && this.notificationSmtpService?.isInitialized()) {
            try {
                const contractMeta = (contract.metadata || {}) as any;
                const treeCount = contractMeta.treeQuantity || ((contract as any).items as any[])?.length || 1;
                const gardenName = contractMeta.gardenName || 'Vườn bảo tồn Nam Trà My, Kon Tum';
                const createdAtStr = new Date(contract.createdAt).toLocaleDateString('vi-VN');

                await this.notificationSmtpService.send({
                    templateName: EnumNotificationProcess.contractCreated,
                    sender,
                    templateData: {
                        customerName,
                        contractNumber: contract.code,
                        contractCode: contract.code,
                        partyA: contract.partyA || 'Công ty Cổ phần Sâm Ngọc Linh',
                        partyB: contract.partyB || customerName,
                        treeCount,
                        gardenName,
                        createdAt: createdAtStr,
                        contractValue: Number(contract.contractValue || 0).toLocaleString('vi-VN') + ' VNĐ',
                        expiredAt: new Date(contract.expiredAt).toLocaleDateString('vi-VN'),
                        signUrl: `${webUrl}/vi/profile?tabs=contracts`,
                        signContractUrl: `${webUrl}/vi/profile?tabs=contracts`,
                    },
                    recipients: [userEmail],
                });
            } catch (emailErr: any) {
                this.logger.error(`Failed to send contract issue email for ${contract.code}: ${emailErr?.message}`);
            }
        }

        return {
            data: updated,
        };
    }

    private async logActivity(
        userId: string,
        action: EnumActivityLogAction,
        description: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        try {
            await this.databaseService.activityLog.create({
                data: {
                    userId,
                    action,
                    description,
                    userAgent: {},
                    metadata: metadata ? (metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
                    createdBy: userId,
                },
            });
        } catch (err: any) {
            this.logger.warn(`Could not record ActivityLog for ${action}: ${err?.message}`);
        }
    }
}
