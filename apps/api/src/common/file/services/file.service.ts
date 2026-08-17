import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IFileService } from '@common/file/interfaces/file.service.interface';
import {
    IFile,
    IFileRandomFilenameOptions,
    ILocalStorage,
} from '@common/file/interfaces/file.interface';
import { HelperService } from '@common/helper/services/helper.service';
import {
    mkdirSync,
    readFileSync,
    renameSync,
    rmSync,
    statSync,
    writeFileSync,
} from 'fs';
import Papa from 'papaparse';
import { dirname, join } from 'path';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class FileService implements IFileService {
    private readonly logger = new Logger(FileService.name);
    private isCloudinaryReady = false;

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

    private readonly extensionMap: Record<string, string> = {
        'application/pdf': 'pdf',
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'image/svg+xml': 'svg',
        'application/json': 'json',
        'text/csv': 'csv',
        'text/plain': 'txt',
    };

    constructor(
        private readonly helperService: HelperService,
        private readonly configService: ConfigService
    ) {
        this.initCloudinary();
    }

    private initCloudinary(): void {
        const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || this.configService.get<string>('cloudinary.cloudName');
        const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY') || this.configService.get<string>('cloudinary.apiKey');
        const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET') || this.configService.get<string>('cloudinary.apiSecret');

        if (cloudName && apiKey && apiSecret) {
            cloudinary.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
            });
            this.isCloudinaryReady = true;
            this.logger.log(`Cloudinary initialized successfully for cloud: ${cloudName}`);
        } else {
            this.logger.warn('Cloudinary credentials missing, defaulting to local storage.');
        }
    }

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

    /**
     * Tải tệp lên Cloudinary theo thư mục `samngoclinh/<folder>`.
     * Tự động fallback về lưu cục bộ `/uploads/<folder>/<filename>` nếu Cloudinary chưa cấu hình hoặc lỗi.
     */
    async uploadFile(file: IFile, folder = 'general'): Promise<string> {
        if (this.isCloudinaryReady) {
            try {
                const targetFolder = `samngoclinh/${folder.replace(/^\/+|\/+$/g, '')}`;
                const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: targetFolder,
                            resource_type: 'auto',
                        },
                        (error, res) => {
                            if (res) resolve(res);
                            else reject(error);
                        }
                    );
                    uploadStream.end(file.buffer);
                });

                return result.secure_url;
            } catch (err) {
                this.logger.error(`Cloudinary upload failed for folder ${folder}, falling back to local:`, err);
            }
        }

        return this.saveFileToLocal(file, folder);
    }

    /**
     * Tải chuỗi ảnh Base64 lên Cloudinary theo thư mục `samngoclinh/<folder>`.
     * Tự động fallback về lưu cục bộ `/uploads/<folder>/<filename>` nếu lỗi.
     */
    async uploadBase64(base64Data: string, folder = 'general'): Promise<string> {
        if (this.isCloudinaryReady) {
            try {
                const targetFolder = `samngoclinh/${folder.replace(/^\/+|\/+$/g, '')}`;
                const result = await cloudinary.uploader.upload(base64Data, {
                    folder: targetFolder,
                    resource_type: 'auto',
                });

                return result.secure_url;
            } catch (err) {
                this.logger.error(`Cloudinary uploadBase64 failed for folder ${folder}, falling back to local:`, err);
            }
        }

        return this.saveBase64ToLocal(base64Data, folder);
    }

    /**
     * Tải Buffer lên Cloudinary.
     */
    async uploadBuffer(buffer: Buffer, folder = 'general', filename?: string): Promise<string> {
        if (this.isCloudinaryReady) {
            try {
                const targetFolder = `samngoclinh/${folder.replace(/^\/+|\/+$/g, '')}`;
                const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: targetFolder,
                            public_id: filename ? filename.replace(/\.[^/.]+$/, '') : undefined,
                            resource_type: 'auto',
                        },
                        (error, res) => {
                            if (res) resolve(res);
                            else reject(error);
                        }
                    );
                    uploadStream.end(buffer);
                });

                return result.secure_url;
            } catch (err) {
                this.logger.error(`Cloudinary uploadBuffer failed, fallback to local:`, err);
            }
        }

        const ext = filename ? this.extractExtensionFromFilename(filename) : 'png';
        const randomName = `${this.helperService.randomString(16)}.${ext}`;
        const key = `${folder}/${randomName}`;
        this.saveBufferToKey(buffer, key);
        return `/uploads/${key}`;
    }

    /**
     * Lưu file upload (multipart) vào thư mục local `uploads/<subdir>` và trả về URL tương đối.
     */
    saveFileToLocal(file: IFile, subdir: string): string {
        const extension =
            (file.mimetype ? this.extensionMap[file.mimetype.toLowerCase()] : null) ??
            this.extractExtensionFromFilename(file.originalname) ??
            'bin';
        const filename = `${this.helperService.randomString(16)}.${extension}`;
        const absoluteDir = join(process.cwd(), 'uploads', subdir);

        mkdirSync(absoluteDir, { recursive: true });
        writeFileSync(join(absoluteDir, filename), file.buffer);

        return `/uploads/${subdir}/${filename}`;
    }

    /**
     * Lưu chuỗi ảnh Base64 vào thư mục local `uploads/<subdir>` và trả về URL tương đối.
     */
    saveBase64ToLocal(base64Data: string, subdir: string): string {
        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let buffer: Buffer;
        let extension = 'png';

        if (matches && matches.length === 3) {
            extension = this.extensionMap[matches[1].toLowerCase()] ?? 'png';
            buffer = Buffer.from(matches[2], 'base64');
        } else {
            buffer = Buffer.from(base64Data, 'base64');
        }

        const filename = `${this.helperService.randomString(16)}.${extension}`;
        const absoluteDir = join(process.cwd(), 'uploads', subdir);

        mkdirSync(absoluteDir, { recursive: true });
        writeFileSync(join(absoluteDir, filename), buffer);

        return `/uploads/${subdir}/${filename}`;
    }

    buildLocalStorage(key: string, size: number): ILocalStorage {
        return {
            key,
            url: `/uploads/${key}`,
            mime: this.extractMimeFromFilename(key) ?? 'application/octet-stream',
            extension: this.extractExtensionFromFilename(key),
            size,
        };
    }

    saveBufferToKey(buffer: Buffer, key: string): ILocalStorage {
        const absolute = join(process.cwd(), 'uploads', key);

        mkdirSync(dirname(absolute), { recursive: true });
        writeFileSync(absolute, buffer);

        return this.buildLocalStorage(key, buffer.length);
    }

    readLocalByKey(key: string): Buffer {
        return readFileSync(join(process.cwd(), 'uploads', key));
    }

    moveLocalToDir(items: { key: string }[], toDir: string): ILocalStorage[] {
        return items.map(item => {
            const filename = this.extractFilenameFromPath(item.key);
            const newKey = `${toDir}/${filename}`;
            const to = join(process.cwd(), 'uploads', newKey);

            mkdirSync(dirname(to), { recursive: true });
            renameSync(join(process.cwd(), 'uploads', item.key), to);

            return this.buildLocalStorage(newKey, statSync(to).size);
        });
    }

    deleteLocalDir(dir: string): void {
        rmSync(join(process.cwd(), 'uploads', dir), {
            recursive: true,
            force: true,
        });
    }
}
