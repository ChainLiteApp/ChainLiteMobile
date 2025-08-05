import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as blockchainService from '../services/blockchain';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [blockchainInfo, setBlockchainInfo] = useState({
    chainLength: 0,
    pendingTransactions: 0,
    nodes: 0,
    lastBlock: null,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [isMining, setIsMining] = useState(false);

  const fetchBlockchainData = async () => {
    try {
      setRefreshing(true);
      const [chain, pendingTx, nodes] = await Promise.all([
        blockchainService.getChain(),
        blockchainService.getPendingTransactions(),
        blockchainService.getRegisteredNodes(),
      ]);

      setBlockchainInfo({
        chainLength: chain.length,
        pendingTransactions: pendingTx.length,
        nodes: nodes.length,
        lastBlock: chain[chain.length - 1],
      });
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
      Alert.alert('Error', 'Failed to fetch blockchain data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleMineBlock = async () => {
    try {
      setIsMining(true);
      await blockchainService.mineBlock();
      await fetchBlockchainData();
      Alert.alert('Success', 'New block mined successfully!');
    } catch (error) {
      console.error('Error mining block:', error);
      Alert.alert('Error', 'Failed to mine block');
    } finally {
      setIsMining(false);
    }
  };

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={24} color={color} style={styles.statIcon} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const ActionButton = ({ title, onPress, icon, color, disabled = false }) => (
    <TouchableOpacity 
      style={[styles.actionButton, { 
        backgroundColor: disabled ? '#CCCCCC' : color 
      }]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={icon} size={20} color="white" style={styles.actionIcon} />
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );

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
      <View style={styles.header}>
        <Text style={styles.title}>ChainLite</Text>
        <Text style={styles.subtitle}>Your Personal Blockchain</Text>
      </View>

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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <ActionButton
            title="Send"
            icon="arrow-up"
            color="#FF3B30"
            onPress={() => navigateTo('CreateTransaction')}
          />
          <ActionButton
            title="Receive"
            icon="arrow-down"
            color="#34C759"
            onPress={() => navigateTo('Wallet')}
          />
          <ActionButton
            title={isMining ? 'Mining...' : 'Mine'}
            icon="hammer"
            color="#5856D6"
            onPress={handleMineBlock}
            disabled={isMining}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Block</Text>
        {blockchainInfo.lastBlock ? (
          <View style={styles.blockCard}>
            <Text style={styles.blockHash} numberOfLines={1} ellipsizeMode="middle">
              Hash: {blockchainInfo.lastBlock.hash}
            </Text>
            <View style={styles.blockInfo}>
              <Text style={styles.blockInfoText}>
                Index: {blockchainInfo.lastBlock.index}
              </Text>
              <Text style={styles.blockInfoText}>
                Transactions: {blockchainInfo.lastBlock.transactions?.length || 0}
              </Text>
            </View>
            <Text style={styles.blockTimestamp}>
              {new Date(blockchainInfo.lastBlock.timestamp).toLocaleString()}
            </Text>
          </View>
        ) : (
          <Text style={styles.noData}>No blocks found. Start by mining the first block!</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    padding: 25,
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blockHash: {
    fontFamily: 'monospace',
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
  },
  blockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  blockInfoText: {
    color: '#666',
    fontSize: 14,
  },
  blockTimestamp: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
