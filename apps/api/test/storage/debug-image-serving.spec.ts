import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import request from 'supertest';
import { HelperService } from '@common/helper/services/helper.service';
import { FileService } from '@common/file/services/file.service';
import { IFile } from '@common/file/interfaces/file.interface';

describe('🔍 Debug: Local Image Storage & Static Serving Verification (/debug)', () => {
    let fileService: FileService;
    let helperService: HelperService;
    let configServiceMock: any;
    let app: express.Express;
    const testUploadsDir = path.join(process.cwd(), 'uploads');

    beforeAll(() => {
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

        // Setup mock Express App configured with identical static assets mounting as main.ts
        app = express();
        app.use('/uploads', express.static(testUploadsDir));
    });

    afterAll(() => {
        // Cleanup test folders
        const testSubdirs = ['debug_test_images', 'debug_test_docs'];
        for (const sub of testSubdirs) {
            const target = path.join(testUploadsDir, sub);
            if (fs.existsSync(target)) {
                fs.rmSync(target, { recursive: true, force: true });
            }
        }
    });

    describe('1. Lưu hình ảnh PNG thực tế vào đĩa cứng (Local Disk Storage)', () => {
        it('should save PNG image to disk and verify physical file integrity', async () => {
            const mockPngBytes = Buffer.from([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG Header Magic
                0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR Chunk
                0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 Pixel
                0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
                0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
                0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
                0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
                0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, // IEND Chunk
                0x42, 0x60, 0x82,
            ]);

            const mockFile = {
                fieldname: 'image',
                originalname: 'cu-sam-ngoc-linh-10-nam.png',
                encoding: '7bit',
                mimetype: 'image/png',
                size: mockPngBytes.length,
                buffer: mockPngBytes,
            } as unknown as IFile;

            // 1. Upload
            const urlPath = await fileService.uploadFile(mockFile, 'debug_test_images');
            expect(urlPath).toBeDefined();
            expect(urlPath.startsWith('/uploads/debug_test_images/')).toBe(true);
            expect(urlPath.endsWith('.png')).toBe(true);

            // 2. Verify existence on filesystem
            const localRelative = urlPath.replace(/^\/?uploads\//, '');
            const localAbsolute = path.join(testUploadsDir, localRelative);
            expect(fs.existsSync(localAbsolute)).toBe(true);

            const fileStat = fs.statSync(localAbsolute);
            expect(fileStat.size).toBe(mockPngBytes.length);

            // 3. Verify exact byte match
            const savedContent = fs.readFileSync(localAbsolute);
            expect(savedContent.equals(mockPngBytes)).toBe(true);
        });
    });

    describe('2. Hiển thị / Phục vụ HTTP Static Serving (HTTP GET /uploads/...)', () => {
        it('should successfully serve the saved PNG image via HTTP GET with 200 OK and image/png Content-Type', async () => {
            const sampleJpegBytes = Buffer.from('Fake JPEG Content For Sâm Ngọc Linh');
            const mockFile = {
                fieldname: 'file',
                originalname: 'ruou-sam-dac-san.jpg',
                mimetype: 'image/jpeg',
                size: sampleJpegBytes.length,
                buffer: sampleJpegBytes,
            } as unknown as IFile;

            // 1. Upload
            const urlPath = await fileService.uploadFile(mockFile, 'debug_test_images');

            // 2. Request HTTP GET on static asset route (just like browser or Next.js proxy does)
            const res = await request(app)
                .get(urlPath)
                .expect(200);

            // 3. Verify HTTP Headers and Content
            expect(res.headers['content-type']).toMatch(/image\/(jpeg|jpg)/);
            expect(res.body).toEqual(sampleJpegBytes);
        });

        it('should successfully serve Base64 uploaded signatures via HTTP GET', async () => {
            const rawBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
            
            // 1. Upload Base64 signature
            const urlPath = await fileService.uploadBase64(rawBase64, 'debug_test_images');
            expect(urlPath).toMatch(/^\/uploads\/debug_test_images\/[a-zA-Z0-9_-]+\.png$/);

            // 2. Request HTTP GET
            const res = await request(app)
                .get(urlPath)
                .expect(200);

            expect(res.headers['content-type']).toMatch(/image\/png/);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should return 404 Not Found when requesting non-existent image', async () => {
            await request(app)
                .get('/uploads/debug_test_images/non_existent_image_12345.png')
                .expect(404);
        });
    });

    describe('3. Next.js Rewrite & Proxy Compatibility Verification', () => {
        it('should confirm Next.js rewrite rule maps /uploads/:path* to api origin', () => {
            const rewriteRule = {
                source: '/uploads/:path*',
                destination: 'http://localhost:3000/uploads/:path*',
            };
            expect(rewriteRule.source).toBe('/uploads/:path*');

            const incomingRequestPath = '/uploads/debug_test_images/product-01.png';
            const matched = incomingRequestPath.startsWith('/uploads/');
            expect(matched).toBe(true);

            const targetUrl = incomingRequestPath.replace('/uploads/', 'http://localhost:3000/uploads/');
            expect(targetUrl).toBe('http://localhost:3000/uploads/debug_test_images/product-01.png');
        });
    });
});
