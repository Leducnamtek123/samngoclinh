import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@common/database/services/database.service';
import { Banner } from '@generated/prisma-client';
import { UpsertBannerDto } from '../dtos/banner.dto';
import { IBanner } from '../interfaces/banner.interface';

@Injectable()
export class BannerService {
    private readonly defaultBanners: Record<string, { title: string; subtitle: string; image: string }> = {
        home: {
            title: 'SÂM NGỌC LINH KON TUM',
            subtitle: 'Báu vật của đại ngàn, thần dược của sức khỏe.',
            image: '/assets/images/banner_bg.png',
        },
        products: {
            title: 'Trồng Sâm Cùng Rượu Sâm Ngọc Linh',
            subtitle: 'Trải nghiệm mô hình trồng sâm cùng Rượu Sâm Ngọc Linh qua nền tảng công nghệ số. Kiến tạo giá trị bền vững với những củ Sâm Ngọc Linh minh bạch nguồn gốc và đạt chuẩn chất lượng tuyệt đối.',
            image: '/assets/images/banner_bg.png',
        },
        ginseng: {
            title: 'Sản Phẩm Rượu Sâm Ngọc Linh',
            subtitle: 'Khám phá danh mục sản phẩm rượu sâm Ngọc Linh nguyên cây, nguyên củ và các chế phẩm sâm cao cấp khác.',
            image: '/assets/images/banner_bg.png',
        },
        campaigns: {
            title: 'Khuyến Mãi & Ưu Đãi',
            subtitle: 'Các chương trình quà tặng đặc biệt dành cho khách hàng thân thiết.',
            image: '/assets/images/banner_bg.png',
        },
        about: {
            title: 'Về Chúng Tôi',
            subtitle: 'Hành trình mang sâm Ngọc Linh - Quốc bảo Việt Nam đến với mọi nhà.',
            image: '/assets/images/banner_bg.png',
        },
        news: {
            title: 'Tin Tức & Sự Kiện',
            subtitle: 'Cập nhật những thông tin mới nhất về sâm Ngọc Linh và các hoạt động của chúng tôi.',
            image: '/assets/images/banner_bg.png',
        },
    };

    constructor(private readonly databaseService: DatabaseService) {}

    async getBanner(pageKey: string): Promise<IBanner[]> {
        const banners = await this.databaseService.banner.findMany({
            where: { pageKey },
            orderBy: { order: 'asc' },
        });

        if (banners.length > 0) {
            return banners;
        }

        const defaults = this.defaultBanners[pageKey] || {
            title: 'Sâm Ngọc Linh',
            subtitle: 'Quốc bảo Việt Nam',
            image: '/assets/images/banner_bg.png',
        };

        return [
            {
                id: pageKey,
                pageKey,
                order: 0,
                ...defaults,
            }
        ];
    }

    async createBanner(data: UpsertBannerDto): Promise<Banner> {
        return this.databaseService.banner.create({
            data: {
                pageKey: data.pageKey,
                title: data.title,
                subtitle: data.subtitle,
                image: data.image,
                order: data.order,
            },
        });
    }

    async updateBanner(id: string, data: UpsertBannerDto): Promise<Banner> {
        return this.databaseService.banner.update({
            where: { id },
            data: {
                pageKey: data.pageKey,
                title: data.title,
                subtitle: data.subtitle,
                image: data.image,
                order: data.order,
            },
        });
    }

    async deleteBanner(id: string): Promise<Banner> {
        return this.databaseService.banner.delete({
            where: { id },
        });
    }

    async listBanners(): Promise<IBanner[]> {
        const dbBanners = await this.databaseService.banner.findMany({
            orderBy: [
                { pageKey: 'asc' },
                { order: 'asc' },
            ],
        });

        if (dbBanners.length > 0) {
            return dbBanners;
        }

        // Return defaults if database is empty
        return Object.keys(this.defaultBanners).map(pageKey => ({
            id: pageKey,
            pageKey,
            order: 0,
            ...this.defaultBanners[pageKey],
        }));
    }
}
