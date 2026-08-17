import * as fs from 'fs';
import * as path from 'path';
import { HelperService } from '@common/helper/services/helper.service';
import { FileService } from '@common/file/services/file.service';
import { CatalogAdminController } from '@modules/catalog/controllers/catalog.admin.controller';
import { IFile } from '@common/file/interfaces/file.interface';

describe('Local File Storage Verification (STORAGE_DRIVER=local)', () => {
    let fileService: FileService;
    let helperService: HelperService;
    let configServiceMock: any;
    const testUploadsDir = path.join(process.cwd(), 'uploads');

    beforeEach(() => {
        configServiceMock = {
            get: jest.fn((key: string) => {
                if (key === 'file.storageDriver' || key === 'STORAGE_DRIVER') {
                    return 'local';
                }
                return null;
            }),
        };
        helperService = new HelperService(configServiceMock);

        fileService = new FileService(helperService, configServiceMock);
        fileService.onModuleInit();
    });

    afterAll(() => {
        // Cleanup test artifacts in uploads if created during test
        const testSubdirs = ['test_catalog', 'test_signatures', 'test_contracts', 'catalog'];
        for (const sub of testSubdirs) {
            const target = path.join(testUploadsDir, sub);
            if (fs.existsSync(target)) {
                fs.rmSync(target, { recursive: true, force: true });
            }
        }
    });

    describe('1. FileService uploadFile to Local Storage', () => {
        it('should save multipart file buffer to local uploads directory and return /uploads URL', async () => {
            const sampleContent = Buffer.from('Fake image content PNG bytes 2026');
            const mockFile = {
                fieldname: 'file',
                originalname: 'sam-ngoc-linh-cu-tuoi.png',
                encoding: '7bit',
                mimetype: 'image/png',
                size: sampleContent.length,
                buffer: sampleContent,
            } as unknown as IFile;

            const resultUrl = await fileService.uploadFile(mockFile, 'test_catalog');
            expect(resultUrl).toBeDefined();
            expect(resultUrl).toMatch(/^\/uploads\/test_catalog\/[a-zA-Z0-9_-]+\.png$/);

            // Verify file exists on local filesystem
            const localRelativePath = resultUrl.replace(/^\/?uploads\//, '');
            const localFullPath = path.join(testUploadsDir, localRelativePath);
            expect(fs.existsSync(localFullPath)).toBe(true);

            const writtenContent = fs.readFileSync(localFullPath);
            expect(writtenContent.toString()).toBe(sampleContent.toString());
        });
    });

    describe('2. FileService uploadBase64 to Local Storage', () => {
        it('should decode Base64 data and write PNG file to local disk', async () => {
            const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
            const resultUrl = await fileService.uploadBase64(sampleBase64, 'test_signatures');

            expect(resultUrl).toBeDefined();
            expect(resultUrl).toMatch(/^\/uploads\/test_signatures\/[a-zA-Z0-9_-]+\.png$/);

            const localRelativePath = resultUrl.replace(/^\/?uploads\//, '');
            const localFullPath = path.join(testUploadsDir, localRelativePath);
            expect(fs.existsSync(localFullPath)).toBe(true);
            expect(fs.statSync(localFullPath).size).toBeGreaterThan(0);
        });
    });

    describe('3. FileService uploadBuffer to Local Storage', () => {
        it('should write raw PDF buffer to local disk and return /uploads URL', async () => {
            const pdfBuffer = Buffer.from('%PDF-1.4 Mock Contract Content Sam Ngoc Linh');
            const resultUrl = await fileService.uploadBuffer(pdfBuffer, 'test_contracts', 'Hop-Dong-001.pdf');

            expect(resultUrl).toBeDefined();
            expect(resultUrl).toMatch(/^\/uploads\/test_contracts\/[a-zA-Z0-9_-]+\.pdf$/);

            const localRelativePath = resultUrl.replace(/^\/?uploads\//, '');
            const localFullPath = path.join(testUploadsDir, localRelativePath);
            expect(fs.existsSync(localFullPath)).toBe(true);

            const readBack = fileService.readLocalByKey(localRelativePath);
            expect(readBack.toString()).toBe(pdfBuffer.toString());
        });
    });

    describe('4. CatalogAdminController Upload using FileService', () => {
        it('should upload catalog product image via FileService and return data.url', async () => {
            const catalogServiceMock: any = {};
            const controller = new CatalogAdminController(catalogServiceMock, fileService);

            const mockProductImage = {
                fieldname: 'file',
                originalname: 'ruou-sam-ngoc-linh-dac-biet.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                size: 100,
                buffer: Buffer.from('JPG binary content for catalog product'),
            } as unknown as IFile;

            const response = await controller.uploadFile(mockProductImage);
            expect(response).toBeDefined();
            expect(response.data).toBeDefined();
            expect(response.data?.url).toMatch(/^\/uploads\/catalog\/[a-zA-Z0-9_-]+\.jpg$/);

            const localPath = path.join(testUploadsDir, (response.data?.url || '').replace(/^\/?uploads\//, ''));
            expect(fs.existsSync(localPath)).toBe(true);

            // Clean up created catalog file
            if (fs.existsSync(localPath)) {
                fs.unlinkSync(localPath);
            }
        });
    });

    describe('5. Storage Driver Extensibility & Plugin Architecture', () => {
        it('should allow registering a custom cloud driver (e.g., S3 / MinIO / Cloudinary) and switching to it', async () => {
            // Mock a custom Cloud Driver
            const mockS3Driver = {
                driverType: 's3',
                uploadFile: jest.fn().mockResolvedValue('https://my-bucket.s3.ap-southeast-1.amazonaws.com/catalog/sam-01.png'),
                uploadBase64: jest.fn().mockResolvedValue('https://my-bucket.s3.ap-southeast-1.amazonaws.com/signatures/sig-01.png'),
                uploadBuffer: jest.fn().mockResolvedValue('https://my-bucket.s3.ap-southeast-1.amazonaws.com/contracts/contract-01.pdf'),
                saveFileToLocal: jest.fn(),
                saveBase64ToLocal: jest.fn(),
                buildLocalStorage: jest.fn(),
                saveBufferToKey: jest.fn(),
                readLocalByKey: jest.fn(),
                moveLocalToDir: jest.fn(),
                deleteLocalDir: jest.fn(),
            };

            // Register S3 driver
            fileService.registerDriver(mockS3Driver as any);
            fileService.setActiveDriver('s3');

            expect(fileService.getActiveDriver().driverType).toBe('s3');

            const mockFile = {
                fieldname: 'file',
                originalname: 'sam-ngoc-linh.png',
                mimetype: 'image/png',
                buffer: Buffer.from('test'),
            } as unknown as IFile;

            const uploadResult = await fileService.uploadFile(mockFile, 'catalog');
            expect(uploadResult).toBe('https://my-bucket.s3.ap-southeast-1.amazonaws.com/catalog/sam-01.png');
            expect(mockS3Driver.uploadFile).toHaveBeenCalledTimes(1);

            // Revert back to local driver
            fileService.setActiveDriver('local');
            expect(fileService.getActiveDriver().driverType).toBe('local');
        });

        it('should safely fall back to local driver if configured driver is unknown/unregistered', () => {
            fileService.setActiveDriver('unknown_cloud_provider');
            expect(fileService.getActiveDriver().driverType).toBe('local');
        });
    });
});

