require('dotenv').config({ path: 'apps/api/.env' });
const { PrismaClient } = require('../generated/prisma-client');
const prisma = new PrismaClient();

async function main() {
    const contracts = await prisma.eContract.findMany({
        select: {
            id: true,
            code: true,
            title: true,
            status: true,
            userId: true,
            contractValue: true,
            createdAt: true,
        },
    });
    console.log("ALL CONTRACTS IN DB (" + contracts.length + "):");
    console.log(JSON.stringify(contracts, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
