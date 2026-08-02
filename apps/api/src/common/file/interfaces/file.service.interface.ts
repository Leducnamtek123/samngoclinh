import {
    IFile,
    IFileRandomFilenameOptions,
    ILocalStorage,
} from '@common/file/interfaces/file.interface';

export interface IFileService {
    writeCsv<T = Record<string, string | number | Date>>(rows: T[]): string;
    readCsv<T = Record<string, string | number | Date>>(file: string): T[];
    createRandomFilename({
        path,
        prefix,
        extension,
        randomLength,
    }: IFileRandomFilenameOptions): string;
    extractExtensionFromFilename(filename: string): string;
    extractMimeFromFilename(filename: string): string | null;
    extractFilenameFromPath(filePath: string): string;
    saveFileToLocal(file: IFile, subdir: string): string;
    buildLocalStorage(key: string, size: number): ILocalStorage;
    saveBufferToKey(buffer: Buffer, key: string): ILocalStorage;
    readLocalByKey(key: string): Buffer;
    moveLocalToDir(items: { key: string }[], toDir: string): ILocalStorage[];
    deleteLocalDir(dir: string): void;
}
