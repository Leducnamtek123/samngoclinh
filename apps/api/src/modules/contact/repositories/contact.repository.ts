import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { ContactRequest, Prisma } from '@generated/prisma-client';
import { PaginationService } from '@common/pagination/services/pagination.service';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';
import { IResponsePagingReturn } from '@common/response/interfaces/response.interface';

@Injectable()
export class ContactRepository {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly paginationService: PaginationService
    ) {}

    async create(data: {
        fullName: string;
        email: string;
        phoneNumber: string;
        subject: string;
        message: string;
    }): Promise<ContactRequest> {
        return this.databaseService.contactRequest.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                subject: data.subject,
                message: data.message,
                isRead: false,
            },
        });
    }

    async listAll(): Promise<ContactRequest[]> {
        return this.databaseService.contactRequest.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async listPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.ContactRequestSelect,
            Prisma.ContactRequestWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<ContactRequest>> {
        const { where, ...params } = pagination;
        return this.paginationService.offset<
            ContactRequest,
            Prisma.ContactRequestSelect,
            Prisma.ContactRequestWhereInput
        >(this.databaseService.contactRequest, {
            ...params,
            where: {
                ...where,
                ...status,
            },
        });
    }

    async getDetail(id: string): Promise<ContactRequest | null> {
        return this.databaseService.contactRequest.findUnique({
            where: { id },
        });
    }

    async markAsRead(id: string): Promise<ContactRequest> {
        return this.databaseService.contactRequest.update({
            where: { id },
            data: { isRead: true },
        });
    }

    async delete(id: string): Promise<ContactRequest> {
        return this.databaseService.contactRequest.delete({
            where: { id },
        });
    }
}
