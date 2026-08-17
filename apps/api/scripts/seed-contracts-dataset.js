require('dotenv').config({ path: 'apps/api/.env' });
const { PrismaClient } = require('../generated/prisma-client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding rich contracts dataset into database...');

    const user = await prisma.user.findFirst();
    const userId = user ? user.id : 'a34cff60-aeb1-4c27-a4ce-a519c9fc7ae5';

    const templatePath = path.resolve(__dirname, '../../../templates/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh.html');
    let templateHtml = '<p>Hợp đồng mua bán và ủy quyền chăm sóc cây Sâm Ngọc Linh tiêu chuẩn.</p>';
    if (fs.existsSync(templatePath)) {
        templateHtml = fs.readFileSync(templatePath, 'utf-8');
    }

    const contractsToSeed = [
        {
            id: '873500c8-40d9-4682-8407-b47a3352f031',
            code: 'CTR-SNL-2026/7191',
            title: 'Hợp Đồng Mua Bán Và Ký Gửi, Chăm Sóc Cây Sâm Ngọc Linh #7191',
            status: 'signed',
            userId: userId,
            partyA: 'Công ty Cổ phần Sâm Ngọc Linh',
            partyB: 'Lê Hoàng Long',
            contractValue: 90000000,
            paymentStatus: 'paid',
            content: templateHtml,
            signatureUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            metadata: {
                customerName: 'Lê Hoàng Long',
                phone: '0908123456',
                email: 'lehoanglong@gmail.com',
                treeQuantity: 2,
                gardenName: 'Vườn bảo tồn Nam Trà My, Kon Tum',
            },
        },
        {
            id: '873500c8-40a9-4682-8407-b47a3352f031',
            code: 'CTR-SNL-2026/7190',
            title: 'Hợp Đồng Mua Bán Và Ký Gửi, Chăm Sóc Cây Sâm Ngọc Linh #7190',
            status: 'signed',
            userId: userId,
            partyA: 'Công ty Cổ phần Sâm Ngọc Linh',
            partyB: 'Trần Văn Minh',
            contractValue: 45000000,
            paymentStatus: 'paid',
            content: templateHtml,
            metadata: {
                customerName: 'Trần Văn Minh',
                phone: '0912345678',
                email: 'tranvanminh@gmail.com',
                treeQuantity: 1,
                gardenName: 'Vườn bảo tồn Nam Trà My, Kon Tum',
            },
        },
        {
            id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
            code: 'CTR-SNL-2026/7200',
            title: 'Hợp Đồng Mua Bán Và Ký Gửi, Chăm Sóc Cây Sâm Ngọc Linh #7200',
            status: 'pending',
            userId: userId,
            partyA: 'Công ty Cổ phần Sâm Ngọc Linh',
            partyB: 'Phạm Thị Lan',
            contractValue: 135000000,
            paymentStatus: 'paid',
            content: templateHtml,
            metadata: {
                customerName: 'Phạm Thị Lan',
                phone: '0987654321',
                email: 'phamthilan@gmail.com',
                treeQuantity: 3,
                gardenName: 'Vườn bảo tồn Nam Trà My, Kon Tum',
            },
        },
        {
            id: 'b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e',
            code: 'CTR-SNL-2026/7205',
            title: 'Hợp Đồng Mua Bán Và Ký Gửi, Chăm Sóc Cây Sâm Ngọc Linh #7205',
            status: 'draft',
            userId: userId,
            partyA: 'Công ty Cổ phần Sâm Ngọc Linh',
            partyB: 'Nguyễn Văn An',
            contractValue: 45000000,
            paymentStatus: 'unpaid',
            content: templateHtml,
            metadata: {
                customerName: 'Nguyễn Văn An',
                phone: '0933112233',
                email: 'nguyenvanan@gmail.com',
                treeQuantity: 1,
                gardenName: 'Vườn bảo tồn Nam Trà My, Kon Tum',
            },
        },
    ];

    for (const item of contractsToSeed) {
        const existing = await prisma.eContract.findUnique({
            where: { id: item.id },
        });

        if (existing) {
            await prisma.eContract.update({
                where: { id: item.id },
                data: {
                    code: item.code,
                    title: item.title,
                    status: item.status,
                    userId: item.userId,
                    partyA: item.partyA,
                    partyB: item.partyB,
                    contractValue: item.contractValue,
                    paymentStatus: item.paymentStatus,
                    content: item.content,
                    metadata: item.metadata,
                    signatureUrl: item.signatureUrl || existing.signatureUrl,
                },
            });
            console.log(`Updated contract: ${item.code} (${item.id})`);
        } else {
            // Check if code exists with different ID
            const existingCode = await prisma.eContract.findUnique({
                where: { code: item.code },
            });
            if (existingCode) {
                await prisma.eContract.update({
                    where: { id: existingCode.id },
                    data: {
                        content: item.content,
                        metadata: item.metadata,
                    },
                });
                console.log(`Updated existing contract by code: ${item.code}`);
            } else {
                await prisma.eContract.create({
                    data: {
                        id: item.id,
                        code: item.code,
                        title: item.title,
                        status: item.status,
                        userId: item.userId,
                        partyA: item.partyA,
                        partyB: item.partyB,
                        contractValue: item.contractValue,
                        paymentStatus: item.paymentStatus,
                        content: item.content,
                        metadata: item.metadata,
                        signatureUrl: item.signatureUrl || null,
                        expiredAt: new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000),
                    },
                });
                console.log(`Created contract: ${item.code} (${item.id})`);
            }
        }
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
