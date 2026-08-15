import bytes from 'bytes';

export const FileSizeInBytes: number = bytes('50mb') ?? 52428800;

export const FileMaxMultiple: number = 3;

export const FileMaxDataImport = 1000;
