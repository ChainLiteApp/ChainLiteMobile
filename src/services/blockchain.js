import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.0.100:8000'  // Replace with your computer's local IP
  : 'https://your-production-url.com';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Secure storage keys
const KEYS = {
  NODES: '@chainlite/nodes',
  WALLET: '@chainlite/wallet',
  SETTINGS: '@chainlite/settings'
};

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token if exists
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error setting auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors and retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    // If no response or specific status codes, don't retry
    if (!response || [400, 401, 403, 404].includes(response.status)) {
      return Promise.reject(error);
    }

    // Set retry count
    config.retryCount = config.retryCount || 0;
    
    // If we've maxed out retries, reject
    if (config.retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    // Increment retry count
    config.retryCount++;
    
    // Create new promise to handle exponential backoff
    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, RETRY_DELAY * Math.pow(2, config.retryCount));
    });

    // Return the promise which recalls axios to retry the request
    return backoff.then(() => api(config));
  }
);

export const blockchainService = {
  // Get API endpoints
  getEndpoints: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error getting API endpoints:', error);
      throw new Error('Failed to fetch API endpoints');
    }
  },

  // Get the full blockchain
  getChain: async () => {
    try {
      const response = await api.get('/chain');
      return response.data;
    } catch (error) {
      console.error('Error getting chain:', error);
      throw new Error('Failed to fetch blockchain');
    }
  },
  
  // Create a new transaction
  createTransaction: async (sender, recipient, amount, privateKey) => {
    try {
      const response = await api.post('/transactions', {
        sender,
        recipient,
        amount: parseFloat(amount),
        // In a real implementation, you would include a signature
        signature: this.signTransaction(sender, recipient, amount, privateKey)
      });
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create transaction');
    }
  },
  
  // Mine a new block
  mineBlock: async () => {
    try {
      const response = await api.get('/mine');
      return response.data;
    } catch (error) {
      console.error('Error mining block:', error);
      throw new Error(error.response?.data?.detail || 'Failed to mine block');
    }
  },
  
  // Node management
  registerNode: async (nodeUrl) => {
    try {
      const response = await api.post('/nodes/register', {
        nodes: [nodeUrl]
      });
      
      // Save to local storage
      const nodes = await this.getRegisteredNodes();
      if (!nodes.includes(nodeUrl)) {
        nodes.push(nodeUrl);
        await SecureStore.setItemAsync(KEYS.NODES, JSON.stringify(nodes));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error registering node:', error);
      throw new Error(error.response?.data?.detail || 'Failed to register node');
    }
  },
  
  // Resolve chain conflicts (consensus)
  resolveConflicts: async () => {
    try {
      const response = await api.get('/nodes/resolve');
      return response.data;
    } catch (error) {
      console.error('Error resolving conflicts:', error);
      throw new Error(error.response?.data?.detail || 'Failed to resolve conflicts');
    }
  },
  
  getRegisteredNodes: async () => {
    try {
      const response = await api.get('/nodes');
      // Also update local storage
      if (response.data?.nodes) {
        await SecureStore.setItemAsync(KEYS.NODES, JSON.stringify(response.data.nodes));
        return response.data.nodes;
      }
      // Fallback to local storage if API fails
      const localNodes = await SecureStore.getItemAsync(KEYS.NODES);
      return localNodes ? JSON.parse(localNodes) : [];
    } catch (error) {
      console.error('Error getting nodes:', error);
      // Fallback to local storage if API fails
      const localNodes = await SecureStore.getItemAsync(KEYS.NODES);
      return localNodes ? JSON.parse(localNodes) : [];
    }
  },
  
  // Wallet management
  createWallet: async () => {
    const wallet = {
      address: this.generateAddress(),
      privateKey: this.generatePrivateKey(),
      balance: 0,
      createdAt: new Date().toISOString()
    };
    
    await SecureStore.setItemAsync(KEYS.WALLET, JSON.stringify(wallet));
    return wallet;
  },
  
  getWallet: async () => {
    try {
      const wallet = await SecureStore.getItemAsync(KEYS.WALLET);
      if (!wallet) return null;
      
      const walletData = JSON.parse(wallet);
      // Refresh balance from the network
      try {
        const balance = await this.getBalance(walletData.address);
        walletData.balance = balance;
        // Update the stored wallet with the latest balance
        await SecureStore.setItemAsync(KEYS.WALLET, JSON.stringify(walletData));
      } catch (error) {
        console.warn('Could not refresh wallet balance:', error);
      }
      
      return walletData;
    } catch (error) {
      console.error('Error getting wallet:', error);
      return null;
    }
  },
  
  // Get balance for an address
  getBalance: async (address) => {
    try {
      const response = await api.get(`/balance/${address}`);
      return response.data.balance || 0;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get balance');
    }
  },
  
  // Helper functions
  signTransaction: (sender, recipient, amount, privateKey) => {
    // In a real implementation, this would sign the transaction with the private key
    return `signed_${sender}_${recipient}_${amount}_${privateKey.substring(0, 8)}`;
  },
  
  generateAddress: () => {
    // In a real implementation, this would generate a proper address from a public key
    return '0x' + Math.random().toString(16).substr(2, 40);
  },
  
  generatePrivateKey: () => {
    // In a real implementation, this would generate a secure private key
    return '0x' + Math.random().toString(16).substr(2, 64);
  }
};

export default blockchainService;
