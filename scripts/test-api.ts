import * as blockchain from '../src/services/blockchain';

async function testApiEndpoints() {
  console.log('=== Testing ChainLite API Endpoints ===\n');

  const results: Array<{ name: string; ok: boolean; info?: any; error?: string }> = [];

  async function step(name: string, fn: () => Promise<any>) {
    try {
      const info = await fn();
      results.push({ name, ok: true, info });
      console.log(`✔ ${name}`);
      return info;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      results.push({ name, ok: false, error: err });
      console.log(`✖ ${name} — ${err}`);
      return undefined;
    }
  }

  // 0. Base URL check
  console.log('Base URL:', blockchain.getApiBaseUrl());

  // 1. Endpoints index
  await step('GET / (getEndpoints)', async () => await blockchain.getEndpoints());

  // 2. Chain
  const chain = await step('GET /chain (getChain)', async () => await blockchain.getChain());

  // 3. Pending transactions
  await step('GET /pending_tx (getPendingTransactions)', async () => await blockchain.getPendingTransactions());

  // 4. Wallet + Balance
  const wallet = await step('Create wallet (createWallet)', async () => await blockchain.createWallet());
  const walletAddr = wallet?.address;
  if (walletAddr) {
    await step('GET /balance/{address} (getBalance)', async () => await blockchain.getBalance(walletAddr));
  }

  // 5. Create transaction (mock signature) to a valid-format address from docs
  if (walletAddr) {
    await step('POST /transactions (createTransaction)', async () =>
      await blockchain.createTransaction(walletAddr, '0xdef987654321', 1.5, (await blockchain.getPrivateKey()) || 'mock')
    );
  }

  // 6. Mine block (with miner address)
  await step('GET /mine (mineBlock)', async () => await blockchain.mineBlock(walletAddr));

  // 7. Explorer endpoints
  const latestBlocks = await step('GET /blocks/latest (getLatestBlocks)', async () => await blockchain.getLatestBlocks(5));
  if (Array.isArray(latestBlocks) && latestBlocks.length > 0) {
    const first = latestBlocks[0];
    await step('GET /blocks/{height} (getBlockByHeight)', async () => await blockchain.getBlockByHeight(first.index));
    await step('GET /blocks/hash/{hash} (getBlockByHash)', async () => await blockchain.getBlockByHash(first.hash));
  }

  // 8. Latest transactions and by-hash lookup (if any exist)
  const latestTx = await step('GET /transactions/latest (getLatestTransactions)', async () => await blockchain.getLatestTransactions(10));
  if (Array.isArray(latestTx) && latestTx.length > 0) {
    await step('GET /transactions/{hash} (getTransactionByHash)', async () => await blockchain.getTransactionByHash(latestTx[0].hash!));
  }

  // 9. Address transactions & activity (full structure)
  if (walletAddr) {
    await step('GET /address/{address}/transactions (getTransactionsForAddress)', async () =>
      await blockchain.getTransactionsForAddress(walletAddr, { limit: 10 })
    );
    await step('Address activity (getAddressActivity)', async () =>
      await blockchain.getAddressActivity(walletAddr, { limit: 10 })
    );
  }

  // 10. Mining status
  await step('GET /mining/status (getMiningStatus)', async () => await blockchain.getMiningStatus());

  // 11. Nodes: register/list/resolve/unregister
  const testNodeA = 'http://127.0.0.1:8002';
  const testNodeB = 'http://127.0.0.1:8003';

  await step('POST /nodes/register (registerNode A)', async () => await blockchain.registerNode(testNodeA));
  await step('POST /nodes/register (registerNode B)', async () => await blockchain.registerNode(testNodeB));
  await step('GET /nodes (getRegisteredNodes)', async () => await blockchain.getRegisteredNodes());
  await step('GET /nodes/resolve (resolveConflicts)', async () => await blockchain.resolveConflicts());
  await step('DELETE /nodes/{hostPort} (unregisterNode)', async () => await blockchain.unregisterNode('127.0.0.1:8002'));
  await step('POST /nodes/unregister (unregisterNodes)', async () => await blockchain.unregisterNodes([testNodeB]));

  // Summary
  const passed = results.filter(r => r.ok).length;
  const failed = results.length - passed;
  console.log('\n=== API Test Summary ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  if (failed > 0) {
    console.table(results.filter(r => !r.ok).map(r => ({ name: r.name, error: r.error })));
  }
}

testApiEndpoints();
