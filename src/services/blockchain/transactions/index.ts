import { api } from '../api';
import { Transaction, AddressActivity } from '../types';

/**
 * Get pending transactions
 */
export const getPendingTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get('/pending_tx');
    return response.data.pending_transactions || [];
  } catch (error) {
    console.error('Error getting pending transactions:', error);
    throw error;
  }
};

/**
 * Get transaction by hash
 */
export const getTransaction = async (hash: string): Promise<Transaction | null> => {
  try {
    const response = await api.get(`/transactions/${hash}`);
    return response.data.transaction;
  } catch (error) {
    console.error(`Error getting transaction ${hash}:`, error);
    return null;
  }
};

/**
 * Create a new transaction
 */
export const createTransaction = async (
  sender: string,
  recipient: string,
  amount: number,
  privateKey: string
): Promise<Transaction> => {
  try {
    // In a real app, you would sign the transaction here
    const transaction = {
      sender,
      recipient,
      amount,
      signature: 'signed_transaction_placeholder'
    };
    
    const response = await api.post('/transactions/new', transaction);
    return response.data.transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

/**
 * Get transaction history for an address
 */
export const getTransactionHistory = async (
  address: string,
  limit: number = 50
): Promise<Transaction[]> => {
  try {
    const response = await api.get(`/address/${address}/transactions?limit=${limit}`);
    return response.data.transactions || [];
  } catch (error) {
    console.error(`Error getting transaction history for ${address}:`, error);
    throw error;
  }
};

/**
 * Get address activity
 */
export const getAddressActivity = async (
  address: string,
  options?: { limit?: number; before?: number }
): Promise<AddressActivity> => {
  try {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.before) params.append('before', options.before.toString());
    
    const response = await api.get(`/address/${address}/activity?${params}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting activity for ${address}:`, error);
    throw error;
  }
};
