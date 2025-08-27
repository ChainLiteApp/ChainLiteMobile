import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Header from '@/components/ui/Header';
import { getLatestBlocks, getChain, getPendingTransactions, Block, Transaction } from '@/src/services/blockchain';

export default function ExplorerScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pendingTx, setPendingTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [chainLength, setChainLength] = useState(0);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);
      const [latestBlocks, fullChain, pending] = await Promise.all([
        getLatestBlocks(6),
        getChain(),
        getPendingTransactions()
      ]);
      
      setBlocks(latestBlocks);
      setChainLength(fullChain.length);
      setPendingTx(pending);
    } catch (error) {
      console.error('Failed to load blockchain data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <View style={styles.pageContainer}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.gradientContainer}
        contentContainerStyle={styles.scrollContent}
      >
          <LinearGradient
            colors={["#3D4E81", "#5753C9", "#6E7FF3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={[0, 0.55, 1]}
            style={styles.container}>

    
         
          <View style={[styles.content, { paddingBottom: tabBarHeight + 24 }]}>
          <Header title="Explorer" subtitle="Block Explorer" />

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.9)" />
            <TextInput
              placeholder="Search blocks, transactions, addresses..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.searchInput}
            />
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Scan QR">
              <Ionicons name="scan-outline" size={22} color="rgba(255,255,255,0.95)" />
            </TouchableOpacity>
          </View>

          {/* Network Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{chainLength}</Text>
              <Text style={styles.statLabel}>Total Blocks</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{pendingTx.length}</Text>
              <Text style={styles.statLabel}>Pending Tx</Text>
            </View>
          </View>

          {/* Latest Blocks */}
          <Text style={styles.sectionTitle}>Latest Blocks</Text>
          <View style={styles.blocksScroller}>
            {loading ? (
              <Text style={styles.loadingText}>Loading blocks...</Text>
            ) : blocks.length > 0 ? (
              blocks.map((block, i) => (
                <View key={block.index} style={styles.blockCard}>
                  <View style={styles.blockHeader}>
                    <View style={styles.blockBadge}>
                      <Ionicons name="cube-outline" color="#a78bfa" size={14} />
                      <Text style={styles.blockBadgeText}>Block</Text>
                    </View>
                    <Text style={styles.blockTime}>{formatTime(block.timestamp)}</Text>
                  </View>
                  <Text style={styles.blockHeight}>#{block.index}</Text>
                  <View style={styles.blockMetaRow}>
                    <Text style={styles.blockMeta}>Tx: {block.transactions.length}</Text>
                    <Text style={styles.blockMeta}>Nonce: {block.nonce}</Text>
                  </View>
                  <Text numberOfLines={1} style={styles.blockMiner}>Hash: {block.hash}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No blocks found</Text>
            )}
          </View>

          {/* Latest Transactions
          <Text style={styles.sectionTitle}>Latest Transactions</Text>
          <View style={styles.txList}>
            {[...Array(8)].map((_, i) => (
              <View key={i} style={styles.txRow}>
                <View style={styles.txIconWrap}>
                  <Ionicons name="arrow-forward" size={16} color="#60a5fa" />
                </View>
                <View style={styles.txMain}>
                  <Text numberOfLines={1} style={styles.txHash}>0x7f3a83d1b2c4...{i}a9</Text>
                  <Text style={styles.txSub}>2 min ago • Block #18,245,9{i}1</Text>
                </View>
                <View style={styles.txRight}>
                  <Text style={styles.txValue}>3.12 CLT</Text>
                  <View style={styles.txStatus}>
                    <View style={styles.txDot} />
                    <Text style={styles.txStatusText}>Success</Text>
                  </View>
                </View>
              </View>
            ))}
          </View> */}
          </View>
          </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  glow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 52,
    marginTop: 16,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    marginHorizontal: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipActive: {
    backgroundColor: 'rgba(122,43,202,0.32)',
    borderColor: 'rgba(122,43,202,0.65)',
  },
  chipText: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 18,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginRight: 12,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  blocksScroller: {
    paddingVertical: 2,
    padding: 20,
    gap: 12,
    flexDirection: 'column',    
    alignItems: 'center',
  },
  blockCard: {
    width: '100%',
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginRight: 12,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  blockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(122,43,202,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(122,43,202,0.55)',
  },
  blockBadgeText: {
    color: '#a78bfa',
    fontWeight: '700',
    fontSize: 12,
  },
  blockTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  blockHeight: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  blockMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  blockMeta: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
  },
  blockMiner: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    paddingVertical: 8,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    paddingVertical: 8,
  },
});
