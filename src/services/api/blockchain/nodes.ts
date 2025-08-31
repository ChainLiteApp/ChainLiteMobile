import { axiosInstance } from '../axiosConfig';

export const nodesAPI = {
  /**
   * Get list of connected nodes
   */
  getNodes: async (): Promise<string[]> => {
    const response = await axiosInstance.get('/nodes');
    return response.data.nodes || [];
  },

  /**
   * Register a new node
   * @param nodeUrl URL of the node to register (e.g., 'http://192.168.0.5:5000')
   */
  registerNode: async (nodeUrl: string): Promise<{ message: string; totalNodes: string[] }> => {
    const response = await axiosInstance.post('/nodes/register', { nodes: [nodeUrl] });
    return response.data;
  },

  /**
   * Resolve blockchain conflicts by querying all nodes
   */
  resolveConflicts: async (): Promise<{ message: string; chain: any[] }> => {
    const response = await axiosInstance.get('/nodes/resolve');
    return response.data;
  }
};
