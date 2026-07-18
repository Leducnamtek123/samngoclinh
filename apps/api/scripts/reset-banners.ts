import { PrismaClient } from '../generated/prisma-client/index.js';

async function run() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('Connected to Prisma successfully.');
    
    const keysToDelete = [
      'homepage_banner_image_1',
      'homepage_banner_image_2',
      'homepage_banner_image_3',
      'homepage_banner_image_4',
      'homepage_banner_image_5',
      'about_banner_image',
      'news_banner_image',
      'campaigns_banner_image'
    ];

    const result = await prisma.systemSetting.deleteMany({
      where: {
        key: {
          in: keysToDelete
        }
      }
    });

    console.log(`Deleted ${result.count} banner settings from the database.`);
  } catch (error) {
    console.error('Error resetting database banner settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
