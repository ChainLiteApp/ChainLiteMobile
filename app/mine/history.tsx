import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useNavigation } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';
import { getLatestBlocks, Block } from '@/src/services/blockchain';

const formatTimestamp = (timestamp: number) => {
  const now = Date.now();
  const diff = Math.floor((now - timestamp * 1000) / 1000 / 60); // minutes ago
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function MiningHistoryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const latestBlocks = await getLatestBlocks(15);
        setBlocks(latestBlocks);
      } catch (error) {
        console.error('Failed to load mining history:', error);
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };
    loadBlocks();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#0f0a22", "#0f0a22"]} style={styles.container}>
        <BackHeader title="Mining History" onBack={() => router.back()} />

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7a2bca" />
              <Text style={styles.loadingText}>Loading blocks...</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {blocks.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No blocks found</Text>
                </View>
              ) : (
                blocks.map((block) => (
                  <View key={block.hash} style={styles.row}>
                    <Text style={styles.hash}>Block #{block.index}</Text>
                    <Text style={styles.sub}>
                      {formatTimestamp(block.timestamp)} • Reward 2 CLT
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0a22' },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  list: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginTop: 16,
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  hash: { color: '#ffffff', fontWeight: '800' },
  sub: { color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  // Added styles
  loadingContainer: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '700' },
  emptyContainer: { paddingVertical: 36, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.75)', fontWeight: '700' },
});
