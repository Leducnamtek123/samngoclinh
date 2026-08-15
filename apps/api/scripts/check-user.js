const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      mobileNumber: true,
      isVerified: true,
      identityDocument: true,
    }
  });
  console.log('USERS IN DB:', JSON.stringify(users, null, 2));
}
run().catch(console.error).finally(() => prisma.$disconnect());
