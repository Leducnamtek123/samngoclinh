import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { IEContractService } from '@modules/e-contract/interfaces/e-contract.service.interface';
import { EContractRepository } from '@modules/e-contract/repositories/e-contract.repository';
import { EContractPdfService } from '@modules/e-contract/services/e-contract.pdf.service';
import { EContract, Prisma } from '@generated/prisma-client';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';
import { EContractCreateRequestDto } from '@modules/e-contract/dtos/request/e-contract.create.request.dto';
import { EContractSignRequestDto } from '@modules/e-contract/dtos/request/e-contract.sign.request.dto';
import { EContractRenewRequestDto } from '@modules/e-contract/dtos/request/e-contract.renew.request.dto';
import { EContractUpdateRequestDto } from '@modules/e-contract/dtos/request/e-contract.update.request.dto';
import { DatabaseService } from '@common/database/services/database.service';
import { NotificationSmtpService } from '@modules/notification/services/notification.smtp.service';
import { EnumNotificationProcess } from '@modules/notification/enums/notification.enum';
import { ConfigService } from '@nestjs/config';

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
    documentHash?: string;
    qrUrl?: string;
    pdfDownloadUrl: string;
}

@Injectable()
export class EContractService implements IEContractService {
    private readonly logger = new Logger(EContractService.name);

    constructor(
        private readonly eContractRepository: EContractRepository,
        private readonly eContractPdfService: EContractPdfService,
        private readonly databaseService: DatabaseService,
        private readonly notificationSmtpService: NotificationSmtpService,
        private readonly configService: ConfigService
    ) {}

    async createContract(payload: EContractCreateRequestDto): Promise<IResponseReturn<EContract>> {
        const contract = await this.eContractRepository.createContract(payload);
        return {
            data: contract,
        };
    }

    async getContract(id: string, userId?: string): Promise<IResponseReturn<EContract>> {
        const contract = await this.eContractRepository.getContractById(id);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (userId && contract.userId !== userId) {
            throw new ForbiddenException('You do not have access to this contract');
        }

        return {
            data: contract,
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

    async signContract(id: string, userId: string, payload: EContractSignRequestDto, clientIp?: string): Promise<IResponseReturn<EContract>> {
        const contract = await this.eContractRepository.getContractById(id);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.userId !== userId) {
            throw new ForbiddenException('You do not own this contract');
        }

        if (contract.status === 'signed') {
            throw new BadRequestException('Hợp đồng này đã được ký kết trước đó.');
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

        // Generate Signed PDF with Digital Seal & QR Code
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
            expiredAt: contract.expiredAt.toISOString(),
            signatureDataUrl: signatureUrl,
            clientIp: clientIp || '127.0.0.1',
        });

        const pdfDownloadUrl = `/api/public/contracts/${contract.code}/pdf`;

        const updatedMetadata = {
            ...((contract.metadata ?? {}) as Record<string, unknown>),
            signedIp: clientIp || '127.0.0.1',
            otpVerified: Boolean(payload.otpCode),
            ekycVerified: ekycApproved,
            documentHash: pdfResult.documentHash,
            qrUrl: pdfResult.qrUrl,
            signedAt: signedAtIso,
        };

        const signed = await this.eContractRepository.signContract(
            id,
            signatureUrl,
            pdfDownloadUrl,
            updatedMetadata
        );

        // Send Contract Signed Email Notification
        try {
            if (userAcc?.email && this.notificationSmtpService?.isInitialized()) {
                const webUrl = this.configService.get<string>('HOME_URL') || 'http://localhost:3002';
                const sender = this.configService.get<string>('smtp.from') || 'noreply@wefarm.com.vn';
                await this.notificationSmtpService.send({
                    templateName: EnumNotificationProcess.contractSigned,
                    sender,
                    templateData: {
                        contractCode: contract.code,
                        signedAt: new Date().toLocaleString('vi-VN'),
                        signedIp: clientIp || '127.0.0.1',
                        expiredAt: new Date(contract.expiredAt).toLocaleDateString('vi-VN'),
                        viewContractUrl: `${webUrl}/trace/contract/${contract.code}`,
                    },
                    recipients: [userAcc.email],
                });
            }
        } catch (emailErr) {
            this.logger.error('Failed to send contract signed email:', emailErr);
        }

        return {
            data: signed,
        };
    }

    async getContractPdfBuffer(code: string): Promise<{ buffer: Buffer; fileName: string }> {
        const contract = await this.eContractRepository.getContractByCode(code);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

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
            signedAt: (contract.signedAt ?? contract.createdAt).toISOString(),
            expiredAt: contract.expiredAt.toISOString(),
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
        // Mask customer name for privacy (e.g. "Nguyễn Văn An" -> "Nguyễn *** An")
        const nameParts = rawName.trim().split(' ');
        const maskedName = nameParts.length > 2
            ? `${nameParts[0]} *** ${nameParts[nameParts.length - 1]}`
            : nameParts.length === 2
                ? `${nameParts[0]} ***`
                : rawName;

        const isSigned = contract.status === 'signed';

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
            signedAt: contract.signedAt ? contract.signedAt.toISOString() : undefined,
            expiredAt: contract.expiredAt.toISOString(),
            documentHash: (meta.documentHash as string) || undefined,
            qrUrl: (meta.qrUrl as string) || undefined,
            pdfDownloadUrl: `/api/public/contracts/${contract.code}/pdf`,
        };

        return {
            data: verificationData,
        };
    }

    async renewContract(id: string, userId: string, payload: EContractRenewRequestDto): Promise<IResponseReturn<EContract>> {
        const contract = await this.eContractRepository.getContractById(id);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.userId !== userId) {
            throw new ForbiddenException('You do not own this contract');
        }

        const currentExpiry = new Date(contract.expiredAt);
        const newExpiry = new Date(currentExpiry.setMonth(currentExpiry.getMonth() + payload.months));

        const renewed = await this.eContractRepository.renewContract(id, newExpiry, {
            ...((contract.metadata ?? {}) as Record<string, unknown>),
            renewedAt: new Date().toISOString(),
            renewMonths: payload.months,
        });

        return {
            data: renewed,
        };
    }

    async updateContract(id: string, payload: EContractUpdateRequestDto): Promise<IResponseReturn<EContract>> {
        const existing = await this.eContractRepository.getContractById(id);
        if (!existing) {
            throw new NotFoundException('Contract not found');
        }

        const updated = await this.eContractRepository.updateContract(id, payload);
        return {
            data: updated,
        };
    }

    async deleteContract(id: string): Promise<IResponseReturn<{ success: boolean }>> {
        const existing = await this.eContractRepository.getContractById(id);
        if (!existing) {
            throw new NotFoundException('Contract not found');
        }

        await this.eContractRepository.deleteContract(id);
        return {
            data: { success: true },
        };
    }

    async checkExpiringContracts(): Promise<IResponseReturn<{ count: number; notified: string[] }>> {
        const expiring = await this.eContractRepository.getExpiringContracts(7);
        const notified: string[] = [];

        for (const contract of expiring) {
            this.logger.warn(`Contract ${contract.code} for user ${contract.userId} is expiring soon at ${contract.expiredAt.toISOString()}`);
            notified.push(contract.code);
        }

        return {
            data: {
                count: expiring.length,
                notified,
            },
        };
    }
}
