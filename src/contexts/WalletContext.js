import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as blockchainService from '../services/blockchain';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [isMining, setIsMining] = useState(false);
  const [miningStats, setMiningStats] = useState({
    hashesPerSecond: 0,
    totalMined: 0,
    lastReward: 0
  });

  // Load wallet and initial data from secure storage on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [storedWallet, storedNodes] = await Promise.all([
          blockchainService.getWallet(),
          blockchainService.getRegisteredNodes()
        ]);

        if (storedWallet) {
          setWallet(storedWallet);
          // Fetch balance and transactions if wallet exists
          await Promise.all([
            updateBalance(storedWallet.address),
            fetchTransactions(storedWallet.address)
          ]);
        }
        
        if (storedNodes) {
          setNodes(storedNodes);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Failed to load wallet data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const createNewWallet = async () => {
    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Show security warning before creating wallet
      const proceed = await new Promise((resolve) => {
        Alert.alert(
          'Security Warning',
          'Please make sure to back up your recovery phrase in a secure location. ' +
          'If you lose it, you will lose access to your funds.',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'I Understand', onPress: () => resolve(true) }
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
        fetchTransactions(newWallet.address)
      ]);
      
      return newWallet;
    } catch (error) {
      console.error('Error creating wallet:', error);
      setError('Failed to create wallet');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = useCallback(async (address) => {
    try {
      const currentBalance = await blockchainService.getBalance(address);
      setBalance(currentBalance);
      return currentBalance;
    } catch (error) {
      console.error('Error updating balance:', error);
      setError('Failed to update balance');
      throw error;
    }
  }, []);

  const fetchTransactions = useCallback(async (address) => {
    try {
      const txHistory = await blockchainService.getTransactionHistory(address);
      setTransactions(txHistory);
      return txHistory;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transaction history');
      throw error;
    }
  }, []);

  const sendTransaction = async (recipient, amount) => {
    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const tx = await blockchainService.createTransaction(
        wallet.address,
        recipient,
        amount,
        wallet.privateKey
      );
      
      // Update balance and transactions after sending
      await Promise.all([
        updateBalance(wallet.address),
        fetchTransactions(wallet.address)
      ]);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      setError(error.message || 'Failed to send transaction');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const mineBlock = async () => {
    try {
      setIsMining(true);
      setError(null);
      
      const result = await blockchainService.mineBlock();
      
      // Update mining stats
      setMiningStats(prev => ({
        hashesPerSecond: Math.floor(Math.random() * 1000), // Simulated for now
        totalMined: prev.totalMined + result.reward,
        lastReward: result.reward
      }));
      
      // Update balance and transactions after mining
      if (wallet) {
        await Promise.all([
          updateBalance(wallet.address),
          fetchTransactions(wallet.address)
        ]);
      }
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return result;
    } catch (error) {
      console.error('Error mining block:', error);
      setError('Failed to mine block');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    } finally {
      setIsMining(false);
    }
  };

  const registerNode = async (nodeUrl) => {
    try {
      setIsLoading(true);
      await blockchainService.registerNode(nodeUrl);
      
      // Refresh nodes list
      const updatedNodes = await blockchainService.getRegisteredNodes();
      setNodes(updatedNodes);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return updatedNodes;
    } catch (error) {
      console.error('Error registering node:', error);
      setError('Failed to register node');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resolveConflicts = async () => {
    try {
      setIsLoading(true);
      const result = await blockchainService.resolveConflicts();
      
      if (result.replaced) {
        // Refresh data if chain was replaced
        if (wallet) {
          await Promise.all([
            updateBalance(wallet.address),
            fetchTransactions(wallet.address)
          ]);
        }
      }
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return result;
    } catch (error) {
      console.error('Error resolving conflicts:', error);
      setError('Failed to resolve conflicts');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearWallet = async () => {
    try {
      // Confirm before clearing wallet
      const confirm = await new Promise((resolve) => {
        Alert.alert(
          'Clear Wallet',
          'This will remove your wallet from this device. Make sure you have backed up your private key!',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { 
              text: 'Clear Wallet', 
              style: 'destructive', 
              onPress: () => resolve(true) 
            }
          ]
        );
      });

      if (!confirm) return false;

      await SecureStore.deleteItemAsync('@chainlite/wallet');
      setWallet(null);
      setBalance(0);
      setTransactions([]);
      setError(null);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return true;
    } catch (error) {
      console.error('Error clearing wallet:', error);
      setError('Failed to clear wallet');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    }
  };
  
  const importWallet = async (privateKey) => {
    try {
      setIsLoading(true);
      const importedWallet = await blockchainService.importWallet(privateKey);
      setWallet(importedWallet);
      setError(null);
      
      // Initialize balance and transactions for imported wallet
      await Promise.all([
        updateBalance(importedWallet.address),
        fetchTransactions(importedWallet.address)
      ]);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return importedWallet;
    } catch (error) {
      console.error('Error importing wallet:', error);
      setError('Invalid private key or wallet import failed');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        // State
        wallet,
        balance,
        transactions,
        nodes,
        isMining,
        miningStats,
        isLoading,
        error,
        
        // Actions
        createNewWallet,
        importWallet,
        updateBalance,
        fetchTransactions,
        sendTransaction,
        mineBlock,
        registerNode,
        resolveConflicts,
        clearWallet,
      }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
