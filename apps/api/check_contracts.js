const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const contracts = await prisma.eContract.findMany({
    select: { id: true, code: true, title: true, status: true, pdfUrl: true, metadata: true }
  });
  console.log('CONTRACTS_IN_DB:', JSON.stringify(contracts, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
