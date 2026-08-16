const { PrismaClient } = require('../generated/prisma-client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function run() {
  console.log('🚀 NẠP TOÀN BỘ MẪU HTML CHUẨN VÀO HỢP ĐỒNG CTR-SNL-2026/7090...');

  // 1. Đọc file HTML mẫu pháp lý chuẩn
  const templatePath = path.resolve(__dirname, '../../../templates/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Không tìm thấy file mẫu:', templatePath);
    return;
  }
  const rawHtml = fs.readFileSync(templatePath, 'utf-8');
  console.log('✅ Đã đọc mã HTML mẫu hợp đồng (' + rawHtml.length + ' bytes)');

  // 2. Tìm hợp đồng của leducnamtek123@gmail.com
  const user = await prisma.user.findFirst({
    where: { email: 'leducnamtek123@gmail.com' },
  });

  if (!user) {
    console.error('Không tìm thấy user leducnamtek123@gmail.com');
    return;
  }

  const contract = await prisma.eContract.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  if (!contract) {
    console.error('Không tìm thấy hợp đồng của user');
    return;
  }

  console.log('Tìm thấy hợp đồng:', contract.code, '(ID:', contract.id + ')');

  // 3. Cập nhật content với toàn bộ mã HTML chuẩn
  const updated = await prisma.eContract.update({
    where: { id: contract.id },
    data: {
      content: rawHtml,
      metadata: {
        ...(contract.metadata || {}),
        customerName: 'Đức Nam Lê',
        cccd: '049090001234',
        phone: '0901234567',
        customerPhone: '0901234567',
        email: 'leducnamtek123@gmail.com',
        customerEmail: 'leducnamtek123@gmail.com',
        address: '123 Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng',
        careFee: 4500000,
        totalPlants: 1,
        templateVariables: {
          TEN_KHACH_HANG: 'Đức Nam Lê',
          CCCD_MST: '049090001234',
          SO_DIEN_THOAI: '0901234567',
          EMAIL: 'leducnamtek123@gmail.com',
          DIA_CHI: '123 Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng',
          MA_HOP_DONG: contract.code,
          SO_LUONG_CAY: '1',
          SO_LUONG_CAY_CHU: '01 cây sâm',
          TONG_GIA_TRI: '45.000.000 VNĐ',
          TONG_GIA_TRI_CHU: 'Bốn mươi lăm triệu đồng chẵn',
          PHI_CHAM_SOC: '4.500.000 VNĐ',
          PHI_CHAM_SOC_CHU: 'Bốn triệu năm trăm nghìn đồng',
          NGAY_KY: '17/08/2026',
          NGAY_HET_HAN: '15/08/2028',
          DAI_DIEN_BEN_A: 'CÔNG TY CỔ PHẦN SÂM NGỌC LINH NAM TRÀ MY',
          TEN_VUON: 'Vườn Sâm Nam Trà My (Kon Tum - Quảng Nam)',
          MA_LUONG: 'Luống BED-A05',
        },
      },
    },
  });

  console.log('✅ Đã nạp thành công mẫu HTML vào hợp đồng:');
  console.log({
    id: updated.id,
    code: updated.code,
    contentLength: updated.content?.length,
    status: updated.status,
    customerName: 'Đức Nam Lê',
  });
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
