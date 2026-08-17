const { PrismaClient } = require('../generated/prisma-client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function seed() {
  const htmlPath = path.resolve(__dirname, '../../../templates/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh.html');
  if (fs.existsSync(htmlPath)) {
    const content = fs.readFileSync(htmlPath, 'utf-8');
    await prisma.eContract.update({
      where: { code: 'CTR-SNL-2026/7191' },
      data: { content: content }
    });
    console.log('✅ Đã cập nhật 22KB HTML đầy đủ 11 Điều khoản cho CTR-SNL-2026/7191');
  }
}
seed().finally(() => prisma.$disconnect());
