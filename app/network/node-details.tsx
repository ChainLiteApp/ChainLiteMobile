import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';
import { getRegisteredNodes, getChain } from '@/src/services/blockchain';

export default function NodeDetailsScreen() {
  const router = useRouter();
  const { endpoint } = useLocalSearchParams<{ endpoint?: string | string[] }>();

  const endpointStr = useMemo(() => {
    const raw = Array.isArray(endpoint) ? endpoint[0] : endpoint || '';
    return raw;
  }, [endpoint]);

  const { host, port } = useMemo(() => {
    if (!endpointStr) return { host: '—', port: '—' };
    try {
      const url = new URL(endpointStr.includes('://') ? endpointStr : `http://${endpointStr}`);
      return { host: url.hostname || '—', port: url.port || '—' };
    } catch {
      // Fallback naive parsing
      const parts = endpointStr.replace(/^https?:\/\//, '').split(':');
      return { host: parts[0] || '—', port: parts[1] || '—' };
    }
  }, [endpointStr]);

  const [loading, setLoading] = useState(true);
  const [latestHeight, setLatestHeight] = useState<number | null>(null);
  const [peers, setPeers] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [nodes, chain] = await Promise.all([getRegisteredNodes(), getChain()]);
        setPeers(Math.max(0, (nodes?.length || 0) - 1));
        setLatestHeight(chain.length ? chain[chain.length - 1].index : null);
      } catch (e) {
        console.error('Failed to load node details info', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#0f0a22", "#0f0a22"]} style={styles.container}>
        <BackHeader title="Node Details" onBack={() => router.back()} />

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Overview</Text>
            <View style={styles.row}><Text style={styles.key}>Endpoint</Text><Text style={styles.value}>{endpointStr || 'Unknown'}</Text></View>
            <View style={styles.row}><Text style={styles.key}>IP / Host</Text><Text style={styles.value}>{host}</Text></View>
            <View style={styles.row}><Text style={styles.key}>Port</Text><Text style={styles.value}>{port}</Text></View>
            <View style={styles.row}><Text style={styles.key}>Status</Text><Text style={styles.value}>Online</Text></View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sync</Text>
            <View style={styles.row}><Text style={styles.key}>Height</Text><Text style={styles.value}>{loading ? <ActivityIndicator color="#22c55e" /> : latestHeight !== null ? `#${latestHeight}` : '—'}</Text></View>
            <View style={styles.row}><Text style={styles.key}>Peers</Text><Text style={styles.value}>{loading ? <ActivityIndicator color="#22c55e" /> : peers !== null ? peers : '—'}</Text></View>
            <View style={styles.row}><Text style={styles.key}>Last Block</Text><Text style={styles.value}>—</Text></View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0a22' },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 16,
    marginTop: 16,
  },
  cardTitle: { color: '#ffffff', fontWeight: '800', fontSize: 18, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  key: { color: 'rgba(255,255,255,0.7)', fontWeight: '700' },
  value: { color: '#ffffff', fontWeight: '800' },
});
