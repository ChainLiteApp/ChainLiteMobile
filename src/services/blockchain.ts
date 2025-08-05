import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// Types
export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  nonce: number;
  hash: string;
  previous_hash: string;
}

export interface Transaction {
  sender: string;
  recipient: string;
  amount: number;
  signature: string;
  timestamp?: number;
}

interface BlockchainInfo {
  chain: Block[];
  length: number;
}

interface MineResponse {
  message: string;
  index: number;
  transactions: Transaction[];
  nonce: number;
  hash: string;
  previous_hash: string;
}

interface RegisterNodeResponse {
  message: string;
  total_nodes: string[];
}

interface ConsensusResponse {
  message: string;
  chain?: Block[];
}

// Configuration
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:5000';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Helper function to handle API errors
const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', error.response.data);
    throw new Error(error.response.data.message || defaultMessage);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API No Response:', error.request);
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Setup Error:', error.message);
    throw new Error(defaultMessage);
  }
};

// Blockchain API methods
export const getChain = async (): Promise<Block[]> => {
  try {
    const response = await api.get<BlockchainInfo>('/chain');
    return response.data.chain;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch blockchain');
  }
};

export const getPendingTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get<{ transactions: Transaction[] }>('/pending_tx');
    return response.data.transactions || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch pending transactions');
  }
};

export const createTransaction = async (
  sender: string,
  recipient: string,
  amount: number,
  privateKey: string
): Promise<Transaction> => {
  try {
    // In a real app, you would sign the transaction with the private key here
    const transaction: Omit<Transaction, 'signature'> = {
      sender,
      recipient,
      amount,
      timestamp: Date.now(),
    };

    // This is a placeholder - in a real app, you would sign the transaction
    const signature = await signTransaction(transaction, privateKey);

    const response = await api.post<Transaction>('/transactions/new', {
      ...transaction,
      signature,
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to create transaction');
  }
};

export const mineBlock = async (minerAddress: string): Promise<MineResponse> => {
  try {
    const response = await api.get<MineResponse>('/mine', {
      params: { miner_address: minerAddress },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to mine block');
  }
};

export const getRegisteredNodes = async (): Promise<string[]> => {
  try {
    const response = await api.get<{ nodes: string[] }>('/nodes');
    return response.data.nodes || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch registered nodes');
  }
};

export const registerNode = async (nodeUrl: string): Promise<RegisterNodeResponse> => {
  try {
    const response = await api.post<RegisterNodeResponse>('/nodes/register', {
      nodes: [nodeUrl],
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to register node');
  }
};

export const resolveConflicts = async (): Promise<ConsensusResponse> => {
  try {
    const response = await api.get<ConsensusResponse>('/nodes/resolve');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to resolve conflicts');
  }
};

// Helper functions
const signTransaction = async (
  transaction: Omit<Transaction, 'signature'>,
  privateKey: string
): Promise<string> => {
  // In a real app, you would use a proper cryptographic library to sign the transaction
  // This is just a placeholder that returns a mock signature
  return `mock-signature-${JSON.stringify(transaction)}`;
};

// Secure storage keys
const WALLET_KEYS = {
  PRIVATE_KEY: 'wallet_private_key',
  ADDRESS: 'wallet_address',
};

// Wallet management
export const createWallet = async (): Promise<{ address: string; privateKey: string }> => {
  // In a real app, you would generate a proper key pair
  // This is just a mock implementation
  const privateKey = `mock-private-key-${Math.random().toString(36).substring(2)}`;
  const address = `0x${Math.random().toString(36).substring(2, 18)}`;
  
  await SecureStore.setItemAsync(WALLET_KEYS.PRIVATE_KEY, privateKey);
  await SecureStore.setItemAsync(WALLET_KEYS.ADDRESS, address);
  
  return { address, privateKey };
};

export const getWalletAddress = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(WALLET_KEYS.ADDRESS);
};

export const getPrivateKey = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(WALLET_KEYS.PRIVATE_KEY);
};

export const getBalance = async (address: string): Promise<number> => {
  try {
    const response = await api.get<{ balance: number }>(`/balance/${address}`);
    return response.data.balance;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch balance');
  }
};

// Set the base URL for API calls (useful for switching between environments)
export const setApiBaseUrl = (baseUrl: string) => {
  api.defaults.baseURL = baseUrl;
};
