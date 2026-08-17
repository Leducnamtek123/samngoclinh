require('dotenv').config({ path: 'apps/api/.env' });
const { PrismaClient } = require('../generated/prisma-client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            status: true,
            role: { select: { name: true, type: true } },
        },
    });
    console.log("USERS IN DB (" + users.length + "):");
    console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
