import * as blockchain from '../app/services/blockchain';

async function testBlockchainService() {
  try {
    console.log('Testing blockchain service...');
    
    // Test getChain
    console.log('\n1. Fetching blockchain...');
    const chain = await blockchain.getChain();
    console.log(`Fetched ${chain.length} blocks`);
    
    // Test getPendingTransactions
    console.log('\n2. Fetching pending transactions...');
    const pendingTx = await blockchain.getPendingTransactions();
    console.log(`Found ${pendingTx.length} pending transactions`);
    
    // Test getRegisteredNodes
    console.log('\n3. Fetching registered nodes...');
    const nodes = await blockchain.getRegisteredNodes();
    console.log(`Found ${nodes.length} registered nodes`);
    
    // Test wallet creation
    console.log('\n4. Testing wallet creation...');
    const wallet = await blockchain.createWallet();
    console.log('Created wallet:', wallet.address);
    
    // Test balance check
    console.log('\n5. Checking balance...');
    const balance = await blockchain.getBalance(wallet.address);
    console.log(`Balance for ${wallet.address}: ${balance} CLT`);
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testBlockchainService();
