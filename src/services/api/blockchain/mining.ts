import { axiosInstance } from '../axiosConfig';
import type { MiningStatus } from './types';

export const miningAPI = {
  /**
   * Get current mining status
   */
  getStatus: async (): Promise<MiningStatus> => {
    const response = await axiosInstance.get('/mining/status');
    return response.data;
  },

  /**
   * Start mining a new block
   * @param minerAddress The address that will receive the mining reward
   */
  startMining: async (minerAddress: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post('/mine', { address: minerAddress });
    return response.data;
  },

  /**
   * Get current mining difficulty
   */
  getDifficulty: async (): Promise<number> => {
    const response = await axiosInstance.get('/difficulty');
    return response.data.difficulty;
  }
};
