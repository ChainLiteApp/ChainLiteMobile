import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as blockchainService from '../services/blockchain';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

import type { Transaction } from '../services/blockchain';

export type Wallet = { address: string; privateKey: string };

export type MiningStats = {
  hashesPerSecond: number;
  totalMined: number;
  lastReward: number;
};

export type WalletContextValue = {
  // State
  wallet: Wallet | null;
  balance: number;
  transactions: Transaction[];
  nodes: string[];
  isMining: boolean;
  miningStats: MiningStats;
  isLoading: boolean;
  error: string | null;
  // Actions
  createNewWallet: () => Promise<Wallet | null>;
  importWallet: (privateKey: string) => Promise<Wallet>;
  updateBalance: (address: string) => Promise<number>;
  fetchTransactions: (address: string) => Promise<Transaction[]>;
  sendTransaction: (recipient: string, amount: number) => Promise<Transaction>;
  mineBlock: () => Promise<any>;
  registerNode: (nodeUrl: string) => Promise<string[]>;
  resolveConflicts: () => Promise<any>;
  clearWallet: () => Promise<boolean>;
};

export const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nodes, setNodes] = useState<string[]>([]);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [miningStats, setMiningStats] = useState<MiningStats>({
    hashesPerSecond: 0,
    totalMined: 0,
    lastReward: 0,
  });

  // Load wallet and initial data from secure storage on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [storedWallet, storedNodes] = await Promise.all([
          blockchainService.getWallet(),
          blockchainService.getRegisteredNodes(),
        ]);

        if (storedWallet) {
          setWallet(storedWallet);
          // Fetch balance and transactions if wallet exists
          await Promise.all([
            updateBalance(storedWallet.address),
            fetchTransactions(storedWallet.address),
          ]);
        }

        if (storedNodes) {
          setNodes(storedNodes);
        }
      } catch (e) {
        console.error('Error loading initial data:', e);
        setError('Failed to load wallet data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const createNewWallet = async (): Promise<Wallet | null> => {
    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Show security warning before creating wallet
      const proceed = await new Promise<boolean>((resolve) => {
        Alert.alert(
          'Security Warning',
          'Please make sure to back up your recovery phrase in a secure location. If you lose it, you will lose access to your funds.',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'I Understand', onPress: () => resolve(true) },
          ]
        );
      });

      if (!proceed) return null;

      const newWallet = await blockchainService.createWallet();
      setWallet(newWallet);
      setError(null);

      // Initialize balance and transactions for new wallet
      await Promise.all([
        updateBalance(newWallet.address),
        fetchTransactions(newWallet.address),
      ]);

      return newWallet;
    } catch (e) {
      console.error('Error creating wallet:', e);
      setError('Failed to create wallet');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = useCallback(async (address: string): Promise<number> => {
    try {
      const currentBalance = await blockchainService.getBalance(address);
      setBalance(currentBalance);
      return currentBalance;
    } catch (e) {
      console.error('Error updating balance:', e);
      setError('Failed to update balance');
      throw e;
    }
  }, []);

  const fetchTransactions = useCallback(async (address: string): Promise<Transaction[]> => {
    try {
      const txHistory = await blockchainService.getTransactionHistory(address);
      setTransactions(txHistory);
      return txHistory;
    } catch (e) {
      console.error('Error fetching transactions:', e);
      setError('Failed to load transaction history');
      throw e;
    }
  }, []);

  const sendTransaction = async (recipient: string, amount: number): Promise<Transaction> => {
    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (!wallet) throw new Error('No wallet available');

      const tx = await blockchainService.createTransaction(
        wallet.address,
        recipient,
        amount,
        wallet.privateKey
      );

      // Update balance and transactions after sending
      await Promise.all([
        updateBalance(wallet.address),
        fetchTransactions(wallet.address),
      ]);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return tx;
    } catch (e: any) {
      console.error('Error sending transaction:', e);
      setError(e?.message || 'Failed to send transaction');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const mineBlock = async (): Promise<any> => {
    try {
      setIsMining(true);
      setError(null);

      const result = await blockchainService.mineBlock();

      // Update mining stats
      const reward = typeof (result as any)?.reward === 'number' ? (result as any).reward : 0;
      setMiningStats((prev) => ({
        hashesPerSecond: Math.floor(Math.random() * 1000), // Simulated for now
        totalMined: prev.totalMined + reward,
        lastReward: reward,
      }));

      // Update balance and transactions after mining
      if (wallet) {
        await Promise.all([
          updateBalance(wallet.address),
          fetchTransactions(wallet.address),
        ]);
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return result;
    } catch (e) {
      console.error('Error mining block:', e);
      setError('Failed to mine block');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw e;
    } finally {
      setIsMining(false);
    }
  };

  const registerNode = async (nodeUrl: string): Promise<string[]> => {
    try {
      setIsLoading(true);
      await blockchainService.registerNode(nodeUrl);

      // Refresh nodes list
      const updatedNodes = await blockchainService.getRegisteredNodes();
      setNodes(updatedNodes);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return updatedNodes;
    } catch (e) {
      console.error('Error registering node:', e);
      setError('Failed to register node');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const resolveConflicts = async (): Promise<any> => {
    try {
      setIsLoading(true);
      const result = await blockchainService.resolveConflicts();

      if ((result as any)?.replaced && wallet) {
        await Promise.all([
          updateBalance(wallet.address),
          fetchTransactions(wallet.address),
        ]);
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return result;
    } catch (e) {
      console.error('Error resolving conflicts:', e);
      setError('Failed to resolve conflicts');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const clearWallet = async (): Promise<boolean> => {
    try {
      const confirm = await new Promise<boolean>((resolve) => {
        Alert.alert(
          'Clear Wallet',
          'This will remove your wallet from this device. Make sure you have backed up your private key!',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Clear Wallet', style: 'destructive', onPress: () => resolve(true) },
          ]
        );
      });

      if (!confirm) return false;

      // Delete actual keys used by the service layer
      await Promise.all([
        SecureStore.deleteItemAsync('wallet_private_key'),
        SecureStore.deleteItemAsync('wallet_address'),
      ]);
      setWallet(null);
      setBalance(0);
      setTransactions([]);
      setError(null);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return true;
    } catch (e) {
      console.error('Error clearing wallet:', e);
      setError('Failed to clear wallet');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw e;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        balance,
        transactions,
        nodes,
        isMining,
        miningStats,
        isLoading,
        error,
        createNewWallet,
        importWallet: blockchainService.importWallet,
        updateBalance,
        fetchTransactions,
        sendTransaction,
        mineBlock,
        registerNode,
        resolveConflicts,
        clearWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextValue => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
