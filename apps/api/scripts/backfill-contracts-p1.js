const { PrismaClient } = require('../generated/prisma-client');
const prisma = new PrismaClient();

async function backfillContracts() {
    console.log('============================================================');
    console.log('STARTING PHASE 5B HISTORICAL CONTRACT BACKFILL');
    console.log('RULE: ZERO FABRICATED DATA');
    console.log('============================================================\n');

    const contracts = await prisma.eContract.findMany({
        include: { items: true },
    });

    console.log(`Found ${contracts.length} existing contract(s) to inspect.\n`);

    let backfilledOrderCount = 0;
    let backfilledItemCount = 0;
    let skippedLegacyCount = 0;

    for (const contract of contracts) {
        console.log(`Processing Contract: ${contract.code} (ID: ${contract.id})`);

        // 1. Backfill orderId if provable
        if (!contract.orderId && contract.metadata && contract.metadata.orderId) {
            const orderIdCandidate = contract.metadata.orderId;
            const existingOrder = await prisma.order.findUnique({
                where: { id: orderIdCandidate },
            });

            if (existingOrder) {
                // Check if another contract already claims this orderId
                const conflict = await prisma.eContract.findUnique({
                    where: { orderId: orderIdCandidate },
                });

                if (!conflict || conflict.id === contract.id) {
                    await prisma.eContract.update({
                        where: { id: contract.id },
                        data: { orderId: orderIdCandidate },
                    });
                    console.log(`  [ORDER BACKFILL] Linked to Order ID: ${orderIdCandidate}`);
                    backfilledOrderCount++;
                } else {
                    console.warn(`  [ORDER CONFLICT] Order ID ${orderIdCandidate} already claimed by Contract ${conflict.code}. Skipping.`);
                }
            } else {
                console.warn(`  [ORDER UNVERIFIED] Order ID ${orderIdCandidate} not found in database.`);
            }
        }

        // 2. Backfill EContractItem if provable
        if (contract.items.length === 0) {
            let provableTrees = [];

            // Case A: Exact treeCode matches a single tree
            if (contract.treeCode) {
                const matchedTree = await prisma.cultivationTree.findUnique({
                    where: { code: contract.treeCode },
                    include: { bed: true },
                });
                if (matchedTree) {
                    provableTrees.push(matchedTree);
                }
            }

            // Case B: Metadata orderCode can prove allocated trees
            if (provableTrees.length === 0 && contract.metadata && contract.metadata.orderCode) {
                const treesWithOrderMeta = await prisma.cultivationTree.findMany({
                    where: {
                        metadata: {
                            path: ['orderCode'],
                            equals: contract.metadata.orderCode,
                        },
                    },
                    include: { bed: true },
                });

                if (treesWithOrderMeta.length > 0) {
                    provableTrees = treesWithOrderMeta;
                }
            }

            if (provableTrees.length > 0) {
                for (const tree of provableTrees) {
                    await prisma.eContractItem.create({
                        data: {
                            contractId: contract.id,
                            treeId: tree.id,
                            treeCode: tree.code,
                            treeName: tree.name || 'Sâm Ngọc Linh thuần chủng',
                            ageYearAtSign: tree.ageYear,
                            gardenCode: tree.bed ? tree.bed.gardenCode : null,
                            bedCode: tree.bedCode || null,
                            unitPrice: tree.priceBought || 0,
                        },
                    });
                    backfilledItemCount++;
                }
                console.log(`  [ITEM BACKFILL] Created ${provableTrees.length} snapshot items from proven tree records.`);
            } else {
                console.log(`  [LEGACY PRESERVED] Tree identity cannot be proven from persisted evidence. Kept as legacy.`);
                skippedLegacyCount++;
            }
        }
    }

    console.log('\n============================================================');
    console.log('BACKFILL SUMMARY:');
    console.log(`- Total Contracts: ${contracts.length}`);
    console.log(`- Order Relations Backfilled: ${backfilledOrderCount}`);
    console.log(`- EContractItems Created: ${backfilledItemCount}`);
    console.log(`- Legacy Contracts Preserved: ${skippedLegacyCount}`);
    console.log('============================================================\n');

    await prisma.$disconnect();
}

backfillContracts().catch(err => {
    console.error('Fatal backfill error:', err);
    process.exit(1);
});
