import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { logApiCall } from './helpers/apiLogger';

// Base URL config (ENV override with sensible default)
const BASE_URL = (process.env as any)?.EXPO_PUBLIC_API_BASE_URL || 'https://chainlite.onrender.com';
const SECURE_STORE_KEYS = {
  API_BASE_URL: 'api_base_url',
};

// Create base axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    logApiCall({
      method: config.method || 'get',
      url: config.url || '',
      data: config.data
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ----- Base URL helpers (compat with legacy service) -----
export const setApiBaseUrl = (baseUrl: string) => {
  axiosInstance.defaults.baseURL = baseUrl;
};

export const getApiBaseUrl = (): string | undefined => {
  return axiosInstance.defaults.baseURL;
};

export const saveApiBaseUrl = async (baseUrl: string) => {
  try {
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.API_BASE_URL, baseUrl);
  } catch {}
  setApiBaseUrl(baseUrl);
};

export const initializeApiBaseUrl = async () => {
  try {
    const stored = await SecureStore.getItemAsync(SECURE_STORE_KEYS.API_BASE_URL);
    let chosen = (process.env as any)?.EXPO_PUBLIC_API_BASE_URL || stored || BASE_URL;
    // If emulator-specific host saved while not on Android, adjust
    if (Platform.OS !== 'android' && chosen?.includes('10.0.2.2')) {
      const corrected = chosen.replace('10.0.2.2', '127.0.0.1');
      chosen = corrected;
      try { await SecureStore.setItemAsync(SECURE_STORE_KEYS.API_BASE_URL, corrected); } catch {}
    }
    setApiBaseUrl(chosen);
  } catch {
    setApiBaseUrl(BASE_URL);
  }
};
