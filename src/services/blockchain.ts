import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';

// Types
export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[]; // more specific typing for safer access
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
  hash?: string;
  block_index?: number;
}

interface BlockchainInfoResponse {
  data: { chain: Block[] };
}

interface MineResponse {
  message: string;
  index: number;
  transactions: Transaction[];
  nonce: number;
  hash: string;
  previous_hash: string;
  // Some backends include a mining reward in the response; mark optional to avoid runtime errors
  reward?: number;
}

interface RegisterNodeResponse {
  message?: string;
  registered_nodes?: string[];
  total_nodes?: string[];
  total_count?: number;
}

interface ConsensusResponse {
  message?: string;
  chain?: Block[];
}

interface LatestBlocksResponse {
  data: { blocks: Block[] };
}

interface LatestTransactionsResponse {
  data: { transactions: Transaction[] };
}

interface PendingTxResponse {
  transactions: Transaction[];
}

interface MiningStatusResponse {
  hashRate: number;
  difficulty: number;
  currentTarget: string;
  nonceAttempts: number;
  inProgress: boolean;
  lastBlock?: { index: number; hash: string; timestamp: number };
}

// Address activity detailed shape (as per FastAPI docs)
export interface AddressActivity {
  address: string;
  sent: Array<{
    recipient: string;
    amount: string | number;
    timestamp: string | number;
    hash: string;
    block_index: string | number | null;
  }>;
  received: Array<{
    sender: string;
    amount: string | number;
    timestamp: string | number;
    hash: string;
    block_index: string | number | null;
  }>;
  total_sent: number;
  total_received: number;
  balance: number;
}

// Configuration - Default to production backend URL; can be overridden via env or in-app settings
const API_BASE_URL_DEFAULT = 'https://chainlite.onrender.com';
const API_BASE_URL_ENV = (process.env as any)?.EXPO_PUBLIC_API_BASE_URL as string | undefined;
const SECURE_STORE_KEYS = {
  API_BASE_URL: 'api_base_url',
  PRIVATE_KEY: 'wallet_private_key',
  ADDRESS: 'wallet_address',
};

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: API_BASE_URL_ENV || API_BASE_URL_DEFAULT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // 20 seconds to reduce transient timeouts
});

// ---------- Logging: cURL for each request ----------
const toCurl = (cfg: AxiosRequestConfig): string => {
  const method = (cfg.method || 'get').toUpperCase();
  const base = (cfg.baseURL || '').replace(/\/$/, '');
  const path = (cfg.url || '').startsWith('/') ? (cfg.url || '') : `/${cfg.url || ''}`;
  const qs = cfg.params ? `?${new URLSearchParams(cfg.params as Record<string, any>).toString()}` : '';
  const url = `${base}${path}${qs}`;

  const headerEntries: string[] = [];
  const headers = (cfg.headers || {}) as Record<string, any>;
  Object.keys(headers).forEach((k) => {
    const v = headers[k];
    if (v == null) return;
    const key = String(k).toLowerCase();
    if (['content-length', 'host'].includes(key)) return; // omit noisy headers
    headerEntries.push(`-H '${k}: ${String(v)}'`);
  });

  let dataFlag = '';
  const data = (cfg as any).data;
  if (data != null && data !== '') {
    try {
      const body = typeof data === 'string' ? data : JSON.stringify(data);
      dataFlag = `--data '${body.replace(/'/g, "'\\''")}'`;
    } catch {}
  }

  return `curl -X ${method} '${url}' ${headerEntries.join(' ')} ${dataFlag}`.trim();
};

api.interceptors.request.use((req) => {
  // Ensure baseURL is present for toCurl
  const curl = toCurl({ ...req, baseURL: req.baseURL || api.defaults.baseURL });
  console.log('[HTTP cURL]', curl);
  return req;
});

// Helper function to handle API errors
const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    console.log('API Error Response:', error.response.data);
    throw new Error(error.response.data.message || error.response.data.detail || defaultMessage);
  } else if (error.request) {
    try {
      const curl = toCurl({ ...(error.config || {}), baseURL: (error.config?.baseURL) || api.defaults.baseURL });
      console.log('[HTTP FAILED]', curl);
    } catch {
      console.log('API No Response');
    }
    throw new Error('No response from server. Please check your connection.');
  } else {
    console.log('API Setup Error:', error.message);
    throw new Error(defaultMessage);
  }
};

// ---------- API base URL management ----------
export const setApiBaseUrl = (baseUrl: string) => {
  api.defaults.baseURL = baseUrl;
};

export const saveApiBaseUrl = async (baseUrl: string) => {
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.API_BASE_URL, baseUrl);
  setApiBaseUrl(baseUrl);
};

export const initializeApiBaseUrl = async () => {
  try {
    // Priority: Env var > SecureStore > Platform default
    const stored = await SecureStore.getItemAsync(SECURE_STORE_KEYS.API_BASE_URL);
    let chosen = API_BASE_URL_ENV || stored || API_BASE_URL_DEFAULT;
    // If a previous Android-emulator host was saved but we're not on Android, correct it
    if (Platform.OS !== 'android' && chosen?.includes('10.0.2.2')) {
      const corrected = chosen.replace('10.0.2.2', '127.0.0.1');
      chosen = corrected;
      try { await SecureStore.setItemAsync(SECURE_STORE_KEYS.API_BASE_URL, corrected); } catch {}
    }
    setApiBaseUrl(chosen);
  } catch (e) {
    // fallback to default on any error
    setApiBaseUrl(API_BASE_URL_ENV || API_BASE_URL_DEFAULT);
  }
};

export const getApiBaseUrl = () => api.defaults.baseURL;

// ---------- Blockchain API methods ----------
export const getEndpoints = async (): Promise<any> => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch endpoints');
  }
};

export const getChain = async (): Promise<Block[]> => {
  try {
    const response = await api.get<BlockchainInfoResponse>('/chain');
    return response.data?.data?.chain || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch blockchain');
  }
};

export const getPendingTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get<PendingTxResponse | { data?: PendingTxResponse }>('/pending_tx');
    const d: any = response.data as any;
    return d?.data?.transactions || d?.transactions || [];
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
    const transaction: Omit<Transaction, 'signature'> = {
      sender,
      recipient,
      amount,
      timestamp: Date.now(),
    };

    const signature = await signTransaction(transaction, privateKey);

    const response = await api.post<Transaction | { data?: { transaction?: Transaction } }>(
      '/transactions',
      {
        ...transaction,
        signature,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const d: any = response.data as any;
    // Support both wrapped and plain formats
    return d?.data?.transaction || d;
  } catch (error) {
    return handleApiError(error, 'Failed to create transaction');
  }
};

export const mineBlock = async (minerAddress?: string): Promise<MineResponse> => {
  try {
    const response = await api.get<MineResponse | { data?: MineResponse }>('/mine', {
      params: minerAddress ? { miner_address: minerAddress } : undefined,
    });
    const d: any = response.data as any;
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to mine block');
  }
};

export const registerNode = async (nodeUrl: string): Promise<RegisterNodeResponse> => {
  try {
    const response = await api.post<RegisterNodeResponse | { data?: RegisterNodeResponse }>(
      '/nodes',
      {
        nodes: [nodeUrl],
      }
    );
    const d: any = response.data as any;
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to register node');
  }
};

export const getRegisteredNodes = async (): Promise<string[]> => {
  try {
    const response = await api.get<{ data: { nodes: string[] } }>('/nodes');
    return response.data?.data?.nodes || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch registered nodes');
  }
};

export const resolveConflicts = async (): Promise<ConsensusResponse> => {
  try {
    const response = await api.get<ConsensusResponse | { data?: ConsensusResponse }>('/nodes/resolve');
    const d: any = response.data as any;
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to resolve conflicts');
  }
};

export const unregisterNode = async (hostPort: string): Promise<{ message?: string; removed_node?: string; total_nodes?: string[]; total_count?: number }> => {
  try {
    const response = await api.delete<{ message?: string } | { data?: { removed_node?: string; total_nodes?: string[]; total_count?: number } }>(`/nodes/${hostPort}`);
    const d: any = response.data as any;
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to unregister node');
  }
};

export const unregisterNodes = async (nodes: string[]): Promise<{ message?: string; removed_nodes?: string[]; total_nodes?: string[]; total_count?: number }> => {
  try {
    const response = await api.post<{ message?: string } | { data?: { removed_nodes?: string[]; total_nodes?: string[]; total_count?: number } }>(
      `/nodes/unregister`,
      { nodes }
    );
    const d: any = response.data as any;
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to unregister nodes');
  }
};

// Explorer endpoints
export const getLatestBlocks = async (limit = 10): Promise<Block[]> => {
  try {
    const response = await api.get<LatestBlocksResponse>(`/blocks/latest`, { params: { limit } });
    return response.data?.data?.blocks || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch latest blocks');
  }
};

export const getBlockByHeight = async (height: number): Promise<Block | null> => {
  try {
    const response = await api.get<{ data: { block: Block } } | Block>(`/blocks/${height}`);
    // Support both wrapped and plain formats
    const d: any = response.data as any;
    return d?.data?.block || d || null;
  } catch (error) {
    if ((error as any)?.response?.status === 404) return null;
    return handleApiError(error, 'Failed to fetch block by height');
  }
};

export const getBlockByHash = async (hash: string): Promise<Block | null> => {
  try {
    const response = await api.get<{ data: { block: Block } } | Block>(`/blocks/hash/${hash}`);
    const d: any = response.data as any;
    return d?.data?.block || d || null;
  } catch (error) {
    if ((error as any)?.response?.status === 404) return null;
    return handleApiError(error, 'Failed to fetch block by hash');
  }
};

export const getLatestTransactions = async (limit = 20): Promise<Transaction[]> => {
  try {
    const response = await api.get<LatestTransactionsResponse>(`/transactions/latest`, { params: { limit } });
    return response.data?.data?.transactions || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch latest transactions');
  }
};

export const getTransactionByHash = async (txHash: string): Promise<Transaction | null> => {
  try {
    const response = await api.get<Transaction | { data: { transaction: Transaction } }>(`/transactions/${txHash}`);
    const d: any = response.data as any;
    return d?.data?.transaction || d || null;
  } catch (error) {
    if ((error as any)?.response?.status === 404) return null;
    return handleApiError(error, 'Failed to fetch transaction by hash');
  }
};

export const getTransactionsForAddress = async (
  address: string,
  options?: { limit?: number; before?: number }
): Promise<Transaction[]> => {
  try {
    const response = await api.get<LatestTransactionsResponse | { data?: { transactions?: Transaction[] } }>(`/address/${address}/transactions`, {
      params: { limit: options?.limit ?? 20, before: options?.before },
    });
    const d: any = response.data as any;
    return d?.data?.transactions || d?.transactions || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch address transactions');
  }
};

export const getMiningStatus = async (): Promise<MiningStatusResponse> => {
  try {
    const response = await api.get<MiningStatusResponse | { data?: MiningStatusResponse }>('/mining/status');
    const d: any = response.data as any;
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch mining status');
  }
};

// Full address activity helper (non-breaking: new method)
export const getAddressActivity = async (address: string, options?: { limit?: number; before?: number }): Promise<AddressActivity> => {
  try {
    const response = await api.get<{ data?: AddressActivity } | AddressActivity>(`/address/${address}/transactions`, {
      params: { limit: options?.limit ?? 20, before: options?.before },
    });
    const d: any = response.data as any;
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch address activity');
  }
};

// ---------- Helper functions ----------
const signTransaction = async (
  transaction: Omit<Transaction, 'signature'>,
  privateKey: string
): Promise<string> => {
  // In a real app, you would use a proper cryptographic library to sign the transaction
  return `mock-signature-${JSON.stringify(transaction)}`;
};

// Wallet management
export const createWallet = async (): Promise<{ address: string; privateKey: string }> => {
  const privateKey = `mock-private-key-${Math.random().toString(36).substring(2)}`;
  const address = `0x${Math.random().toString(36).substring(2, 18)}`;
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.PRIVATE_KEY, privateKey);
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ADDRESS, address);
  return { address, privateKey };
};

export const getWallet = async (): Promise<{ address: string; privateKey: string } | null> => {
  const [address, privateKey] = await Promise.all([
    SecureStore.getItemAsync(SECURE_STORE_KEYS.ADDRESS),
    SecureStore.getItemAsync(SECURE_STORE_KEYS.PRIVATE_KEY),
  ]);
  if (!address || !privateKey) return null;
  return { address, privateKey };
};

export const importWallet = async (privateKey: string): Promise<{ address: string; privateKey: string } > => {
  // Derive a mock address from the private key for demo purposes
  const suffix = privateKey.replace(/[^a-fA-F0-9]/g, '').slice(-16) || Math.random().toString(16).slice(2, 18);
  const address = `0x${suffix}`;
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.PRIVATE_KEY, privateKey);
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ADDRESS, address);
  return { address, privateKey };
};

export const getWalletAddress = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(SECURE_STORE_KEYS.ADDRESS);
};

export const getPrivateKey = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(SECURE_STORE_KEYS.PRIVATE_KEY);
};

export const getBalance = async (address: string): Promise<number> => {
  try {
    const response = await api.get<{ balance: number }>(`/balance/${address}`);
    return response.data.balance;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch balance');
  }
};

export const getTransactionHistory = async (
  address: string,
  limit: number = 50
): Promise<Transaction[]> => {
  return getTransactionsForAddress(address, { limit });
};
