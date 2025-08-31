import { api } from '../api';
import { RegisterNodeResponse, ConsensusResponse } from '../types';

/**
 * Register a new node
 * @param nodeUrl URL of the node to register (e.g., 'http://192.168.0.5:5000')
 */
export const registerNode = async (nodeUrl: string): Promise<RegisterNodeResponse> => {
  try {
    const response = await api.post('/nodes/register', { nodes: [nodeUrl] });
    return response.data;
  } catch (error) {
    console.error(`Error registering node ${nodeUrl}:`, error);
    throw error;
  }
};

/**
 * Get list of connected nodes
 */
export const getNodes = async (): Promise<string[]> => {
  try {
    const response = await api.get('/nodes');
    return response.data.nodes || [];
  } catch (error) {
    console.error('Error getting nodes:', error);
    throw error;
  }
};

/**
 * Unregister a node
 */
export const unregisterNode = async (nodeUrl: string): Promise<{
  message?: string;
  removed_node?: string;
  total_nodes?: string[];
  total_count?: number;
}> => {
  try {
    const response = await api.delete(`/nodes/${encodeURIComponent(nodeUrl)}`);
    return response.data;
  } catch (error) {
    console.error(`Error unregistering node ${nodeUrl}:`, error);
    throw error;
  }
};

/**
 * Resolve blockchain conflicts by querying all nodes
 */
export const resolveConflicts = async (): Promise<ConsensusResponse> => {
  try {
    const response = await api.get('/nodes/resolve');
    return response.data;
  } catch (error) {
    console.error('Error resolving conflicts:', error);
    throw error;
  }
};
