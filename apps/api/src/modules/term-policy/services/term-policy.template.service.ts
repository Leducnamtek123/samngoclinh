import { ILocalStorage } from '@common/file/interfaces/file.interface';
import { FileService } from '@common/file/services/file.service';
import { EnumFileExtensionTemplate } from '@common/file/enums/file.enum';
import { EnumMessageLanguage } from '@common/message/enums/message.enum';
import { ITermPolicyTemplateService } from '@modules/term-policy/interfaces/term-policy.template-service.interface';
import { TermPolicyUtil } from '@modules/term-policy/utils/term-policy.util';
import { Injectable, Logger } from '@nestjs/common';
import { EnumTermPolicyType } from '@generated/prisma-client';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TermPolicyTemplateService implements ITermPolicyTemplateService {
    private readonly logger = new Logger(TermPolicyTemplateService.name);

    constructor(
        private readonly termPolicyUtil: TermPolicyUtil,
        private readonly fileService: FileService
    ) {}

    private getTemplatePath(fileName: string): string {
        const candidatePaths = [
            join(__dirname, '../templates', fileName),
            join(__dirname, '../../templates', fileName),
            join(__dirname, '../../../templates', fileName),
            join(process.cwd(), 'dist/modules/term-policy/templates', fileName),
            join(process.cwd(), 'src/modules/term-policy/templates', fileName),
            join(process.cwd(), 'apps/api/dist/modules/term-policy/templates', fileName),
            join(process.cwd(), 'apps/api/src/modules/term-policy/templates', fileName),
            join(process.cwd(), 'templates', fileName),
        ];

        for (const p of candidatePaths) {
            if (existsSync(p)) {
                return p;
            }
        }

        return candidatePaths[0];
    }

    async importTermsOfService(): Promise<ILocalStorage | null> {
        try {
            const templatePath = this.getTemplatePath('term-policy.term.en.hbs');
            const templateContent = readFileSync(templatePath);
            const randomKey =
                this.termPolicyUtil.createRandomFilenameContentWithPath(
                    EnumTermPolicyType.termsOfService,
                    1,
                    EnumMessageLanguage.en,
                    {
                        extension: EnumFileExtensionTemplate.hbs,
                    }
                );

            return this.fileService.saveBufferToKey(templateContent, randomKey);
        } catch (err: unknown) {
            this.logger.error(err, 'Failed to import terms of service');

            throw err;
        }
    }

    async importPrivacy(): Promise<ILocalStorage | null> {
        try {
            const templatePath = this.getTemplatePath('term-policy.privacy.en.hbs');
            const templateContent = readFileSync(templatePath);
            const randomKey =
                this.termPolicyUtil.createRandomFilenameContentWithPath(
                    EnumTermPolicyType.privacy,
                    1,
                    EnumMessageLanguage.en,
                    {
                        extension: EnumFileExtensionTemplate.hbs,
                    }
                );

            return this.fileService.saveBufferToKey(templateContent, randomKey);
        } catch (err: unknown) {
            this.logger.error(err, 'Failed to import privacy');

            throw err;
        }
    }

    async importCookie(): Promise<ILocalStorage | null> {
        try {
            const templatePath = this.getTemplatePath('term-policy.cookies.en.hbs');
            const templateContent = readFileSync(templatePath);
            const randomKey =
                this.termPolicyUtil.createRandomFilenameContentWithPath(
                    EnumTermPolicyType.cookies,
                    1,
                    EnumMessageLanguage.en,
                    {
                        extension: EnumFileExtensionTemplate.hbs,
                    }
                );

            return this.fileService.saveBufferToKey(templateContent, randomKey);
        } catch (err: unknown) {
            this.logger.error(err, 'Failed to import cookie');

            throw err;
        }
    }

    async importMarketing(): Promise<ILocalStorage | null> {
        try {
            const templatePath = this.getTemplatePath('term-policy.marketing.en.hbs');
            const templateContent = readFileSync(templatePath);
            const randomKey =
                this.termPolicyUtil.createRandomFilenameContentWithPath(
                    EnumTermPolicyType.marketing,
                    1,
                    EnumMessageLanguage.en,
                    {
                        extension: EnumFileExtensionTemplate.hbs,
                    }
                );

            return this.fileService.saveBufferToKey(templateContent, randomKey);
        } catch (err: unknown) {
            this.logger.error(err, 'Failed to import marketing');

            throw err;
        }
    }
}
