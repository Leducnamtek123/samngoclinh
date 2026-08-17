import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IFileService } from '@common/file/interfaces/file.service.interface';
import {
    IFile,
    IFileRandomFilenameOptions,
    ILocalStorage,
} from '@common/file/interfaces/file.interface';
import {
    IFileStorageDriver,
    FileStorageDriverType,
} from '@common/file/interfaces/file.storage-driver.interface';
import { LocalStorageDriver } from '@common/file/drivers/local.storage-driver';
import { HelperService } from '@common/helper/services/helper.service';
import Papa from 'papaparse';

@Injectable()
export class FileService implements IFileService, OnModuleInit {
    private readonly logger = new Logger(FileService.name);
    private readonly drivers = new Map<FileStorageDriverType, IFileStorageDriver>();
    private activeDriverType: FileStorageDriverType = 'local';

    private readonly mimeMap: Record<string, string> = {
        pdf: 'application/pdf',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        json: 'application/json',
        csv: 'text/csv',
        txt: 'text/plain',
    };

    constructor(
        private readonly helperService: HelperService,
        private readonly configService: ConfigService
    ) {
        // Register default built-in local driver
        const localDriver = new LocalStorageDriver(this.helperService);
        this.registerDriver(localDriver);
    }

    onModuleInit(): void {
        const configuredDriver = (
            this.configService.get<string>('file.storageDriver') ||
            this.configService.get<string>('STORAGE_DRIVER') ||
            this.configService.get<string>('FILE_STORAGE_DRIVER') ||
            'local'
        ).toLowerCase();

        this.setActiveDriver(configuredDriver);
    }

    /**
     * Đăng ký thêm trình điều khiển lưu trữ mới (ví dụ: S3, MinIO, Cloudinary, GCS).
     */
    registerDriver(driver: IFileStorageDriver): void {
        this.drivers.set(driver.driverType.toLowerCase(), driver);
        this.logger.log(`Storage Driver registered: [${driver.driverType}]`);
    }

    /**
     * Chọn trình điều khiển lưu trữ đang hoạt động.
     */
    setActiveDriver(driverType: string): void {
        const normalized = driverType.toLowerCase();
        if (this.drivers.has(normalized)) {
            this.activeDriverType = normalized;
            this.logger.log(`Active Storage Driver set to: [${this.activeDriverType}]`);
        } else {
            this.logger.warn(
                `Configured storage driver [${driverType}] is not registered. Falling back to [local].`
            );
            this.activeDriverType = 'local';
        }
    }

    /**
     * Lấy trình điều khiển lưu trữ hiện tại.
     */
    getActiveDriver(): IFileStorageDriver {
        const driver = this.drivers.get(this.activeDriverType);
        if (!driver) {
            // Fallback safety
            return this.drivers.get('local')!;
        }
        return driver;
    }

    // --- File Storage Proxy Methods ---

    async uploadFile(file: IFile, folder = 'general'): Promise<string> {
        return this.getActiveDriver().uploadFile(file, folder);
    }

    async uploadBase64(base64Data: string, folder = 'general'): Promise<string> {
        return this.getActiveDriver().uploadBase64(base64Data, folder);
    }

    async uploadBuffer(buffer: Buffer, folder = 'general', filename?: string): Promise<string> {
        return this.getActiveDriver().uploadBuffer(buffer, folder, filename);
    }

    saveFileToLocal(file: IFile, subdir: string): string {
        return this.getActiveDriver().saveFileToLocal(file, subdir);
    }

    saveBase64ToLocal(base64Data: string, subdir: string): string {
        return this.getActiveDriver().saveBase64ToLocal(base64Data, subdir);
    }

    buildLocalStorage(key: string, size: number): ILocalStorage {
        return this.getActiveDriver().buildLocalStorage(key, size);
    }

    saveBufferToKey(buffer: Buffer, key: string): ILocalStorage {
        return this.getActiveDriver().saveBufferToKey(buffer, key);
    }

    readLocalByKey(key: string): Buffer {
        return this.getActiveDriver().readLocalByKey(key);
    }

    moveLocalToDir(items: { key: string }[], toDir: string): ILocalStorage[] {
        return this.getActiveDriver().moveLocalToDir(items, toDir);
    }

    deleteLocalDir(dir: string): void {
        this.getActiveDriver().deleteLocalDir(dir);
    }

    // --- CSV & Path Utilities ---

    writeCsv<T = Record<string, string | number | Date>>(rows: T[]): string {
        return Papa.unparse(rows, {
            delimiter: ';',
        });
    }

    readCsv<T = Record<string, string | number | Date>>(file: string): T[] {
        const parsed = Papa.parse<T>(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: ';',
            fastMode: true,
            transform(value) {
                return value === '' ? null : value;
            },
        });

        return parsed.data;
    }

    createRandomFilename({
        prefix,
        path,
        extension,
        randomLength,
    }: IFileRandomFilenameOptions): string {
        const randomPath = this.helperService.randomString(randomLength ?? 10);
        let fullPath: string = `${path ? `${path}/` : ''}${prefix ? `${prefix}-` : ''}${randomPath}.${extension.toLowerCase()}`;

        if (fullPath.startsWith('/')) {
            fullPath = fullPath.replace('/', '');
        }

        return fullPath;
    }

    extractExtensionFromFilename(filename: string): string {
        return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    extractMimeFromFilename(filename: string): string | null {
        const ext = this.extractExtensionFromFilename(filename);
        return ext ? (this.mimeMap[ext] ?? null) : null;
    }

    extractFilenameFromPath(filePath: string): string {
        const parts = filePath.split('/');
        return parts[parts.length - 1];
    }
}
