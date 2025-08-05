import React, { useState, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

// Import components
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Import services and types
import * as blockchainService from '@/app/services/blockchain';
import type { Block } from '@/app/services/blockchain';

// Types
interface BlockchainState {
  chainLength: number;
  pendingTransactions: number;
  nodes: number;
  lastBlock: Block | null;
  walletAddress: string | null;
  balance: number;
  error: string | null;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  disabled?: boolean;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <ThemedView style={[styles.statCard, { borderLeftColor: color }]}>
    <Ionicons name={icon} size={24} color={color} style={styles.statIcon} />
    <ThemedText style={styles.statValue}>{value}</ThemedText>
    <ThemedText style={styles.statTitle}>{title}</ThemedText>
  </ThemedView>
);

const ActionButton = ({ 
  title, 
  onPress, 
  icon, 
  color, 
  disabled = false 
}: ActionButtonProps) => (
  <TouchableOpacity 
    style={[styles.actionButton, { 
      backgroundColor: disabled ? '#CCCCCC' : color,
    }]}
    onPress={onPress}
    disabled={disabled}
  >
    <Ionicons name={icon} size={20} color="white" style={styles.actionIcon} />
    <ThemedText style={styles.actionText}>{title}</ThemedText>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainState>({
    chainLength: 0,
    pendingTransactions: 0,
    nodes: 0,
    lastBlock: null,
    walletAddress: null,
    balance: 0,
  error: null,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [isMining, setIsMining] = useState(false);

  const fetchBlockchainData = async () => {
    try {
      setRefreshing(true);
      
      // Get wallet address if it exists
      let walletAddress: string | null = null;
      try {
        walletAddress = await blockchainService.getWalletAddress();
      } catch (error) {
        console.warn('No wallet found, proceeding without it');
      }
      
      try {
        // Fetch blockchain data in parallel
        const [chain, pendingTx, nodes] = await Promise.all([
          blockchainService.getChain(),
          blockchainService.getPendingTransactions(),
          blockchainService.getRegisteredNodes(),
        ]);
        
        // Get balance if wallet exists
        let balance = 0;
        if (walletAddress) {
          try {
            balance = await blockchainService.getBalance(walletAddress);
          } catch (error) {
            console.warn('Failed to fetch balance:', error);
          }
        }

        setBlockchainInfo(prev => ({
          ...prev,
          chainLength: chain.length,
          pendingTransactions: pendingTx.length,
          nodes: nodes.length,
          lastBlock: chain[chain.length - 1] || null,
          walletAddress,
          balance,
          error: null,
        }));
      } catch (error) {
        console.error('Error fetching blockchain data:', error);
        setBlockchainInfo(prev => ({
          ...prev,
          error: 'Failed to connect to blockchain server. Make sure it\'s running and accessible.',
        }));
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setRefreshing(false);
    }
  };

  const handleMineBlock = async () => {
    if (!blockchainInfo.walletAddress) {
      Alert.alert('Error', 'Please create a wallet first');
      return;
    }

    try {
      setIsMining(true);
      await blockchainService.mineBlock(blockchainInfo.walletAddress);
      await fetchBlockchainData();
      Alert.alert('Success', 'New block mined successfully!');
    } catch (error) {
      console.error('Error mining block:', error);
      Alert.alert('Error', 'Failed to mine block');
    } finally {
      setIsMining(false);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchBlockchainData}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>ChainLite</ThemedText>
        <ThemedText style={styles.subtitle}>Your Personal Blockchain</ThemedText>
        
        {blockchainInfo.error ? (
          <ThemedView style={styles.errorContainer}>
            <Ionicons name="warning" size={20} color="#FF3B30" style={styles.errorIcon} />
            <ThemedText style={styles.errorText}>{blockchainInfo.error}</ThemedText>
          </ThemedView>
        ) : (
          <>
            {blockchainInfo.walletAddress && (
              <ThemedText style={styles.walletAddress} numberOfLines={1} ellipsizeMode="middle">
                {blockchainInfo.walletAddress}
              </ThemedText>
            )}
            <ThemedText style={styles.balance}>
              Balance: {blockchainInfo.balance} CLT
            </ThemedText>
          </>
        )}
      </ThemedView>

      <View style={styles.statsContainer}>
        <StatCard 
          title="Blocks" 
          value={blockchainInfo.chainLength} 
          icon="cube" 
          color="#007AFF" 
        />
        <StatCard 
          title="Pending Tx" 
          value={blockchainInfo.pendingTransactions} 
          icon="swap-horizontal" 
          color="#34C759" 
        />
        <StatCard 
          title="Nodes" 
          value={blockchainInfo.nodes} 
          icon="globe" 
          color="#FF9500" 
        />
      </View>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
        <View style={styles.actionsContainer}>
          <ActionButton
            title="Send"
            icon="arrow-up"
            color="#FF3B30"
            onPress={() => router.push('/send' as any)}
          />
          <ActionButton
            title="Receive"
            icon="arrow-down"
            color="#34C759"
            onPress={() => router.push('/receive' as any)}
          />
          <ActionButton
            title={isMining ? 'Mining...' : 'Mine'}
            icon="hammer"
            color="#5856D6"
            onPress={handleMineBlock}
            disabled={isMining}
          />
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Latest Block</ThemedText>
        {blockchainInfo.lastBlock ? (
          <ThemedView style={styles.blockCard}>
            <ThemedText style={styles.blockHash} numberOfLines={1} ellipsizeMode="middle">
              Hash: {blockchainInfo.lastBlock.hash}
            </ThemedText>
            <View style={styles.blockInfo}>
              <ThemedText style={styles.blockInfoText}>
                Index: {blockchainInfo.lastBlock.index}
              </ThemedText>
              <ThemedText style={styles.blockInfoText}>
                Transactions: {blockchainInfo.lastBlock.transactions?.length || 0}
              </ThemedText>
            </View>
            <ThemedText style={styles.blockTimestamp}>
              {new Date(blockchainInfo.lastBlock.timestamp).toLocaleString()}
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedText style={styles.noData}>No blocks found. Start by mining the first block!</ThemedText>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    borderLeftWidth: 4,
  },
  statIcon: {
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  blockCard: {
    borderRadius: 12,
    padding: 15,
  },
  blockHash: {
    fontFamily: 'monospace',
    fontSize: 14,
    marginBottom: 10,
  },
  blockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  blockInfoText: {
    opacity: 0.7,
    fontSize: 14,
  },
  blockTimestamp: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  noData: {
    textAlign: 'center',
    opacity: 0.6,
    marginVertical: 20,
    fontStyle: 'italic',
  },
  walletAddress: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
    maxWidth: '80%',
  },
  balance: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#007AFF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: '#FF3B30',
    flex: 1,
  },
});
