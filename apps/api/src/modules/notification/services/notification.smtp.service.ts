import {
    INotificationEmailSend,
    INotificationEmailSendBulk,
} from '@modules/notification/interfaces/notification.smtp.interface';
import { NotificationEmailTemplate } from '@modules/notification/constants/notification.email-template.constant';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
// @ts-ignore
import * as Handlebars from 'handlebars';
// @ts-ignore
import { Transporter, createTransport } from 'nodemailer';
import { join } from 'path';

@Injectable()
export class NotificationSmtpService implements OnModuleInit {
    private readonly logger = new Logger(NotificationSmtpService.name);
    private transporter: Transporter | null = null;
    private readonly templatesDir = join(
        process.cwd(),
        'src/modules/notification/templates'
    );
    private readonly cache = new Map<string, Handlebars.TemplateDelegate>();

    constructor(private readonly configService: ConfigService) {}

    onModuleInit(): void {
        const host = this.configService.get<string | null>('smtp.host');
        if (!host) {
            this.logger.warn(
                'SMTP host not configured. Email sending is disabled.'
            );

            return;
        }

        const username = this.configService.get<string | null>('smtp.username');
        const password = this.configService.get<string | null>('smtp.password');

        this.transporter = createTransport({
            host,
            port: this.configService.get<number>('smtp.port')!,
            secure: this.configService.get<boolean>('smtp.secure')!,
            auth: username
                ? { user: username, pass: password ?? undefined }
                : undefined,
        });

        this.logger.log('SMTP transport initialized');
    }

    isInitialized(): boolean {
        return !!this.transporter;
    }

    private get from(): string | null {
        return this.configService.get<string | null>('smtp.from') ?? null;
    }

    private render(
        templateName: string,
        data?: Record<string, string>
    ): { subject: string; html: string } {
        const meta = NotificationEmailTemplate[templateName];
        if (!meta) {
            throw new Error(
                `No email template registered for "${templateName}"`
            );
        }

        let compiled = this.cache.get(templateName);
        if (!compiled) {
            const source = readFileSync(
                join(this.templatesDir, meta.file),
                'utf8'
            );
            compiled = Handlebars.compile(source);
            this.cache.set(templateName, compiled);
        }

        return { subject: meta.subject, html: compiled(data ?? {}) };
    }

    async send({
        templateName,
        templateData,
        recipients,
        sender,
        cc,
        bcc,
        replyTo,
    }: INotificationEmailSend): Promise<unknown> {
        if (!this.transporter) {
            this.logger.warn('SMTP not initialized, skipping email');

            return null;
        }

        const { subject, html } = this.render(templateName, templateData);

        return this.transporter.sendMail({
            from: this.from ?? sender,
            to: recipients,
            cc,
            bcc,
            replyTo: replyTo ?? sender,
            subject,
            html,
        });
    }

    async sendBulk({
        templateName,
        recipients,
        sender,
        defaultTemplateData,
    }: INotificationEmailSendBulk): Promise<unknown[]> {
        if (!this.transporter) {
            this.logger.warn('SMTP not initialized, skipping bulk email');

            return [];
        }

        const results: unknown[] = [];
        for (const item of recipients) {
            const { subject, html } = this.render(templateName, {
                ...defaultTemplateData,
                ...item.templateData,
            });

            results.push(
                await this.transporter.sendMail({
                    from: this.from ?? sender,
                    to: item.recipient,
                    subject,
                    html,
                })
            );
        }

        return results;
    }
}
