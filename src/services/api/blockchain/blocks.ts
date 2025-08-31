import { axiosInstance } from '../axiosConfig';
import type { Block } from './types';

export const blocksAPI = {
  /**
   * Get the full blockchain
   */
  getChain: async (): Promise<Block[]> => {
    const response = await axiosInstance.get('/chain');
    return response.data.chain;
  },

  /**
   * Get latest blocks
   * @param limit Number of latest blocks to fetch
   */
  getLatestBlocks: async (limit: number = 10): Promise<Block[]> => {
    const response = await axiosInstance.get(`/blocks/latest?limit=${limit}`);
    return response.data.blocks;
  },

  /**
   * Get a specific block by index
   */
  getBlockByIndex: async (index: number): Promise<Block> => {
    const response = await axiosInstance.get(`/blocks/${index}`);
    return response.data.block;
  }
};
