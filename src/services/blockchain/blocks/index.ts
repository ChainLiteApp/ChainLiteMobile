import { api } from '../api';
import { Block } from '../types';

/**
 * Get the full blockchain
 */
export const getChain = async (): Promise<Block[]> => {
  try {
    const response = await api.get('/chain');
    return response.data.chain;
  } catch (error) {
    console.error('Error getting chain:', error);
    throw error;
  }
};

/**
 * Get latest blocks
 * @param limit Number of latest blocks to fetch
 */
export const getLatestBlocks = async (limit: number = 10): Promise<Block[]> => {
  try {
    const response = await api.get(`/blocks/latest?limit=${limit}`);
    return response.data.blocks;
  } catch (error) {
    console.error('Error getting latest blocks:', error);
    throw error;
  }
};

/**
 * Get a specific block by index
 */
export const getBlockByIndex = async (index: number): Promise<Block | null> => {
  try {
    const response = await api.get(`/blocks/${index}`);
    return response.data.block;
  } catch (error) {
    console.error(`Error getting block ${index}:`, error);
    return null;
  }
};

/**
 * Get a specific block by hash
 */
export const getBlockByHash = async (hash: string): Promise<Block | null> => {
  try {
    const response = await api.get(`/blocks/hash/${hash}`);
    return response.data.block;
  } catch (error) {
    console.error(`Error getting block with hash ${hash}:`, error);
    return null;
  }
};
