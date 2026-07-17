import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { ContactRequest } from '@generated/prisma-client';

@Injectable()
export class ContactRepository {
    constructor(private readonly databaseService: DatabaseService) {}

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
}
