import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactRepository } from '@modules/contact/repositories/contact.repository';
import { ContactRequest, Prisma } from '@generated/prisma-client';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';

@Injectable()
export class ContactService {
    constructor(private readonly contactRepository: ContactRepository) {}

    async create(data: {
        fullName: string;
        email: string;
        phoneNumber: string;
        subject: string;
        message: string;
    }): Promise<IResponseReturn<ContactRequest>> {
        const item = await this.contactRepository.create(data);
        return { data: item };
    }

    async adminList(): Promise<IResponseReturn<{ items: ContactRequest[] }>> {
        const items = await this.contactRepository.listAll();
        return {
            data: { items },
        };
    }

    async adminListPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.ContactRequestSelect,
            Prisma.ContactRequestWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<ContactRequest>> {
        return this.contactRepository.listPaginated(pagination, status);
    }

    async adminGetDetail(id: string): Promise<IResponseReturn<ContactRequest>> {
        const item = await this.contactRepository.getDetail(id);
        if (!item) {
            throw new NotFoundException('Contact request not found');
        }
        await this.contactRepository.markAsRead(id);
        item.isRead = true;
        return { data: item };
    }

    async adminDelete(id: string): Promise<IResponseReturn<void>> {
        const item = await this.contactRepository.getDetail(id);
        if (!item) {
            throw new NotFoundException('Contact request not found');
        }
        await this.contactRepository.delete(id);
        return { data: undefined };
    }
}
