import { PrismaClient } from '../generated/prisma-client';
import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

// Load env variables
dotenv.config();

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(localPath: string): Promise<string> {
  const absPath = path.join(__dirname, '..', '..', 'web', 'public', localPath);
  
  if (!fs.existsSync(absPath)) {
    console.warn(`File not found: ${absPath}, using default placeholder image.`);
    return 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
  }

  try {
    console.log(`Uploading ${localPath} to Cloudinary...`);
    const result = await cloudinary.uploader.upload(absPath, {
      folder: 'seed_assets',
      resource_type: 'image',
    });
    console.log(`Uploaded successfully: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${localPath} to Cloudinary:`, error);
    return 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
  }
}

async function main(): Promise<void> {
  console.log('--- Starting Business Data Seeding Script with Cloudinary Assets ---');

  // Upload Assets
  console.log('Uploading images to Cloudinary...');
  const ginsengUrl = await uploadToCloudinary('/images/kon_tum_ginseng.png');
  const wineUrl = await uploadToCloudinary('/images/banners/homepage_banner_3.png');
  const honeyUrl = await uploadToCloudinary('/images/news/news1.png');
  const teaUrl = await uploadToCloudinary('/images/news/news2.png');
  const avatarHaUrl = await uploadToCloudinary('/images/news/news3.png');
  const avatarTuanUrl = await uploadToCloudinary('/images/news/news4.png');
  const kycFrontUrl = await uploadToCloudinary('/images/banners/homepage_banner_4.png');
  const kycBackUrl = await uploadToCloudinary('/images/banners/homepage_banner_5.png');

  // 1. Ensure Roles exist
  console.log('Ensuring roles exist...');
  await prisma.role.upsert({
    where: { name: 'superAdmin' },
    update: {},
    create: { name: 'superAdmin', type: 'superAdmin', description: 'Super Administrator' }
  });
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', type: 'admin', description: 'Administrator' }
  });
  const providerRole = await prisma.role.upsert({
    where: { name: 'provider' },
    update: {},
    create: { name: 'provider', type: 'provider', description: 'Ginseng Grower Partner' }
  });
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user', type: 'user', description: 'Regular Customer' }
  });

  // 2. Ensure Country exists
  console.log('Ensuring default country exists...');
  const vietnam = await prisma.country.upsert({
    where: { alpha2Code: 'VN' },
    update: {},
    create: {
      name: 'Vietnam',
      alpha2Code: 'VN',
      alpha3Code: 'VNM',
      phoneCode: ['84'],
      continent: 'Asia',
      timezone: 'Asia/Ho_Chi_Minh'
    }
  });

  // 3. Ensure Mock Users exist
  console.log('Ensuring mock users exist...');
  const mockUsersData = [
    {
      username: 'admin_linh',
      email: 'admin@samngoclinh.vn',
      name: 'Nguyễn Văn Linh (Admin)',
      roleId: adminRole.id,
      status: 'active' as const,
      avatarUrl: avatarHaUrl
    },
    {
      username: 'provider_ha',
      email: 'ha.nguyen@ngoclinhfarm.com',
      name: 'Nguyễn Thanh Hà (Nhà Vườn Trà Linh)',
      roleId: providerRole.id,
      status: 'active' as const,
      avatarUrl: avatarHaUrl
    },
    {
      username: 'provider_tuan',
      email: 'tuan.tran@gialaiplants.vn',
      name: 'Trần Anh Tuấn (Nhà Vườn Mang Yang)',
      roleId: providerRole.id,
      status: 'active' as const,
      avatarUrl: avatarTuanUrl
    },
    {
      username: 'customer_minh',
      email: 'minh.hoang@gmail.com',
      name: 'Hoàng Quốc Minh',
      roleId: userRole.id,
      status: 'active' as const,
      avatarUrl: avatarTuanUrl
    },
    {
      username: 'customer_vy',
      email: 'vy.le@yahoo.com',
      name: 'Lê Thảo Vy',
      roleId: userRole.id,
      status: 'active' as const,
      avatarUrl: avatarHaUrl
    },
    {
      username: 'customer_duc',
      email: 'duc.pham@outlook.com',
      name: 'Phạm Minh Đức',
      roleId: userRole.id,
      status: 'active' as const,
      avatarUrl: avatarTuanUrl
    }
  ];

  const seededUsers = [];
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('aaAA@123', salt);

  for (const u of mockUsersData) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {
        name: u.name,
        roleId: u.roleId,
        password: passwordHash,
        termPolicy: {
          cookies: false,
          marketing: false,
          privacy: true,
          termsOfService: true
        }
      },
      create: {
        username: u.username,
        email: u.email,
        name: u.name,
        roleId: u.roleId,
        isVerified: true,
        status: u.status,
        countryId: vietnam.id,
        signUpFrom: 'system',
        signUpWith: 'credential',
        termPolicy: {
          cookies: false,
          marketing: false,
          privacy: true,
          termsOfService: true
        },
        password: passwordHash
      }
    });
    seededUsers.push(user);

    // Business Profile
    await prisma.businessProfile.upsert({
      where: { userId: user.id },
      update: { avatarUrl: u.avatarUrl },
      create: {
        userId: user.id,
        fullName: user.name || 'User Profile',
        referralCode: `REF-${user.username.toUpperCase()}`,
        rank: 'Gold',
        verified: true,
        avatarUrl: u.avatarUrl
      }
    });

    // Wallet Account
    await prisma.walletAccount.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        balancePoint: 25000000,
        treesOwned: 5
      }
    });
  }

  const providerHa = seededUsers.find(u => u.username === 'provider_ha')!;
  const providerTuan = seededUsers.find(u => u.username === 'provider_tuan')!;
  const customerMinh = seededUsers.find(u => u.username === 'customer_minh')!;
  const customerVy = seededUsers.find(u => u.username === 'customer_vy')!;
  const customerDuc = seededUsers.find(u => u.username === 'customer_duc')!;

  // 4. Ensure Care & Protection Packages exist
  console.log('Ensuring care and protection packages exist...');
  const carePackages = [
    { code: 'CARE-STD', name: 'Chăm sóc Tiêu chuẩn', price: 150000, durationMonths: 12, description: 'Gói chăm sóc định kỳ cơ bản: tưới nước, bón phân hữu cơ.' },
    { code: 'CARE-PREM', name: 'Chăm sóc Cao cấp', price: 300000, durationMonths: 12, description: 'Gói chăm sóc cao cấp: tưới tự động, phân vi sinh, theo dõi IoT 24/7.' },
    { code: 'CARE-GOLD', name: 'Chăm sóc Hoàng Gia', price: 500000, durationMonths: 12, description: 'Gói chăm sóc đặc biệt: kỹ sư nông nghiệp theo dõi riêng, tối ưu hóa dưỡng chất.' }
  ];
  for (const cp of carePackages) {
    await prisma.carePackage.upsert({
      where: { code: cp.code },
      update: { name: cp.name, price: cp.price, description: cp.description },
      create: cp
    });
  }

  const protectionPackages = [
    { code: 'PROT-BASIC', name: 'Bảo vệ Cơ bản', price: 80000, coverage: 'Bảo hiểm sâu bệnh nhẹ và thời tiết', description: 'Thay thế cây non nếu cây cũ chết do dịch bệnh thông thường.' },
    { code: 'PROT-FULL', name: 'Bảo vệ Toàn diện', price: 200000, coverage: 'Bảo hiểm mọi rủi ro thiên tai và sâu bệnh', description: 'Đền bù cây sâm mới có cùng độ tuổi nếu xảy ra sự cố thiên tai.' }
  ];
  for (const pp of protectionPackages) {
    await prisma.protectionPackage.upsert({
      where: { code: pp.code },
      update: { name: pp.name, price: pp.price, description: pp.description },
      create: pp
    });
  }

  // 5. Ensure Gardens exist (at least 5)
  console.log('Ensuring gardens exist...');
  const gardensData = [
    { code: 'GD-TRALINH-01', name: 'Vườn sâm Trà Linh 01', ownerUserId: providerHa.id, status: 'active', totalBeds: 12, activeBeds: 10, totalTrees: 150 },
    { code: 'GD-TRALINH-02', name: 'Vườn sâm Trà Linh 02', ownerUserId: providerHa.id, status: 'active', totalBeds: 8, activeBeds: 6, totalTrees: 80 },
    { code: 'GD-MANGYANG-01', name: 'Vườn sâm Mang Yang Gia Lai', ownerUserId: providerTuan.id, status: 'active', totalBeds: 15, activeBeds: 12, totalTrees: 200 },
    { code: 'GD-DAKLAK-01', name: 'Vườn sâm Buôn Đôn', ownerUserId: providerTuan.id, status: 'active', totalBeds: 10, activeBeds: 8, totalTrees: 110 },
    { code: 'GD-KONTUM-03', name: 'Vườn sâm Đăk Tô Kontum', ownerUserId: providerHa.id, status: 'active', totalBeds: 20, activeBeds: 18, totalTrees: 350 }
  ];
  for (const g of gardensData) {
    await prisma.cultivationGarden.upsert({
      where: { code: g.code },
      update: { name: g.name, ownerUserId: g.ownerUserId, status: g.status, totalBeds: g.totalBeds, activeBeds: g.activeBeds, totalTrees: g.totalTrees },
      create: g
    });
  }

  // 6. Ensure Beds exist (at least 5)
  console.log('Ensuring beds exist...');
  const bedsData = [
    { code: 'B-TL01-01', gardenCode: 'GD-TRALINH-01', name: 'Luống 01 - Trà Linh A', ageYear: 3, treeCount: 30, status: 'active', ownerUserId: providerHa.id },
    { code: 'B-TL01-02', gardenCode: 'GD-TRALINH-01', name: 'Luống 02 - Trà Linh A', ageYear: 4, treeCount: 40, status: 'active', ownerUserId: providerHa.id },
    { code: 'B-TL02-01', gardenCode: 'GD-TRALINH-02', name: 'Luống 01 - Trà Linh B', ageYear: 5, treeCount: 25, status: 'active', ownerUserId: providerHa.id },
    { code: 'B-MY01-01', gardenCode: 'GD-MANGYANG-01', name: 'Luống 01 - Gia Lai', ageYear: 6, treeCount: 50, status: 'active', ownerUserId: providerTuan.id },
    { code: 'B-MY01-02', gardenCode: 'GD-MANGYANG-01', name: 'Luống 02 - Gia Lai', ageYear: 2, treeCount: 60, status: 'active', ownerUserId: providerTuan.id },
    { code: 'B-DL01-01', gardenCode: 'GD-DAKLAK-01', name: 'Luống 01 - Đăk Lăk', ageYear: 3, treeCount: 35, status: 'active', ownerUserId: providerTuan.id }
  ];
  for (const b of bedsData) {
    await prisma.cultivationBed.upsert({
      where: { code: b.code },
      update: { name: b.name, gardenCode: b.gardenCode, ageYear: b.ageYear, treeCount: b.treeCount, ownerUserId: b.ownerUserId },
      create: b
    });
  }

  // 7. Ensure Cultivation Trees exist (at least 5)
  console.log('Ensuring trees exist...');
  const treesData = [
    { code: 'TR-SN-001', name: 'Sâm Ngọc Linh 3 tuổi', ageYear: 3, quantity: 30, status: 'active', bedCode: 'B-TL01-01', ownerUserId: customerMinh.id, carePackageCode: 'CARE-STD', protectionPackageCode: 'PROT-BASIC', healthStatus: 'healthy' },
    { code: 'TR-SN-002', name: 'Sâm Ngọc Linh Đắc Tô 4 tuổi', ageYear: 4, quantity: 40, status: 'active', bedCode: 'B-TL01-02', ownerUserId: customerVy.id, carePackageCode: 'CARE-PREM', protectionPackageCode: 'PROT-FULL', healthStatus: 'healthy' },
    { code: 'TR-SN-003', name: 'Cây giống sâm Trà Linh 5 tuổi', ageYear: 5, quantity: 25, status: 'active', bedCode: 'B-TL02-01', ownerUserId: customerDuc.id, carePackageCode: 'CARE-GOLD', protectionPackageCode: 'PROT-FULL', healthStatus: 'sick' },
    { code: 'TR-SN-004', name: 'Sâm Mang Yang 6 tuổi', ageYear: 6, quantity: 50, status: 'active', bedCode: 'B-MY01-01', ownerUserId: customerMinh.id, carePackageCode: 'CARE-PREM', protectionPackageCode: 'PROT-BASIC', healthStatus: 'healthy' },
    { code: 'TR-SN-005', name: 'Sâm con giống Gia Lai 2 tuổi', ageYear: 2, quantity: 60, status: 'active', bedCode: 'B-MY01-02', ownerUserId: customerVy.id, carePackageCode: 'CARE-STD', protectionPackageCode: 'PROT-BASIC', healthStatus: 'healthy' },
    { code: 'TR-SN-006', name: 'Sâm Ngọc Linh Trà Linh 3 tuổi', ageYear: 3, quantity: 15, status: 'active', bedCode: 'B-TL01-01', ownerUserId: customerVy.id, carePackageCode: 'CARE-PREM', protectionPackageCode: 'PROT-FULL', healthStatus: 'healthy' },
    { code: 'TR-SN-007', name: 'Sâm Trà Linh 4 tuổi', ageYear: 4, quantity: 20, status: 'active', bedCode: 'B-TL01-01', ownerUserId: customerDuc.id, carePackageCode: 'CARE-GOLD', protectionPackageCode: 'PROT-FULL', healthStatus: 'sick' },
    { code: 'TR-SN-008', name: 'Sâm Đăk Tô 3 tuổi', ageYear: 3, quantity: 10, status: 'active', bedCode: 'B-TL01-02', ownerUserId: customerMinh.id, carePackageCode: 'CARE-STD', protectionPackageCode: 'PROT-BASIC', healthStatus: 'dead' },
    { code: 'TR-SN-009', name: 'Sâm Trà Linh 3 tuổi VIP', ageYear: 3, quantity: 22, status: 'active', bedCode: 'B-TL02-01', ownerUserId: customerMinh.id, carePackageCode: 'CARE-PREM', protectionPackageCode: 'PROT-FULL', healthStatus: 'healthy' },
    { code: 'TR-SN-010', name: 'Sâm Gia Lai 5 tuổi', ageYear: 5, quantity: 18, status: 'active', bedCode: 'B-MY01-01', ownerUserId: customerDuc.id, carePackageCode: 'CARE-GOLD', protectionPackageCode: 'PROT-FULL', healthStatus: 'sick' },
    { code: 'TR-SN-011', name: 'Sâm Mang Yang 2 tuổi', ageYear: 2, quantity: 35, status: 'active', bedCode: 'B-MY01-02', ownerUserId: customerMinh.id, carePackageCode: 'CARE-STD', protectionPackageCode: 'PROT-BASIC', healthStatus: 'healthy' },
    { code: 'TR-SN-012', name: 'Sâm Đăk Lăk 3 tuổi', ageYear: 3, quantity: 45, status: 'active', bedCode: 'B-DL01-01', ownerUserId: customerVy.id, carePackageCode: 'CARE-PREM', protectionPackageCode: 'PROT-FULL', healthStatus: 'healthy' },
    { code: 'TR-SN-013', name: 'Sâm Đăk Lăk 4 tuổi', ageYear: 4, quantity: 30, status: 'active', bedCode: 'B-DL01-01', ownerUserId: customerMinh.id, carePackageCode: 'CARE-STD', protectionPackageCode: 'PROT-BASIC', healthStatus: 'sick' },
    { code: 'TR-SN-014', name: 'Sâm Đăk Lăk 2 tuổi', ageYear: 2, quantity: 25, status: 'active', bedCode: 'B-DL01-01', ownerUserId: customerDuc.id, carePackageCode: 'CARE-GOLD', protectionPackageCode: 'PROT-FULL', healthStatus: 'dead' }
  ];
  for (const t of treesData) {
    await prisma.cultivationTree.upsert({
      where: { code: t.code },
      update: { name: t.name, ageYear: t.ageYear, quantity: t.quantity, status: t.status, bedCode: t.bedCode, ownerUserId: t.ownerUserId, carePackageCode: t.carePackageCode, protectionPackageCode: t.protectionPackageCode, healthStatus: t.healthStatus },
      create: {
        code: t.code,
        name: t.name,
        ageYear: t.ageYear,
        quantity: t.quantity,
        status: t.status,
        bedCode: t.bedCode,
        ownerUserId: t.ownerUserId,
        carePackageCode: t.carePackageCode,
        carePackageExpiredAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        protectionPackageCode: t.protectionPackageCode,
        protectionPackageExpiredAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        healthStatus: t.healthStatus
      }
    });
  }

  // 8. Ensure EContracts exist (at least 5)
  console.log('Ensuring contracts exist...');
  const contractsData = [
    { code: 'CTR-2026-001', userId: customerMinh.id, treeCode: 'TR-SN-001', title: 'Hợp đồng Ký gửi và Chăm sóc Sâm Ngọc Linh - Minh', content: 'Nội dung hợp đồng thỏa thuận ký gửi sâm Ngọc Linh tại vườn Trà Linh...', status: 'signed', contractValue: 12000000, paymentStatus: 'paid' },
    { code: 'CTR-2026-002', userId: customerVy.id, treeCode: 'TR-SN-002', title: 'Hợp đồng Sở hữu cây sâm 4 tuổi - Vy', content: 'Hợp đồng bảo chứng quyền sở hữu và bảo vệ toàn diện cây giống sâm...', status: 'signed', contractValue: 24000000, paymentStatus: 'paid' },
    { code: 'CTR-2026-003', userId: customerDuc.id, treeCode: 'TR-SN-003', title: 'Hợp đồng Liên kết đầu tư sâm giống Trà Linh - Đức', content: 'Hợp đồng hợp tác đầu tư và phân chia lợi nhuận nông sản sâm giống...', status: 'signed', contractValue: 35000000, paymentStatus: 'paid' },
    { code: 'CTR-2026-004', userId: customerMinh.id, treeCode: 'TR-SN-004', title: 'Hợp đồng Khai thác sâm 6 tuổi Mang Yang - Minh', content: 'Hợp đồng chuyển nhượng quyền khai thác và tiêu thụ dược liệu sâm...', status: 'pending', contractValue: 50000000, paymentStatus: 'unpaid' },
    { code: 'CTR-2026-005', userId: customerVy.id, treeCode: 'TR-SN-005', title: 'Hợp đồng Chăm sóc sâm con giống Gia Lai - Vy', content: 'Hợp đồng dịch vụ nông nghiệp chăm sóc đặc biệt sâm con giống giống...', status: 'pending', contractValue: 8000000, paymentStatus: 'unpaid' }
  ];
  for (const c of contractsData) {
    await prisma.eContract.upsert({
      where: { code: c.code },
      update: { userId: c.userId, treeCode: c.treeCode, title: c.title, status: c.status, contractValue: c.contractValue, paymentStatus: c.paymentStatus },
      create: {
        code: c.code,
        userId: c.userId,
        treeCode: c.treeCode,
        title: c.title,
        content: c.content,
        status: c.status,
        signedAt: c.status === 'signed' ? new Date() : null,
        expiredAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        contractValue: c.contractValue,
        paymentStatus: c.paymentStatus
      }
    });
  }

  // 9. Ensure Orders exist (at least 18 scattered orders for stats/charts)
  console.log('Ensuring orders exist...');
  const ordersData = [];
  const startDay = new Date();
  startDay.setDate(startDay.getDate() - 30); // 30 days ago

  const customerPool = [customerMinh.id, customerVy.id, customerDuc.id];
  const statuses = ['completed', 'completed', 'completed', 'pending', 'cancelled'];
  const paymentStatuses = ['paid', 'paid', 'paid', 'pending', 'failed'];

  for (let i = 1; i <= 18; i++) {
    const orderDate = new Date(startDay);
    orderDate.setDate(orderDate.getDate() + Math.floor(i * 1.6)); // scattered over 30 days
    const totalVal = Math.floor(5 + Math.random() * 45) * 1000000; // 5M to 50M VND
    const subtotal = Math.floor(totalVal * 0.95);
    const taxAndShipping = totalVal - subtotal;

    ordersData.push({
      code: `ORD-2026-${String(i).padStart(3, '0')}`,
      userId: customerPool[i % customerPool.length],
      status: statuses[i % statuses.length],
      currency: 'VND',
      subtotal: subtotal,
      shippingFee: taxAndShipping,
      total: totalVal,
      paymentMethod: 'bank_transfer',
      paymentStatus: paymentStatuses[i % paymentStatuses.length],
      deliveryType: 'shipping',
      shippingAddress: '128 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh',
      customerName: 'Khách hàng Demo ' + i,
      customerPhone: '090123456' + (i % 10),
      items: [
        { plantCode: 'PL-01', quantity: 2, price: subtotal / 2, name: 'Sâm Ngọc Linh giống chất lượng cao' }
      ],
      createdAt: orderDate,
      paidAt: paymentStatuses[i % paymentStatuses.length] === 'paid' ? orderDate : null
    });
  }

  for (const o of ordersData) {
    await prisma.order.upsert({
      where: { code: o.code },
      update: { status: o.status, paymentStatus: o.paymentStatus, total: o.total },
      create: o
    });

    if (o.paymentStatus === 'paid') {
      await prisma.walletTransaction.upsert({
        where: { code: `TX-${o.code}` },
        update: { amount: o.total, status: 'success' },
        create: {
          code: `TX-${o.code}`,
          userId: o.userId,
          type: 'deposit',
          title: `Thanh toán đơn hàng ${o.code}`,
          amount: o.total,
          balanceAfter: 25000000,
          status: 'success',
          occurredAt: o.createdAt
        }
      });
    }
  }

  // 10. Ensure GardenBookings exist (at least 5)
  console.log('Ensuring garden bookings exist...');
  const bookingsData = [
    { code: 'BK-001', userId: customerMinh.id, gardenCode: 'GD-TRALINH-01', visitDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), guestCount: 2, contactPhone: '0908887766', status: 'approved' },
    { code: 'BK-002', userId: customerVy.id, gardenCode: 'GD-TRALINH-02', visitDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), guestCount: 4, contactPhone: '0917772233', status: 'pending' },
    { code: 'BK-003', userId: customerDuc.id, gardenCode: 'GD-MANGYANG-01', visitDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), guestCount: 1, contactPhone: '0981112233', status: 'approved' },
    { code: 'BK-004', userId: customerMinh.id, gardenCode: 'GD-DAKLAK-01', visitDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), guestCount: 3, contactPhone: '0908887766', status: 'completed' },
    { code: 'BK-005', userId: customerVy.id, gardenCode: 'GD-KONTUM-03', visitDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), guestCount: 5, contactPhone: '0917772233', status: 'pending' }
  ];
  for (const b of bookingsData) {
    await prisma.gardenBooking.upsert({
      where: { code: b.code },
      update: { visitDate: b.visitDate, status: b.status },
      create: b
    });
  }

  // 11. Ensure Identity Verification Requests exist
  console.log('Ensuring identity verification requests exist...');
  const kycRequests = [
    { code: 'KYC-001', userId: customerMinh.id, fullName: 'Hoàng Quốc Minh', identityNumber: '025689745', status: 'approved', frontImageUrl: kycFrontUrl, backImageUrl: kycBackUrl },
    { code: 'KYC-002', userId: customerVy.id, fullName: 'Lê Thảo Vy', identityNumber: '197548625', status: 'pending', frontImageUrl: kycFrontUrl, backImageUrl: kycBackUrl },
    { code: 'KYC-003', userId: customerDuc.id, fullName: 'Phạm Minh Đức', identityNumber: '289564172', status: 'pending', frontImageUrl: kycFrontUrl, backImageUrl: kycBackUrl }
  ];
  for (const k of kycRequests) {
    await prisma.identityVerificationRequest.upsert({
      where: { code: k.code },
      update: { status: k.status, frontImageUrl: k.frontImageUrl, backImageUrl: k.backImageUrl },
      create: k
    });
  }

  // 12. Ensure Catalog Plants & Products exist
  console.log('Ensuring catalog plants and products exist...');
  const plantsCatalog = [
    { code: 'PL-01', name: 'Sâm giống Ngọc Linh 2 tuổi', ageYear: 2, price: 120000, stock: 1500, status: 'active', description: 'Cây sâm Ngọc Linh giống chính gốc Trà Linh Nam Trà My, được ươm 2 năm tuổi khỏe mạnh, kháng bệnh cao.', images: [ginsengUrl] },
    { code: 'PL-02', name: 'Sâm giống Ngọc Linh 3 tuổi', ageYear: 3, price: 180000, stock: 800, status: 'active', description: 'Cây giống sâm 3 năm tuổi có củ bắt đầu sinh trưởng mạnh, thích hợp trồng đất tơi xốp mùn nhiều.', images: [ginsengUrl, wineUrl] },
    { code: 'PL-03', name: 'Sâm giống Ngọc Linh 4 tuổi', ageYear: 4, price: 280000, stock: 450, status: 'active', description: 'Cây giống sâm 4 năm tuổi khỏe mạnh gieo hạt tự nhiên dưới tán rừng sâu.', images: [ginsengUrl, wineUrl, honeyUrl, teaUrl] }
  ];
  for (const p of plantsCatalog) {
    await prisma.catalogPlant.upsert({
      where: { code: p.code },
      update: { price: p.price, stock: p.stock, images: p.images },
      create: p
    });
  }

  const productsCatalog = [
    { code: 'PROD-01', name: 'Mật ong ngâm Sâm Ngọc Linh', category: 'Sản phẩm chế biến', unit: 'Hũ 200ml', price: 950000, stock: 250, status: 'active', featured: true, images: [honeyUrl, ginsengUrl, wineUrl] },
    { code: 'PROD-02', name: 'Trà sâm Ngọc Linh hòa tan', category: 'Trà & Thảo mộc', unit: 'Hộp 20 gói', price: 350000, stock: 500, status: 'active', featured: true, images: [teaUrl, honeyUrl] },
    { code: 'PROD-03', name: 'Rượu Sâm Ngọc Linh hạ thổ', category: 'Rượu sâm', unit: 'Chai 750ml', price: 2800000, stock: 120, status: 'active', featured: false, images: [wineUrl, ginsengUrl, honeyUrl, teaUrl, avatarHaUrl] }
  ];
  for (const pr of productsCatalog) {
    await prisma.catalogProduct.upsert({
      where: { code: pr.code },
      update: { price: pr.price, stock: pr.stock, images: pr.images },
      create: pr
    });
  }

  // 13. Ensure Bed Locations exist
  console.log('Ensuring bed locations and planting sâm Ngọc Linh...');
  
  // Clear old locations and old unique trees to start fresh!
  const templateTreeCodes = treesData.map(t => t.code);
  await prisma.cultivationBedLocation.deleteMany({});
  await prisma.cultivationTree.deleteMany({
    where: {
      code: {
        notIn: templateTreeCodes
      }
    }
  });

  for (const b of bedsData) {
    const rows = b.code.includes('TL01') ? 8 : 5; // 8 rows for TL01, 5 rows for others
    const cols = 10;
    
    const bedTrees = treesData.filter(t => t.bedCode === b.code);
    
    let plantedCount = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const locCode = `LOC-${b.code}-${r}-${c}`;
        
        let status = 'empty';
        let treeCode: string | null = null;
        
        // 50% chance to plant a tree, 5% inactive, 45% empty
        const rand = Math.random();
        if (rand < 0.50 && bedTrees.length > 0) {
          status = 'planted';
          // Pick a random template tree for this bed
          const tplTree = bedTrees[Math.floor(Math.random() * bedTrees.length)];
          const uniqueTreeCode = `TR-${b.code}-${r}-${c}`;
          
          // Determine health status: 75% healthy, 15% sick, 10% dead
          const randHealth = Math.random();
          const healthStatus = randHealth < 0.75 ? 'healthy' : (randHealth < 0.90 ? 'sick' : 'dead');
          
          // Last care date: 1-5 days ago
          const lastCareDaysAgo = Math.floor(Math.random() * 5) + 1;
          const lastCareDate = new Date(Date.now() - lastCareDaysAgo * 24 * 60 * 60 * 1000);
          
          // Next care date: 1-3 days in future (unless dead)
          const nextCareDate = healthStatus === 'dead' 
            ? null 
            : new Date(Date.now() + (Math.floor(Math.random() * 3) + 1) * 24 * 60 * 60 * 1000);

          // Create unique tree record
          await prisma.cultivationTree.create({
            data: {
              code: uniqueTreeCode,
              name: tplTree.name,
              ageYear: tplTree.ageYear,
              quantity: 1,
              status: 'active',
              bedCode: b.code,
              ownerUserId: tplTree.ownerUserId,
              carePackageCode: tplTree.carePackageCode,
              carePackageExpiredAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              protectionPackageCode: tplTree.protectionPackageCode,
              protectionPackageExpiredAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              healthStatus,
              lastCareDate,
              nextCareDate,
              expectedHarvestAt: new Date(Date.now() + (8 - tplTree.ageYear) * 365 * 24 * 60 * 60 * 1000),
              images: [ginsengUrl],
              priceBought: 120000 + (tplTree.ageYear - 2) * 60000,
            }
          });

          treeCode = uniqueTreeCode;
          plantedCount++;
        } else if (rand < 0.55) {
          status = 'inactive';
        }

        await prisma.cultivationBedLocation.create({
          data: {
            code: locCode,
            bedCode: b.code,
            row: r,
            col: c,
            status,
            treeCode
          }
        });
      }
    }
    
    // Update the bed's treeCount to reflect the actual number of unique trees planted
    await prisma.cultivationBed.update({
      where: { code: b.code },
      data: {
        treeCount: plantedCount
      }
    });
  }

  console.log('--- Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Error seeding business data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
