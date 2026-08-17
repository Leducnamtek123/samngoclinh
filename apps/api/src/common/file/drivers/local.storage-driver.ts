import { Injectable } from '@nestjs/common';
import { IFileStorageDriver, FileStorageDriverType } from '../interfaces/file.storage-driver.interface';
import { IFile, ILocalStorage } from '../interfaces/file.interface';
import { HelperService } from '@common/helper/services/helper.service';
import {
    mkdirSync,
    readFileSync,
    renameSync,
    rmSync,
    statSync,
    writeFileSync,
} from 'fs';
import { dirname, join } from 'path';

@Injectable()
export class LocalStorageDriver implements IFileStorageDriver {
    readonly driverType: FileStorageDriverType = 'local';

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

    constructor(private readonly helperService: HelperService) {}

    private extractExtensionFromFilename(filename: string): string {
        return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    private extractMimeFromFilename(filename: string): string | null {
        const ext = this.extractExtensionFromFilename(filename);
        return ext ? (this.mimeMap[ext] ?? null) : null;
    }

    private extractFilenameFromPath(filePath: string): string {
        const parts = filePath.split('/');
        return parts[parts.length - 1];
    }

    async uploadFile(file: IFile, folder = 'general'): Promise<string> {
        return this.saveFileToLocal(file, folder);
    }

    async uploadBase64(base64Data: string, folder = 'general'): Promise<string> {
        return this.saveBase64ToLocal(base64Data, folder);
    }

    async uploadBuffer(buffer: Buffer, folder = 'general', filename?: string): Promise<string> {
        const ext = filename ? this.extractExtensionFromFilename(filename) : 'png';
        const randomName = `${this.helperService.randomString(16)}.${ext}`;
        const key = `${folder}/${randomName}`;
        this.saveBufferToKey(buffer, key);
        return `/uploads/${key}`;
    }

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
