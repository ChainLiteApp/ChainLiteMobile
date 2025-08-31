import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Default configuration
const API_BASE_URL = 'https://chainlite.onrender.com';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging and auth
api.interceptors.request.use(
  async (config) => {
    // Log the request
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, 
      config.params ? `Params: ${JSON.stringify(config.params)}` : '',
      config.data ? `Data: ${JSON.stringify(config.data)}` : ''
    );

    // Add auth token if available
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error(`[API] Error: ${errorMessage}`, error.config);
    
    // Handle specific status codes
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Authentication required');
    } else if (error.response?.status === 403) {
      // Handle forbidden
      console.error('Access denied');
    } else if (error.response?.status === 404) {
      // Handle not found
      console.error('Resource not found');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to update base URL
export const setApiBaseUrl = (baseUrl: string): void => {
  api.defaults.baseURL = baseUrl;
};

// Helper function to get current base URL
export const getApiBaseUrl = (): string => {
  return api.defaults.baseURL || '';
};
