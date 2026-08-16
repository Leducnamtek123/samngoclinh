const { PrismaClient } = require('../generated/prisma-client');
const prisma = new PrismaClient();

async function main() {
  const contracts = await prisma.eContract.findMany();
  console.log('Total contracts in DB:', contracts.length);
  for (const c of contracts) {
    console.log(`- Contract ID: ${c.id}, Code: ${c.code}, Status: ${c.status}, treeCode: ${c.treeCode}, metadata:`, JSON.stringify(c.metadata));
  }
  const orderIds = contracts.map(c => c.metadata && c.metadata.orderId).filter(Boolean);
  console.log('OrderIds found in metadata:', orderIds);
  const duplicates = orderIds.filter((item, index) => orderIds.indexOf(item) !== index);
  console.log('Duplicate orderIds in metadata:', duplicates);
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
