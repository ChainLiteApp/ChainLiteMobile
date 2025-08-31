import { axiosInstance, setApiBaseUrl, getApiBaseUrl, saveApiBaseUrl, initializeApiBaseUrl } from './axiosConfig';
import type { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Types mirroring legacy service
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
  hash?: string;
  block_index?: number;
}

// -------- Helpers (adapt response shapes and errors) --------
const toCurl = (cfg: AxiosRequestConfig): string => {
  const method = (cfg.method || 'get').toUpperCase();
  const base = (cfg.baseURL || axiosInstance.defaults.baseURL || '').replace(/\/$/, '');
  const path = (cfg.url || '').startsWith('/') ? (cfg.url || '') : `/${cfg.url || ''}`;
  const qs = cfg.params ? `?${new URLSearchParams(cfg.params as Record<string, any>).toString()}` : '';
  const url = `${base}${path}${qs}`;

  const headerEntries: string[] = [];
  const headers = (cfg.headers || {}) as Record<string, any>;
  Object.keys(headers).forEach((k) => {
    const v = headers[k];
    if (v == null) return;
    const key = String(k).toLowerCase();
    if (['content-length', 'host'].includes(key)) return;
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

const handleApiError = (error: any, defaultMessage: string) => {
  if (error?.response) {
    console.log('API Error Response:', error.response.data);
    throw new Error(error.response.data?.message || error.response.data?.detail || defaultMessage);
  } else if (error?.request) {
    try {
      const curl = toCurl({ ...(error.config || {}), baseURL: (error.config?.baseURL) || axiosInstance.defaults.baseURL });
      console.log('[HTTP FAILED]', curl);
    } catch {}
    throw new Error('No response from server. Please check your connection.');
  } else {
    console.log('API Setup Error:', error?.message);
    throw new Error(defaultMessage);
  }
};

// -------- Base URL management (compat) --------
export { setApiBaseUrl, getApiBaseUrl, saveApiBaseUrl, initializeApiBaseUrl };

// -------- Legacy-shaped API implemented with axiosInstance --------
export const getEndpoints = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch endpoints');
  }
};

export const getChain = async (): Promise<Block[]> => {
  try {
    const response = await axiosInstance.get('/chain');
    // Support both wrapped { data: { chain } } and plain { chain }
    const d: any = response.data || {};
    return d?.data?.chain || d?.chain || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch blockchain');
  }
};

export const getPendingTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await axiosInstance.get('/pending_tx');
    const d: any = response.data || {};
    return d?.data?.transactions || d?.transactions || d?.pending_transactions || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch pending transactions');
  }
};

// In legacy service, signing was handled client-side. Keep simple mock to maintain contract.
const signTransaction = async (
  transaction: Omit<Transaction, 'signature'>,
  privateKey: string
): Promise<string> => {
  // TODO: integrate a real signing library when backend verifies signatures
  return `mock-signature-${JSON.stringify(transaction)}-${privateKey?.slice(-6)}`;
};

export const createTransaction = async (
  sender: string,
  recipient: string,
  amount: number,
  privateKey: string
): Promise<Transaction> => {
  try {
    const tx: Omit<Transaction, 'signature'> = {
      sender,
      recipient,
      amount,
      timestamp: Date.now(),
    };
    const signature = await signTransaction(tx, privateKey);

    // Accept either /transactions or /transactions/new
    try {
      const res = await axiosInstance.post('/transactions', { ...tx, signature }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const d: any = res.data || {};
      return d?.data?.transaction || d?.transaction || d;
    } catch (e1) {
      const res2 = await axiosInstance.post('/transactions/new', { ...tx, signature }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const d2: any = res2.data || {};
      return d2?.data?.transaction || d2?.transaction || d2;
    }
  } catch (error) {
    return handleApiError(error, 'Failed to create transaction');
  }
};

export const mineBlock = async (minerAddress?: string): Promise<any> => {
  try {
    // Support both GET /mine?miner_address=... and POST /mine { address }
    try {
      const res = await axiosInstance.get('/mine', {
        params: minerAddress ? { miner_address: minerAddress } : undefined,
      });
      const d: any = res.data || {};
      return d?.data || d;
    } catch (e1) {
      const res2 = await axiosInstance.post('/mine', minerAddress ? { address: minerAddress } : {});
      const d2: any = res2.data || {};
      return d2?.data || d2;
    }
  } catch (error) {
    return handleApiError(error, 'Failed to mine block');
  }
};

export const registerNode = async (nodeUrl: string): Promise<any> => {
  try {
    // Support both /nodes (body { nodes: [...] }) and /nodes/register
    try {
      const res = await axiosInstance.post('/nodes', { nodes: [nodeUrl] });
      const d: any = res.data || {};
      return d?.data || d;
    } catch (e1) {
      const res2 = await axiosInstance.post('/nodes/register', { nodes: [nodeUrl] });
      const d2: any = res2.data || {};
      return d2?.data || d2;
    }
  } catch (error) {
    return handleApiError(error, 'Failed to register node');
  }
};

export const getRegisteredNodes = async (): Promise<string[]> => {
  try {
    const res = await axiosInstance.get('/nodes');
    const d: any = res.data || {};
    return d?.data?.nodes || d?.nodes || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch registered nodes');
  }
};

export const resolveConflicts = async (): Promise<any> => {
  try {
    const res = await axiosInstance.get('/nodes/resolve');
    const d: any = res.data || {};
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to resolve conflicts');
  }
};

export const unregisterNode = async (hostPort: string): Promise<any> => {
  try {
    const res = await axiosInstance.delete(`/nodes/${hostPort}`);
    const d: any = res.data || {};
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to unregister node');
  }
};

export const unregisterNodes = async (nodes: string[]): Promise<any> => {
  try {
    const res = await axiosInstance.post('/nodes/unregister', { nodes });
    const d: any = res.data || {};
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to unregister nodes');
  }
};

// Explorer helpers
export const getLatestBlocks = async (limit = 10): Promise<Block[]> => {
  try {
    const res = await axiosInstance.get(`/blocks/latest`, { params: { limit } });
    const d: any = res.data || {};
    return d?.data?.blocks || d?.blocks || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch latest blocks');
  }
};

export const getBlockByHeight = async (height: number): Promise<Block | null> => {
  try {
    const res = await axiosInstance.get(`/blocks/${height}`);
    const d: any = res.data || {};
    return d?.data?.block || d?.block || d || null;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    return handleApiError(error, 'Failed to fetch block by height');
  }
};

export const getBlockByHash = async (hash: string): Promise<Block | null> => {
  try {
    const res = await axiosInstance.get(`/blocks/hash/${hash}`);
    const d: any = res.data || {};
    return d?.data?.block || d?.block || d || null;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    return handleApiError(error, 'Failed to fetch block by hash');
  }
};

export const getLatestTransactions = async (limit = 20): Promise<Transaction[]> => {
  try {
    const res = await axiosInstance.get(`/transactions/latest`, { params: { limit } });
    const d: any = res.data || {};
    return d?.data?.transactions || d?.transactions || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch latest transactions');
  }
};

export const getTransactionByHash = async (txHash: string): Promise<Transaction | null> => {
  try {
    const res = await axiosInstance.get(`/transactions/${txHash}`);
    const d: any = res.data || {};
    return d?.data?.transaction || d?.transaction || d || null;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    return handleApiError(error, 'Failed to fetch transaction by hash');
  }
};

export const getTransactionsForAddress = async (
  address: string,
  options?: { limit?: number; before?: number }
): Promise<Transaction[]> => {
  try {
    const res = await axiosInstance.get(`/address/${address}/transactions`, {
      params: { limit: options?.limit ?? 20, before: options?.before },
    });
    const d: any = res.data || {};
    return d?.data?.transactions || d?.transactions || [];
  } catch (error) {
    return handleApiError(error, 'Failed to fetch address transactions');
  }
};

export interface MiningStatus {
  hashRate: number;
  difficulty: number;
  currentTarget?: string;
  nonceAttempts: number;
  inProgress: boolean;
  lastBlock?: { index: number; hash: string; timestamp?: number } | null;
}

export const getMiningStatus = async (): Promise<MiningStatus> => {
  try {
    const res = await axiosInstance.get('/mining/status');
    const d: any = res.data || {};
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch mining status');
  }
};

export const getAddressActivity = async (
  address: string,
  options?: { limit?: number; before?: number }
): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/address/${address}/transactions`, {
      params: { limit: options?.limit ?? 20, before: options?.before },
    });
    const d: any = res.data || {};
    return d?.data || d;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch address activity');
  }
};

// Wallet management (compat)
const SECURE_STORE_KEYS = {
  PRIVATE_KEY: 'wallet_private_key',
  ADDRESS: 'wallet_address',
};

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

export const importWallet = async (privateKey: string): Promise<{ address: string; privateKey: string }> => {
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
    const res = await axiosInstance.get(`/balance/${address}`);
    const d: any = res.data || {};
    return d?.balance ?? d?.data?.balance ?? 0;
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
