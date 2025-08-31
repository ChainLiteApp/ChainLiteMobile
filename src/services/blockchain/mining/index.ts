import { api } from '../api';
import { MiningStatus, MineResponse } from '../types';

/**
 * Get current mining status
 */
export const getMiningStatus = async (): Promise<MiningStatus> => {
  try {
    const response = await api.get('/mining/status');
    return response.data;
  } catch (error) {
    console.error('Error getting mining status:', error);
    throw error;
  }
};

/**
 * Start mining a new block
 * @param minerAddress The address that will receive the mining reward
 */
export const startMining = async (minerAddress: string): Promise<MineResponse> => {
  try {
    const response = await api.post('/mine', { address: minerAddress });
    return response.data;
  } catch (error) {
    console.error('Error starting mining:', error);
    throw error;
  }
};

/**
 * Get current mining difficulty
 */
export const getDifficulty = async (): Promise<number> => {
  try {
    const response = await api.get('/difficulty');
    return response.data.difficulty;
  } catch (error) {
    console.error('Error getting difficulty:', error);
    throw error;
  }
};
