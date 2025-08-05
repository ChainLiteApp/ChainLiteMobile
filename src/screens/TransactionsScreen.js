import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as blockchainService from '../services/blockchain';
import { formatDistanceToNow } from 'date-fns';

const TransactionsScreen = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      // Get the full blockchain
      const chainData = await blockchainService.getChain();
      
      // Extract all transactions from all blocks
      let allTransactions = [];
      if (chainData?.chain) {
        chainData.chain.forEach(block => {
          if (block.transactions && block.transactions.length > 0) {
            // Add block index and timestamp to each transaction
            const blockTransactions = block.transactions.map(tx => ({
              ...tx,
              blockIndex: block.index,
              timestamp: block.timestamp,
              confirmed: true
            }));
            allTransactions = [...allTransactions, ...blockTransactions];
          }
        });
      }
      
      // Add pending transactions if any
      if (chainData?.pending_transactions?.length > 0) {
        const pendingTxs = chainData.pending_transactions.map(tx => ({
          ...tx,
          blockIndex: 'Pending',
          timestamp: new Date().toISOString(),
          confirmed: false
        }));
        allTransactions = [...pendingTxs, ...allTransactions];
      }
      
      setTransactions(allTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions(false);
  };
  
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const renderTransactionItem = ({ item }) => {
    const isPending = !item.confirmed;
    const timestamp = new Date(item.timestamp);
    const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });
    
    return (
      <TouchableOpacity 
        style={[
          styles.transactionItem, 
          isPending && styles.pendingTransaction
        ]}
        onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
      >
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionHash} numberOfLines={1} ellipsizeMode="middle">
            {item.signature?.substring(0, 12)}...{item.signature?.substring(item.signature.length - 6)}
          </Text>
          <Text style={[
            styles.transactionStatus,
            isPending ? styles.pendingStatus : styles.confirmedStatus
          ]}>
            {isPending ? 'PENDING' : 'CONFIRMED'}
          </Text>
        </View>
        
        <View style={styles.transactionDetails}>
          <View style={styles.addressContainer}>
            <Text style={styles.label}>From:</Text>
            <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle">
              {item.sender || 'System'}
            </Text>
          </View>
          
          <View style={styles.addressContainer}>
            <Text style={styles.label}>To:</Text>
            <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle">
              {item.recipient}
            </Text>
          </View>
          
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>{parseFloat(item.amount).toFixed(2)} CLT</Text>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>
        </View>
        
        {item.blockIndex !== 'Pending' && (
          <Text style={styles.blockInfo}>Block: {item.blockIndex}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity 
          style={styles.newTransactionButton}
          onPress={() => navigation.navigate('CreateTransaction')}
        >
          <Text style={styles.newTransactionButtonText}>New Transaction</Text>
        </TouchableOpacity>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchTransactions}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => item.signature || `tx-${index}`}
          renderItem={renderTransactionItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No transactions found</Text>
          <Text style={styles.emptyStateSubtext}>Your transactions will appear here</Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => navigation.navigate('CreateTransaction')}
          >
            <Text style={styles.emptyStateButtonText}>Create your first transaction</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  newTransactionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  newTransactionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  transactionItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    margin: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pendingTransaction: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  transactionHash: {
    flex: 1,
    fontFamily: 'monospace',
    color: '#666',
    fontSize: 12,
  },
  transactionStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: 'hidden',
    textAlign: 'center',
    minWidth: 70,
  },
  pendingStatus: {
    backgroundColor: '#FFF4E5',
    color: '#FF9500',
  },
  confirmedStatus: {
    backgroundColor: '#E8F5E9',
    color: '#34C759',
  },
  transactionDetails: {
    marginTop: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  label: {
    width: 50,
    color: '#666',
    fontSize: 14,
  },
  address: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
  },
  blockInfo: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default TransactionsScreen;
