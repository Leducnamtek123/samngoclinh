const { PrismaClient } = require('../generated/prisma-client');
const prisma = new PrismaClient();

async function run() {
  console.log('===============================================================');
  console.log('🚀 THIẾT LẬP DỮ LIỆU THỰC TẾ CHO TÀI KHOẢN: leducnamtek123@gmail.com');
  console.log('===============================================================\n');

  console.log('--- 1. Kiểm tra tài khoản mẫu user@mail.com ---');
  const sampleUser = await prisma.user.findFirst({
    where: { email: 'user@mail.com' },
    include: { role: true },
  });

  if (!sampleUser) {
    console.error('Không tìm thấy tài khoản user@mail.com');
    return;
  }
  console.log('✅ Tìm thấy tài khoản mẫu:', {
    id: sampleUser.id,
    email: sampleUser.email,
    name: sampleUser.name,
    role: sampleUser.role?.name,
    hasPassword: !!sampleUser.password,
  });

  console.log('\n--- 2. Tạo / Đồng bộ tài khoản leducnamtek123@gmail.com ---');
  let targetUser = await prisma.user.findFirst({
    where: { email: 'leducnamtek123@gmail.com' },
    include: { role: true },
  });

  if (!targetUser) {
    console.log('Tạo mới tài khoản leducnamtek123@gmail.com với cùng mật khẩu của user@mail.com...');
    targetUser = await prisma.user.create({
      data: {
        email: 'leducnamtek123@gmail.com',
        username: 'leducnamtek123',
        name: 'Đức Nam Lê',
        roleId: sampleUser.roleId,
        password: sampleUser.password, // Mật khẩu thực tế giống user@mail.com
        passwordExpired: sampleUser.passwordExpired,
        passwordCreated: new Date(),
        status: 'active',
        isVerified: true,
        verifiedAt: new Date(),
        countryId: sampleUser.countryId,
        signUpFrom: sampleUser.signUpFrom,
        signUpWith: sampleUser.signUpWith,
        termPolicy: sampleUser.termPolicy || {},
      },
      include: { role: true },
    });
    console.log('✅ Đã tạo tài khoản leducnamtek123@gmail.com thành công (ID: ' + targetUser.id + ')');
  } else {
    console.log('Tài khoản leducnamtek123@gmail.com đã tồn tại, đồng bộ mật khẩu giống user@mail.com...');
    targetUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        password: sampleUser.password, // Đồng bộ mật khẩu giống user@mail.com
        status: 'active',
        isVerified: true,
      },
      include: { role: true },
    });
    console.log('✅ Đã đồng bộ mật khẩu cho leducnamtek123@gmail.com');
  }

  console.log('\n--- 3. Thiết lập Chữ ký số tập trung trong Vault cho leducnamtek123@gmail.com ---');
  // Chữ ký nét viết tay thực tế phong cách nghệ thuật
  const sampleSignatureUrl = 'https://res.cloudinary.com/demo/image/upload/signatures/sig-ducnam-samngoclinh.png';
  await prisma.userSignature.upsert({
    where: { userId: targetUser.id },
    create: {
      userId: targetUser.id,
      signatureUrl: sampleSignatureUrl,
    },
    update: {
      signatureUrl: sampleSignatureUrl,
    },
  });
  console.log('✅ Đã lưu trữ Chữ ký số trong Vault:', sampleSignatureUrl);

  console.log('\n--- 4. Khởi tạo Hợp đồng Bản Nháp (draft) trên Database thật ---');
  // Tìm hoặc tạo cây sâm trong vườn
  let tree = await prisma.cultivationTree.findFirst({
    where: { status: 'active' },
  });

  const contractCode = `CTR-SNL-${new Date().getFullYear()}/${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const contract = await prisma.eContract.create({
    data: {
      code: contractCode,
      title: `Hợp đồng Mua bán & Ủy quyền Chăm sóc Cây Sâm Ngọc Linh #${contractCode}`,
      userId: targetUser.id,
      status: 'draft', // BẢN NHÁP: Đang chờ BQL phát hành
      contractValue: 45000000,
      paymentStatus: 'paid',
      content: 'HỢP ĐỒNG MUA BÁN & ỦY QUYỀN CHĂM SÓC CÂY SÂM NGỌC LINH\n\nCăn cứ nhu cầu và thỏa thuận giữa Công ty Cổ phần Sâm Ngọc Linh và Quý khách hàng...',
      signedAt: null,
      expiredAt: new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000),
      contractType: 'purchase_and_care',
      partyA: 'CÔNG TY CỔ PHẦN SÂM NGỌC LINH NAM TRÀ MY',
      partyB: `${targetUser.name} (Email: ${targetUser.email}, SĐT: 0901234567, CCCD: 049090001234)`,
      terms: 'Điều khoản bảo hiểm sinh trưởng 100% và bảo hành thu hoạch tại vườn Trà Linh.',
      metadata: {
        customerEmail: targetUser.email,
        customerSignature: sampleSignatureUrl,
        checkoutSigned: true,
        totalPlants: 1,
      },
      items: {
        create: [
          {
            treeId: tree?.id || 'tree-sample-01',
            treeCode: tree?.treeCode || 'SNL-TRALINH-0088',
            treeName: 'Cây Sâm Ngọc Linh 4 năm tuổi (Vườn Nam Trà My)',
            ageYearAtSign: 4,
            gardenCode: 'GD-NAMTRAMY-01',
            bedCode: 'BED-A05',
            unitPrice: 45000000,
          },
        ],
      },
    },
    include: { items: true },
  });

  console.log('\n===============================================================');
  console.log('🎉 THIẾT LẬP DỮ LIỆU TEST THỰC TẾ HOÀN TẤT!');
  console.log('===============================================================');
  console.log('👤 Tài khoản khách hàng:');
  console.log('   - Email:    leducnamtek123@gmail.com');
  console.log('   - Mật khẩu: [GIỐNG MẬT KHẨU CỦA user@mail.com]');
  console.log('   - Chữ ký:   Đã lưu trong Kho Chữ ký số Vault');
  console.log('\n📄 Hợp đồng Bản nháp mới tạo:');
  console.log('   - Mã HĐ:     ' + contract.code);
  console.log('   - Tiêu đề:   ' + contract.title);
  console.log('   - Trạng thái: ' + contract.status + ' (Chờ BQL phát hành)');
  console.log('   - Giá trị:   ' + Number(contract.contractValue).toLocaleString('vi-VN') + ' VNĐ');
  console.log('   - Cây sâm:   ' + contract.items[0].treeName + ' [' + contract.items[0].treeCode + ']');
  console.log('===============================================================\n');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
