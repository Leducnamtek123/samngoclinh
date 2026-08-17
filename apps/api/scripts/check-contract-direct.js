require('dotenv').config({ path: 'apps/api/.env' });
const { PrismaClient } = require('../generated/prisma-client');
const prisma = new PrismaClient();

async function check() {
    console.log("Checking DB directly for 873500c8-40d9-4682-8407-b47a3352f031...");
    const contract = await prisma.eContract.findUnique({
        where: { id: '873500c8-40d9-4682-8407-b47a3352f031' },
        include: {
            items: true,
            order: true,
            amendments: {
                orderBy: { amendmentNumber: 'asc' },
            },
        },
    });

    console.log("Found contract:", contract ? {
        id: contract.id,
        code: contract.code,
        title: contract.title,
        status: contract.status,
    } : "NULL");
}

check().catch(console.error).finally(() => prisma.$disconnect());
