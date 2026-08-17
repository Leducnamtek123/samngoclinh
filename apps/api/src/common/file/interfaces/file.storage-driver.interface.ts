import { IFile, ILocalStorage } from './file.interface';

export type FileStorageDriverType = 'local' | 's3' | 'cloudinary' | 'minio' | 'gcs' | string;

export interface IFileStorageDriver {
    readonly driverType: FileStorageDriverType;
    uploadFile(file: IFile, folder?: string): Promise<string>;
    uploadBase64(base64Data: string, folder?: string): Promise<string>;
    uploadBuffer(buffer: Buffer, folder?: string, filename?: string): Promise<string>;
    saveFileToLocal(file: IFile, subdir: string): string;
    saveBase64ToLocal(base64Data: string, subdir: string): string;
    buildLocalStorage(key: string, size: number): ILocalStorage;
    saveBufferToKey(buffer: Buffer, key: string): ILocalStorage;
    readLocalByKey(key: string): Buffer;
    moveLocalToDir(items: { key: string }[], toDir: string): ILocalStorage[];
    deleteLocalDir(dir: string): void;
}
