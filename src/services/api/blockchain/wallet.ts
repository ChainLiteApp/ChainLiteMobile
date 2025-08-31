import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Wallet } from './types';

const WALLET_STORAGE_KEY = 'chainlite_wallet';

/**
 * Generate a new wallet
 */
export const generateWallet = async (): Promise<Wallet> => {
  // In a real app, you would use a proper cryptographic library like elliptic or @noble/secp256k1
  // This is a simplified version for demonstration
  const address = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const privateKey = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const publicKey = `0x${Array(66).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  const wallet = { address, privateKey, publicKey };
  
  // Save to secure storage
  await saveWallet(wallet);
  
  return wallet;
};

/**
 * Get the current wallet from secure storage
 */
export const getWallet = async (): Promise<Wallet | null> => {
  try {
    const jsonWallet = await SecureStore.getItemAsync(WALLET_STORAGE_KEY);
    return jsonWallet ? JSON.parse(jsonWallet) : null;
  } catch (error) {
    console.error('Error getting wallet:', error);
    return null;
  }
};

/**
 * Save wallet to secure storage
 */
const saveWallet = async (wallet: Wallet): Promise<void> => {
  try {
    await SecureStore.setItemAsync(WALLET_STORAGE_KEY, JSON.stringify(wallet));
  } catch (error) {
    console.error('Error saving wallet:', error);
    throw new Error('Failed to save wallet');
  }
};

/**
 * Clear the wallet from storage (logout)
 */
export const clearWallet = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(WALLET_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing wallet:', error);
  }
};
