import * as blockchain from '../src/services/blockchain';

async function testApiEndpoints() {
  try {
    console.log('=== Testing ChainLite API Endpoints ===\n');
    
    // 1. Test getEndpoints
    console.log('1. Testing getEndpoints...');
    const endpoints = await blockchain.getEndpoints();
    console.log('Available endpoints:', JSON.stringify(endpoints, null, 2));
    
    // 2. Test getChain
    console.log('\n2. Testing getChain...');
    const chain = await blockchain.getChain();
    console.log(`Chain length: ${chain.length} blocks`);
    
    // 3. Test getPendingTransactions
    console.log('\n3. Testing getPendingTransactions...');
    const pendingTx = await blockchain.getPendingTransactions();
    console.log(`Pending transactions: ${pendingTx.length}`);
    
    // 4. Test createTransaction (if we have a wallet)
    console.log('\n4. Testing createTransaction...');
    try {
      const walletAddress = await blockchain.getWalletAddress();
      if (walletAddress) {
        const tx = await blockchain.createTransaction(
          walletAddress,
          'test-recipient',
          1,
          'test-private-key'
        );
        console.log('Transaction created:', tx);
      } else {
        console.log('No wallet found, skipping transaction creation test');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Transaction creation test failed (might be expected):', errorMessage);
    }
    
    // 5. Test getRegisteredNodes
    console.log('\n5. Testing getRegisteredNodes...');
    const nodes = await blockchain.getRegisteredNodes();
    console.log(`Registered nodes: ${nodes.length}`);
    
    console.log('\n=== API Test Completed Successfully ===');
  } catch (error) {
    console.error('\n=== API Test Failed ===');
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testApiEndpoints();
