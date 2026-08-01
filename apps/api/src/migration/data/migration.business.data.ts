import { EnumAppEnvironment } from '@app/enums/app.enum';

export const migrationBusinessData: Record<
    EnumAppEnvironment,
    {
        catalogPlants: {
            code: string;
            name: string;
            ageYear: number;
            price: number;
            stock: number;
            status: string;
            orderCount: number;
            images: string[];
            description: string;
        }[];
        catalogProducts: {
            code: string;
            name: string;
            category: string;
            unit: string;
            price: number;
            stock: number;
            status: string;
            featured: boolean;
            images: string[];
            description: string;
        }[];
        promotionCampaigns: {
            code: string;
            title: string;
            description: string;
            note: string;
            status: string;
            remainingSlots: number;
            requiredVerified: boolean;
            requiredDeposit: boolean;
            plantCode: string;
            metadata: Record<string, unknown>;
        }[];
        marketplaceListings: {
            code: string;
            title: string;
            category: string;
            price: number;
            quantity: number;
            ownerType: string;
            status: string;
            metadata: Record<string, unknown>;
        }[];
        contentArticles: {
            slug: string;
            title: string;
            category: string;
            summary: string;
            body: string;
            status: string;
            sortOrder: number;
        }[];
        banners: {
            id: string;
            pageKey: string;
            title: string;
            subtitle: string;
            image: string;
            order: number;
        }[];
        cultivationGardens: {
            code: string;
            name: string;
            status: string;
            totalBeds: number;
            activeBeds: number;
            totalTrees: number;
            metadata: Record<string, unknown>;
        }[];
        cultivationBeds: {
            code: string;
            gardenCode: string;
            name: string;
            ageYear: number;
            treeCount: number;
            status: string;
            metadata: Record<string, unknown>;
        }[];
        cultivationTrees: {
            code: string;
            bedCode: string;
            name: string;
            ageYear: number;
            quantity: number;
            status: string;
            metadata: Record<string, unknown>;
        }[];
        walletAccounts: {
            balancePoint: number;
            treesOwned: number;
            transferEnabled: boolean;
            metadata: Record<string, unknown>;
        }[];
        walletTransactions: {
            code: string;
            type: string;
            title: string;
            amount: number;
            balanceAfter: number;
            status: string;
            metadata: Record<string, unknown>;
        }[];
        orders: {
            code: string;
            status: string;
            currency: string;
            subtotal: number;
            shippingFee: number;
            discount: number;
            total: number;
            paymentMethod: string;
            items: Record<string, unknown>[];
            metadata: Record<string, unknown>;
        }[];
        businessProfile: {
            fullName: string;
            referralCode: string;
            rank: string;
            phone: string;
            gender: string;
            verified: boolean;
            metadata: Record<string, unknown>;
        };
    }
> = {
    [EnumAppEnvironment.local]: {
        banners: [
            {
                id: 'banner-home-1',
                pageKey: 'home',
                title: 'SÂM NGỌC LINH KON TUM',
                subtitle: 'Báu vật của đại ngàn, thần dược của sức khỏe.',
                image: '/assets/images/banner_bg.png',
                order: 0,
            },
            {
                id: 'banner-home-2',
                pageKey: 'home',
                title: 'Trồng sâm cùng iWE FARM',
                subtitle:
                    'Minh bạch nguồn gốc, chuẩn gen, trồng đúng vùng ngay trên điện thoại.',
                image: '/assets/images/banner_bg.png',
                order: 1,
            },
            {
                id: 'banner-home-3',
                pageKey: 'home',
                title: 'Khuyến mãi & ưu đãi',
                subtitle:
                    'Các chương trình quà tặng đặc biệt dành cho khách hàng thân thiết.',
                image: '/assets/images/banner_bg.png',
                order: 2,
            },
        ],
        catalogPlants: [
            {
                code: 'plant-1y',
                name: 'Cây Sâm Ngọc Linh 1 năm',
                ageYear: 1,
                price: 83942,
                stock: 144,
                status: 'available',
                orderCount: 12,
                images: [
                    '/images/kon_tum_ginseng.png',
                    '/assets/images/logo_ruou_sam.png',
                ],
                description: 'Cây sâm 1 năm dành cho người mới tham gia.',
            },
            {
                code: 'plant-2y',
                name: 'Cây Sâm Ngọc Linh 2 năm',
                ageYear: 2,
                price: 327993,
                stock: 330,
                status: 'available',
                orderCount: 30,
                images: [
                    '/images/kon_tum_ginseng.png',
                    '/assets/images/logo_ruou_sam.png',
                ],
                description: 'Cây sâm 2 năm có giá trị tăng trưởng tốt.',
            },
            {
                code: 'plant-3y',
                name: 'Cây Sâm Ngọc Linh 3 năm',
                ageYear: 3,
                price: 869355,
                stock: 140,
                status: 'available',
                orderCount: 57,
                images: [
                    '/images/kon_tum_ginseng.png',
                    '/assets/images/logo_ruou_sam.png',
                ],
                description: 'Cây sâm 3 năm phổ biến trên trang bán hàng.',
            },
        ],
        catalogProducts: [
            {
                code: 'product-wine-root',
                name: 'Rượu Sâm Ngọc Linh nguyên cây - nguyên củ',
                category: 'beverage',
                unit: 'chai',
                price: 7000000,
                stock: 12,
                status: 'available',
                featured: true,
                images: [
                    '/images/products/wine_root.png',
                    '/images/kon_tum_ginseng.png',
                ],
                description: 'Sản phẩm ngâm rượu từ củ sâm thật.',
            },
            {
                code: 'product-tea-slice',
                name: 'Sâm Ngọc Linh cắt lát sấy thăng hoa 10g',
                category: 'tea',
                unit: 'gói',
                price: 3500000,
                stock: 18,
                status: 'available',
                featured: true,
                images: [
                    '/images/products/tea_slice.png',
                    '/images/products/tea_box.png',
                ],
                description: 'Gói lát sâm sấy thăng hoa tiện dùng.',
            },
            {
                code: 'product-shampoo',
                name: 'Dầu gội thảo dược Sâm Ngọc Linh',
                category: 'personal_care',
                unit: 'chai',
                price: 319000,
                stock: 42,
                status: 'available',
                featured: false,
                images: [
                    '/images/products/shampoo.png',
                    '/assets/images/logo_ruou_sam.png',
                ],
                description: 'Sản phẩm chăm sóc cá nhân từ thảo dược.',
            },
            {
                code: 'product-honey',
                name: 'Mật ong rừng ngâm Sâm Ngọc Linh 500ml',
                category: 'food',
                unit: 'hũ',
                price: 1250000,
                stock: 60,
                status: 'available',
                featured: true,
                images: [
                    '/images/products/honey.png',
                    '/images/kon_tum_ginseng.png',
                ],
                description:
                    'Mật ong rừng nguyên chất ngâm lát sâm Ngọc Linh, bồi bổ sức khỏe mỗi ngày.',
            },
            {
                code: 'product-tea-bag',
                name: 'Trà túi lọc Sâm Ngọc Linh hộp 25 gói',
                category: 'tea',
                unit: 'hộp',
                price: 480000,
                stock: 120,
                status: 'available',
                featured: false,
                images: ['/images/products/tea_box.png'],
                description:
                    'Trà túi lọc tiện lợi, hương sâm dịu nhẹ, dùng nóng hoặc lạnh đều ngon.',
            },
            {
                code: 'product-wine-slice',
                name: 'Rượu Sâm Ngọc Linh ngâm lát 1 lít',
                category: 'beverage',
                unit: 'chai',
                price: 2200000,
                stock: 30,
                status: 'available',
                featured: true,
                images: [
                    '/images/products/wine_root.png',
                    '/assets/images/logo_ruou_sam.png',
                ],
                description:
                    'Rượu ngâm lát sâm Ngọc Linh, vị êm, thích hợp làm quà biếu.',
            },
            {
                code: 'product-extract',
                name: 'Cao Sâm Ngọc Linh cô đặc 100g',
                category: 'food',
                unit: 'lọ',
                price: 4500000,
                stock: 15,
                status: 'available',
                featured: false,
                images: [
                    '/images/products/honey.png',
                    '/images/kon_tum_ginseng.png',
                ],
                description:
                    'Cao sâm cô đặc từ củ sâm Ngọc Linh, pha cùng nước ấm hoặc mật ong.',
            },
            {
                code: 'product-capsule',
                name: 'Viên nang Sâm Ngọc Linh hộp 60 viên',
                category: 'supplement',
                unit: 'hộp',
                price: 1650000,
                stock: 80,
                status: 'available',
                featured: true,
                images: ['/images/kon_tum_ginseng.png'],
                description:
                    'Viên nang chiết xuất sâm Ngọc Linh, tiện dùng cho người bận rộn.',
            },
            {
                code: 'product-tea-slice-large',
                name: 'Sâm Ngọc Linh cắt lát sấy thăng hoa 20g',
                category: 'tea',
                unit: 'gói',
                price: 6800000,
                stock: 10,
                status: 'available',
                featured: false,
                images: [
                    '/images/products/tea_slice.png',
                    '/images/products/tea_box.png',
                ],
                description:
                    'Gói lát sâm sấy thăng hoa loại lớn, giữ trọn dưỡng chất và hương vị.',
            },
        ],
        promotionCampaigns: [
            {
                code: 'free-tree-2026',
                title: 'Tặng cây sâm 1 năm',
                description: 'Ưu đãi dành cho tài khoản đã xác thực danh tính.',
                note: 'Cần gói chăm sóc và bảo vệ.',
                status: 'active',
                remainingSlots: 24,
                requiredVerified: true,
                requiredDeposit: true,
                plantCode: 'plant-1y',
                metadata: { source: 'iwefarm.com.vn/campaigns/free-tree' },
            },
        ],
        marketplaceListings: [
            {
                code: 'listing-plant-3y',
                title: 'Cây Sâm Ngọc Linh 3 năm',
                category: 'plant',
                price: 869355,
                quantity: 140,
                ownerType: 'provider',
                status: 'active',
                metadata: { source: 'ginseng marketplace' },
            },
            {
                code: 'listing-rice-wine-root',
                title: 'Rượu Sâm Ngọc Linh nguyên cây - nguyên củ',
                category: 'product',
                price: 7000000,
                quantity: 12,
                ownerType: 'provider',
                status: 'active',
                metadata: { source: 'ginseng marketplace' },
            },
        ],
        contentArticles: [
            {
                slug: 'bao-chi-noi-ve-iwe-farm',
                title: 'Báo chí nói gì về iWE FARM',
                category: 'news',
                summary:
                    'Tổng hợp góc nhìn báo chí về nền tảng minh bạch nguồn gốc Sâm Ngọc Linh.',
                body: 'Sự ra đời của ứng dụng iWE FARM đã thu hút sự quan tâm của nhiều cơ quan báo chí...',
                status: 'published',
                sortOrder: 1,
            },
            {
                slug: 'cup-vang-nen-tang-nong-nghiep-thong-minh',
                title: 'iWE FARM nhận Cúp vàng nền tảng nông nghiệp thông minh',
                category: 'event',
                summary:
                    'Ghi nhận cho mô hình nông nghiệp số và dữ liệu cây sâm.',
                body: 'Ngày 6/12, ứng dụng iWE FARM do Công ty Cổ phần iWE Homes phát triển...',
                status: 'published',
                sortOrder: 2,
            },
            {
                slug: 'faq-sam-ngoc-linh',
                title: 'Câu hỏi thường gặp về Sâm Ngọc Linh',
                category: 'faq',
                summary:
                    'Giải thích các câu hỏi phổ biến về cây sâm, tuổi cây và ứng dụng.',
                body: '— iWE FARM — “Gieo mầm giá trị thật”.',
                status: 'published',
                sortOrder: 3,
            },
        ],
        cultivationGardens: [
            {
                code: 'garden-main',
                name: 'Vườn chính',
                status: 'active',
                totalBeds: 129,
                activeBeds: 129,
                totalTrees: 40459,
                metadata: { source: 'dashboard summary' },
            },
        ],
        cultivationBeds: [
            {
                code: 'bed-01',
                gardenCode: 'garden-main',
                name: 'Luống 01',
                ageYear: 1,
                treeCount: 6454,
                status: 'active',
                metadata: {},
            },
            {
                code: 'bed-02',
                gardenCode: 'garden-main',
                name: 'Luống 02',
                ageYear: 2,
                treeCount: 20644,
                status: 'active',
                metadata: {},
            },
            {
                code: 'bed-03',
                gardenCode: 'garden-main',
                name: 'Luống 03',
                ageYear: 3,
                treeCount: 13164,
                status: 'active',
                metadata: {},
            },
        ],
        cultivationTrees: [
            {
                code: 'tree-1y-main',
                bedCode: 'bed-01',
                name: 'Cây 1 năm tuổi',
                ageYear: 1,
                quantity: 6454,
                status: 'available',
                metadata: {},
            },
            {
                code: 'tree-2y-main',
                bedCode: 'bed-02',
                name: 'Cây 2 năm tuổi',
                ageYear: 2,
                quantity: 20644,
                status: 'available',
                metadata: {},
            },
        ],
        walletAccounts: [
            {
                balancePoint: 0,
                treesOwned: 27478,
                transferEnabled: true,
                metadata: { source: 'wallet summary' },
            },
        ],
        walletTransactions: [
            {
                code: 'txn-001',
                type: 'credit',
                title: 'Nạp điểm từ giao dịch thành công',
                amount: 1000000,
                balanceAfter: 1000000,
                status: 'success',
                metadata: {},
            },
        ],
        orders: [
            {
                code: 'ORD1784128470037624',
                status: 'cancelled',
                currency: 'VND',
                subtotal: 1162894,
                shippingFee: 72822,
                discount: 0,
                total: 1235716,
                paymentMethod: 'bank_transfer',
                items: [
                    {
                        code: 'plant-3y',
                        name: 'Cây Sâm Ngọc Linh 3 năm',
                        quantity: 1,
                        price: 1162894,
                    },
                ],
                metadata: {},
            },
            {
                code: 'ORD1782144180315818',
                status: 'cancelled',
                currency: 'VND',
                subtotal: 1276000,
                shippingFee: 102080,
                discount: 0,
                total: 1378080,
                paymentMethod: 'bank_transfer',
                items: [
                    {
                        code: 'product-shampoo',
                        name: 'Dầu gội thảo dược Sâm Ngọc Linh',
                        quantity: 4,
                        price: 319000,
                    },
                ],
                metadata: {},
            },
        ],
        businessProfile: {
            fullName: 'CÔNG TY CỔ PHẦN DƯỢC LIỆU TRÀ LINH',
            referralCode: '90N9DT',
            rank: 'Hạng Đồng',
            phone: '0847 234 234',
            gender: 'female',
            verified: true,
            metadata: { source: 'iwefarm.com.vn/profile' },
        },
    },
    [EnumAppEnvironment.development]: undefined as never,
    [EnumAppEnvironment.staging]: undefined as never,
    [EnumAppEnvironment.production]: undefined as never,
};

migrationBusinessData[EnumAppEnvironment.development] =
    migrationBusinessData[EnumAppEnvironment.local];
migrationBusinessData[EnumAppEnvironment.staging] =
    migrationBusinessData[EnumAppEnvironment.local];
migrationBusinessData[EnumAppEnvironment.production] =
    migrationBusinessData[EnumAppEnvironment.local];
