import { PrismaClient } from '../generated/prisma-client/index.js';
import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
// Load env variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(localPath: string): Promise<string> {
  const absPath = path.join(__dirname, '..', '..', 'web', 'public', localPath);
  
  if (!fs.existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }

  console.log(`Uploading ${localPath} to Cloudinary...`);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      absPath,
      {
        folder: 'banners',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(`Uploaded successfully: ${result?.secure_url}`);
          resolve(result?.secure_url || '');
        }
      }
    );
  });
}

async function run(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('Connected to Prisma successfully.');
    
    // Clear existing banners
    await prisma.banner.deleteMany({});
    console.log('Cleared existing banners.');

    // Upload local assets to Cloudinary and retrieve URLs
    const homeUrl1 = await uploadToCloudinary('/images/banners/homepage_banner_1.png');
    const homeUrl2 = await uploadToCloudinary('/images/banners/homepage_banner_2.png');
    const homeUrl3 = await uploadToCloudinary('/images/banners/homepage_banner_3.png');
    const homeUrl4 = await uploadToCloudinary('/images/banners/homepage_banner_4.png');
    const homeUrl5 = await uploadToCloudinary('/images/banners/homepage_banner_5.png');
    
    const aboutUrl = await uploadToCloudinary('/images/banners/about_banner.png');
    const newsUrl = await uploadToCloudinary('/images/banners/news_banner.png');
    const campaignsUrl = await uploadToCloudinary('/images/banners/campaigns_banner.png');

    // Seed banners into PostgreSQL
    const banners = [
      // Homepage banners
      {
        pageKey: 'home',
        title: 'SÂM NGỌC LINH KON TUM',
        subtitle: 'Báu vật của đại ngàn, thần dược của sức khỏe.',
        image: homeUrl1,
        order: 1,
      },
      {
        pageKey: 'home',
        title: 'QUỐC BẢO SÂM NGỌC LINH',
        subtitle: 'Tinh hoa đất trời Kon Tum, nâng tầm sức khỏe Việt.',
        image: homeUrl2,
        order: 2,
      },
      {
        pageKey: 'home',
        title: 'RƯỢU SÂM NGỌC LINH',
        subtitle: 'Hương vị thượng hạng, xứng tầm đẳng cấp.',
        image: homeUrl3,
        order: 3,
      },
      {
        pageKey: 'home',
        title: 'NÔNG TRẠI SÂM NGỌC LINH',
        subtitle: 'Quy trình trồng trọt khép kín đạt tiêu chuẩn hữu cơ tốt nhất.',
        image: homeUrl4,
        order: 4,
      },
      {
        pageKey: 'home',
        title: 'HỢP TÁC KÝ GỬI SÂM',
        subtitle: 'Kiến tạo giá trị bền vững cùng người tiêu dùng và nhà vườn.',
        image: homeUrl5,
        order: 5,
      },
      // About Page banner
      {
        pageKey: 'about',
        title: 'Về Chúng Tôi',
        subtitle: 'Hành trình gìn giữ và phát triển sâm Ngọc Linh Kon Tum.',
        image: aboutUrl,
        order: 1,
      },
      // News Page banner
      {
        pageKey: 'news',
        title: 'Tin Tức & Sự Kiện',
        subtitle: 'Cập nhật những hoạt động mới nhất về sâm Ngọc Linh Kon Tum.',
        image: newsUrl,
        order: 1,
      },
      // Campaigns Page banner
      {
        pageKey: 'campaigns',
        title: 'Khuyến Mãi & Ưu Đãi',
        subtitle: 'Các chương trình quà tặng đặc biệt dành cho khách hàng thân thiết.',
        image: campaignsUrl,
        order: 1,
      },
      // Products Page banner (Cửa hàng)
      {
        pageKey: 'products',
        title: 'Sản Phẩm Rượu Sâm Ngọc Linh',
        subtitle: 'Khám phá danh mục sản phẩm rượu sâm Ngọc Linh nguyên cây, nguyên củ và các chế phẩm sâm cao cấp khác.',
        image: homeUrl3,
        order: 1,
      },
      // Ginseng Page banner (Trồng sâm)
      {
        pageKey: 'ginseng',
        title: 'Trồng Sâm Cùng Rượu Sâm Ngọc Linh',
        subtitle: 'Trải nghiệm mô hình trồng sâm cùng Rượu Sâm Ngọc Linh qua nền tảng công nghệ số. Kiến tạo giá trị bền vững với những củ Sâm Ngọc Linh minh bạch nguồn gốc và đạt chuẩn chất lượng tuyệt đối.',
        image: homeUrl4,
        order: 1,
      },
    ];

    for (const banner of banners) {
      await prisma.banner.create({
        data: banner,
      });
    }

    console.log(`Seeded ${banners.length} Cloudinary banners into the database.`);
  } catch (error) {
    console.error('Error resetting database banner settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
