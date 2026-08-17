import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface IContractTemplateItem {
    slug: string;
    title: string;
    type: 'CONTRACT' | 'POLICY';
    version: string;
    description: string;
    lastModified: string;
    contentHtml: string;
    availablePlaceholders?: Array<{ code: string; label: string; example: string }>;
}

@Injectable()
export class EContractTemplateService {
    private readonly logger = new Logger(EContractTemplateService.name);

    private readonly templateMeta: Record<string, Omit<IContractTemplateItem, 'contentHtml' | 'lastModified'>> = {
        'hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh': {
            slug: 'hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh',
            title: 'Hợp Đồng Mua Bán Và Ký Gửi, Chăm Sóc Cây Sâm Ngọc Linh',
            type: 'CONTRACT',
            version: '2.0.0',
            description: 'Văn bản pháp lý 11 Điều khoản & 2 Phụ lục cho giao dịch mua bán và ký gửi chăm sóc cây sâm.',
            availablePlaceholders: [
                { code: '{{TEN_KHACH_HANG}}', label: 'Tên Khách Hàng / Chủ Sở Hữu', example: 'Nguyễn Văn An' },
                { code: '{{CCCD_MST}}', label: 'Số CCCD / Mã Số Thuế', example: '079090001234' },
                { code: '{{DIA_CHI}}', label: 'Địa Chỉ Khách Hàng', example: 'Hải Châu, Đà Nẵng' },
                { code: '{{SO_DIEN_THOAI}}', label: 'Số Điện Thoại', example: '0905123456' },
                { code: '{{MA_HOP_DONG}}', label: 'Mã Số Hợp Đồng', example: 'HĐ-SNL/2026/01' },
                { code: '{{SO_LUONG_CAY}}', label: 'Số Lượng Cây Sâm (Số)', example: '10' },
                { code: '{{SO_LUONG_CAY_CHU}}', label: 'Số Lượng Cây Sâm (Chữ)', example: 'Mười cây' },
                { code: '{{TONG_GIA_TRI}}', label: 'Tổng Giá Trị Hợp Đồng (VNĐ)', example: '2.800.000' },
                { code: '{{TONG_GIA_TRI_CHU}}', label: 'Tổng Giá Trị (Chữ)', example: 'Hai triệu tám trăm nghìn đồng' },
                { code: '{{PHI_CHAM_SOC}}', label: 'Phí Chăm Sóc Hàng Năm (VNĐ)', example: '1.500.000' },
                { code: '{{PHI_CHAM_SOC_CHU}}', label: 'Phí Chăm Sóc (Chữ)', example: 'Một triệu năm trăm nghìn đồng' },
                { code: '{{NGAY_KY}}', label: 'Ngày Ký Xác Thực', example: '15/08/2026' },
            ],
        },
        'dieu-khoan-su-dung': {
            slug: 'dieu-khoan-su-dung',
            title: 'Điều Khoản Sử Dụng – Nền Tảng Sâm Ngọc Linh',
            type: 'POLICY',
            version: '2.0.0',
            description: 'Quy chế và 13 Điều khoản sử dụng dịch vụ trên hệ thống Sâm Ngọc Linh.',
            availablePlaceholders: [],
        },
    };

    /**
     * Resolve absolute path to template file on disk
     */
    private getTemplateFilePath(slug: string): string {
        const possibleRoots = [
            path.resolve(process.cwd(), 'templates'),
            path.resolve(process.cwd(), '../../templates'),
            path.resolve(process.cwd(), '../templates'),
        ];

        let subDir = 'contracts';
        if (slug === 'dieu-khoan-su-dung') {
            subDir = 'policies';
        }

        for (const root of possibleRoots) {
            const targetPath = path.join(root, subDir, `${slug}.html`);
            if (fs.existsSync(targetPath)) {
                return targetPath;
            }
        }

        // Default fallback creation path
        const defaultRoot = possibleRoots[0];
        const dir = path.join(defaultRoot, subDir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return path.join(dir, `${slug}.html`);
    }

    /**
     * Get list of all available templates
     */
    async listTemplates(): Promise<IContractTemplateItem[]> {
        const slugs = Object.keys(this.templateMeta);
        const results: IContractTemplateItem[] = [];

        for (const slug of slugs) {
            const template = await this.getTemplate(slug);
            results.push(template);
        }

        return results;
    }

    /**
     * Get specific template by slug, optionally replacing placeholders
     */
    async getTemplate(
        slug: string,
        placeholders?: Record<string, string>
    ): Promise<IContractTemplateItem> {
        const meta = this.templateMeta[slug];
        if (!meta) {
            throw new NotFoundException(`Template with slug '${slug}' not found`);
        }

        const filePath = this.getTemplateFilePath(slug);
        let contentHtml = '';
        let lastModified = new Date().toISOString();

        if (fs.existsSync(filePath)) {
            contentHtml = fs.readFileSync(filePath, 'utf-8');
            const stats = fs.statSync(filePath);
            lastModified = stats.mtime.toISOString();
        } else {
            contentHtml = `<p>Template ${meta.title} đang được khởi tạo...</p>`;
        }

        // Replace placeholders if provided
        if (placeholders && Object.keys(placeholders).length > 0) {
            for (const [key, val] of Object.entries(placeholders)) {
                const placeholder = key.startsWith('{{') ? key : `{{${key}}}`;
                contentHtml = contentHtml.split(placeholder).join(val || '');
            }
        }

        return {
            ...meta,
            contentHtml,
            lastModified,
        };
    }

    /**
     * Update template content and version
     */
    async updateTemplate(
        slug: string,
        payload: {
            title?: string;
            version?: string;
            description?: string;
            contentHtml: string;
        }
    ): Promise<IContractTemplateItem> {
        const meta = this.templateMeta[slug];
        if (!meta) {
            throw new NotFoundException(`Template with slug '${slug}' not found`);
        }

        if (payload.title) {meta.title = payload.title;}
        if (payload.version) {meta.version = payload.version;}
        if (payload.description) {meta.description = payload.description;}

        const filePath = this.getTemplateFilePath(slug);
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, payload.contentHtml, 'utf-8');
        this.logger.log(`[EContractTemplateService] Updated template '${slug}' at ${filePath}`);

        return this.getTemplate(slug);
    }

    /**
     * Import HTML raw file / text into template
     */
    async importHtml(
        slug: string,
        rawHtml: string
    ): Promise<IContractTemplateItem> {
        return this.updateTemplate(slug, {
            contentHtml: rawHtml,
        });
    }
}
