import { Injectable } from '@nestjs/common';
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
import Mime from 'mime';
import Papa from 'papaparse';
import { dirname, join } from 'path';

@Injectable()
export class FileService implements IFileService {
    constructor(private readonly helperService: HelperService) {}

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
        return (
            Mime.getType(
                filename.slice(filename.lastIndexOf('.'))
            )?.toLowerCase() ?? null
        );
    }

    extractFilenameFromPath(filePath: string): string {
        const parts = filePath.split('/');
        return parts[parts.length - 1];
    }

    /**
     * Lưu file upload (multipart) vào thư mục local `uploads/<subdir>` và trả về URL tương đối
     * (`/uploads/<subdir>/<file>`), phục vụ tĩnh qua prefix `/uploads`.
     */
    saveFileToLocal(file: IFile, subdir: string): string {
        const extension =
            Mime.getExtension(file.mimetype) ??
            this.extractExtensionFromFilename(file.originalname) ??
            'bin';
        const filename = `${this.helperService.randomString(16)}.${extension}`;
        const absoluteDir = join(process.cwd(), 'uploads', subdir);

        mkdirSync(absoluteDir, { recursive: true });
        writeFileSync(join(absoluteDir, filename), file.buffer);

        return `/uploads/${subdir}/${filename}`;
    }

    /**
     * Lưu chuỗi ảnh Base64 (data:image/png;base64,...) vào thư mục local `uploads/<subdir>`
     * và trả về URL tương đối (`/uploads/<subdir>/<filename>`).
     */
    saveBase64ToLocal(base64Data: string, subdir: string): string {
        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let buffer: Buffer;
        let extension = 'png';

        if (matches && matches.length === 3) {
            extension = Mime.getExtension(matches[1]) ?? 'png';
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

    /** Di chuyển từng file (theo key) sang thư mục đích, giữ nguyên tên; trả descriptor mới. */
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
