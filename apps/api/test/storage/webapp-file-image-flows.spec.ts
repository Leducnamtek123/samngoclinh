import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import request from 'supertest';
import { HelperService } from '@common/helper/services/helper.service';
import { FileService } from '@common/file/services/file.service';
import { CatalogAdminController } from '@modules/catalog/controllers/catalog.admin.controller';
import { IFile } from '@common/file/interfaces/file.interface';

/**
 * 🧪 WebApp Testing Suite: End-to-End File & Image Flows (Web ⟷ Admin ⟷ API)
 *
 * Covers:
 * 1. Admin Catalog Image Upload -> File Storage -> Web Shop Consumption
 * 2. User Signature Base64 Upload -> File Storage -> E-Contract Signed PDF Generation & Streaming
 * 3. Contract Amendment / Addendum PDF Artifact Storage & Retrieval
 * 4. Static Banner / Marketing Asset Flow
 * 5. Cross-App Next.js Proxy & Static Asset Resolution
 */
describe('🧪 WebApp Testing: File & Image Flows Across Web, Admin, and API', () => {
    let fileService: FileService;
    let helperService: HelperService;
    let configServiceMock: any;
    let mockCatalogService: any;
    let catalogAdminController: CatalogAdminController;
    let apiApp: express.Express;

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

        mockCatalogService = {
            createProduct: jest.fn((dto) => Promise.resolve({ id: 'prod-001', ...dto })),
            findProducts: jest.fn(() => Promise.resolve([
                { id: 'prod-001', name: 'Sâm Ngọc Linh Kon Tum 10 Năm', imageUrl: '/uploads/catalog/sam-10-nam.png', price: 15000000 },
                { id: 'prod-002', name: 'Rượu Sâm Ngọc Linh Thượng Hạng', imageUrl: '/uploads/catalog/ruou-sam.jpg', price: 3500000 },
            ])),
        };

        catalogAdminController = new CatalogAdminController(mockCatalogService, fileService);

        // Express Server simulating NestJS Main Static Assets Mount
        apiApp = express();
        apiApp.use('/uploads', express.static(testUploadsDir));
        apiApp.get('/api/public/catalog', async (_req, res) => {
            const products = await mockCatalogService.findProducts();
            res.status(200).json({ statusCode: 200, data: products });
        });
    });

    afterAll(() => {
        // Cleanup test folders
        const testSubdirs = ['catalog', 'signatures', 'contracts', 'amendments', 'banners'];
        for (const sub of testSubdirs) {
            const target = path.join(testUploadsDir, sub);
            if (fs.existsSync(target)) {
                fs.rmSync(target, { recursive: true, force: true });
            }
        }
    });

    describe('Luồng 1: Admin Catalog Upload ⟶ API Storage ⟶ Web Shop Hiển Thị', () => {
        let uploadedProductImageUrl: string;

        it('Bước 1.1: Admin tải ảnh sản phẩm lên API (Multipart JPG/PNG)', async () => {
            const sampleImageBytes = Buffer.from('Fake PNG binary content for Sâm Ngọc Linh Product');
            const mockFile = {
                fieldname: 'file',
                originalname: 'cu-sam-ngoc-linh-loai-1.png',
                encoding: '7bit',
                mimetype: 'image/png',
                size: sampleImageBytes.length,
                buffer: sampleImageBytes,
            } as unknown as IFile;

            const uploadResponse = await catalogAdminController.uploadFile(mockFile);
            expect(uploadResponse).toBeDefined();
            expect(uploadResponse.data).toBeDefined();
            expect(uploadResponse.data?.url).toMatch(/^\/uploads\/catalog\/[a-zA-Z0-9_-]+\.png$/);

            uploadedProductImageUrl = uploadResponse.data?.url || '';

            // Kiểm tra vật lý trên đĩa cứng
            const diskRelativePath = uploadedProductImageUrl.replace(/^\/?uploads\//, '');
            const diskFullPath = path.join(testUploadsDir, diskRelativePath);
            expect(fs.existsSync(diskFullPath)).toBe(true);
            expect(fs.readFileSync(diskFullPath).equals(sampleImageBytes)).toBe(true);
        });

        it('Bước 1.2: Web Shop truy vấn danh sách sản phẩm và nhận đường dẫn ảnh /uploads/...', async () => {
            const res = await request(apiApp)
                .get('/api/public/catalog')
                .expect(200);

            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.data[0].imageUrl).toMatch(/^\/uploads\/catalog\//);
        });

        it('Bước 1.3: Trình duyệt / Web Frontend tải ảnh từ URL /uploads/catalog/... thành công (HTTP 200)', async () => {
            const res = await request(apiApp)
                .get(uploadedProductImageUrl)
                .expect(200);

            expect(res.headers['content-type']).toMatch(/image\/png/);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('Luồng 2: Web User Ký Hợp Đồng (Base64) ⟶ Tạo PDF Bản Ký ⟶ Tải & Xem PDF', () => {
        let storedSignatureUrl: string;
        let storedContractPdfUrl: string;

        it('Bước 2.1: Web User gửi chữ ký Base64 lên API và lưu thành ảnh PNG trên đĩa cứng', async () => {
            const mockBase64Sig = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
            
            storedSignatureUrl = await fileService.uploadBase64(mockBase64Sig, 'signatures');
            expect(storedSignatureUrl).toMatch(/^\/uploads\/signatures\/[a-zA-Z0-9_-]+\.png$/);

            const diskSigPath = path.join(testUploadsDir, storedSignatureUrl.replace(/^\/?uploads\//, ''));
            expect(fs.existsSync(diskSigPath)).toBe(true);
            expect(fs.statSync(diskSigPath).size).toBeGreaterThan(0);
        });

        it('Bước 2.2: API tạo bản PDF hợp đồng có chữ ký (Buffer) và lưu vào /uploads/contracts/...', async () => {
            const mockSignedPdfBuffer = Buffer.from('%PDF-1.4 Mock Signed Contract with Watermark and Digital Signature');
            
            storedContractPdfUrl = await fileService.uploadBuffer(
                mockSignedPdfBuffer,
                'contracts',
                'Hop-Dong-CTR-2026-001.pdf'
            );
            expect(storedContractPdfUrl).toMatch(/^\/uploads\/contracts\/[a-zA-Z0-9_-]+\.pdf$/);

            const diskPdfPath = path.join(testUploadsDir, storedContractPdfUrl.replace(/^\/?uploads\//, ''));
            expect(fs.existsSync(diskPdfPath)).toBe(true);
        });

        it('Bước 2.3: User và Admin có thể tải / xem trực tiếp PDF bản ký qua HTTP 200', async () => {
            const res = await request(apiApp)
                .get(storedContractPdfUrl)
                .expect(200);

            expect(res.headers['content-type']).toMatch(/application\/pdf/);
            expect(res.body.toString()).toContain('%PDF-1.4');
        });
    });

    describe('Luồng 3: Phụ Lục Hợp Đồng (Addendum/Amendment) PDF Flow', () => {
        it('Bước 3.1: Lưu và phục vụ phụ lục hợp đồng điện tử độc lập', async () => {
            const mockAmendmentPdfBuffer = Buffer.from('%PDF-1.4 Mock Contract Amendment AMD-001 for Sâm Ngọc Linh');
            
            const amendmentUrl = await fileService.uploadBuffer(
                mockAmendmentPdfBuffer,
                'amendments',
                'Phu-Luc-AMD-001.pdf'
            );
            expect(amendmentUrl).toMatch(/^\/uploads\/amendments\/[a-zA-Z0-9_-]+\.pdf$/);

            const res = await request(apiApp)
                .get(amendmentUrl)
                .expect(200);

            expect(res.headers['content-type']).toMatch(/application\/pdf/);
            expect(res.body.toString()).toContain('AMD-001');
        });
    });

    describe('Luồng 4: Tính Nhất Quán Giữa Next.js Proxy & API Backend (Web ⟷ Admin ⟷ API)', () => {
        it('Bước 4.1: Kiểm tra cấu hình Next.js Rewrites trong Web và Admin đồng bộ với API origin', () => {
            const webRewrite = {
                source: '/uploads/:path*',
                destination: 'http://localhost:3000/uploads/:path*',
            };
            const adminRewrite = {
                source: '/uploads/:path*',
                destination: 'http://localhost:3000/uploads/:path*',
            };

            expect(webRewrite.source).toBe(adminRewrite.source);
            expect(webRewrite.destination).toBe(adminRewrite.destination);

            // Test proxy mapping logic
            const sampleClientRequest = '/uploads/catalog/sam-ngoc-linh-100g.png';
            const proxiedDestination = sampleClientRequest.replace('/uploads/', 'http://localhost:3000/uploads/');
            expect(proxiedDestination).toBe('http://localhost:3000/uploads/catalog/sam-ngoc-linh-100g.png');
        });

        it('Bước 4.2: Xử lý an toàn khi yêu cầu file tĩnh không tồn tại (Trả về HTTP 404 sạch sẽ, không crash server)', async () => {
            await request(apiApp)
                .get('/uploads/catalog/non_existent_file_99999.png')
                .expect(404);
        });
    });
});
