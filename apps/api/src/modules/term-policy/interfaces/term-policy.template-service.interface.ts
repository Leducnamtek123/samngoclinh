import { ILocalStorage } from '@common/file/interfaces/file.interface';

export interface ITermPolicyTemplateService {
    importTermsOfService(): Promise<ILocalStorage | null>;
    importPrivacy(): Promise<ILocalStorage | null>;
    importCookie(): Promise<ILocalStorage | null>;
    importMarketing(): Promise<ILocalStorage | null>;
}
