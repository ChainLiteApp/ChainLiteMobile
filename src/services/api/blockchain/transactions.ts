import { axiosInstance } from '../axiosConfig';
import type { Transaction } from './types';

export const transactionsAPI = {
  /**
   * Get pending transactions
   */
  getPendingTransactions: async (): Promise<Transaction[]> => {
    const response = await axiosInstance.get('/pending_tx');
    return response.data.pending_transactions || [];
  },

  /**
   * Get transaction by hash
   */
  getTransaction: async (hash: string): Promise<Transaction> => {
    const response = await axiosInstance.get(`/transactions/${hash}`);
    return response.data.transaction;
  },

  /**
   * Create a new transaction
   */
  createTransaction: async (transaction: Omit<Transaction, 'timestamp' | 'hash'>): Promise<Transaction> => {
    const response = await axiosInstance.post('/transactions/new', transaction);
    return response.data.transaction;
  }
};
