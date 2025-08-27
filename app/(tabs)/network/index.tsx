import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/ui/Header';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { getRegisteredNodes, getChain } from '@/src/services/blockchain';

export default function NetworkScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const [nodes, setNodes] = useState<string[]>([]);
  const [latestHeight, setLatestHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [n, chain] = await Promise.all([getRegisteredNodes(), getChain()]);
        setNodes(n);
        setLatestHeight(chain.length ? chain[chain.length - 1].index : null);
      } catch (e) {
        console.error('Failed to load network data', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <LinearGradient
        colors={["#0f0a22", "#0f0a22"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <LinearGradient
          colors={["rgba(122,43,202,0.34)", "rgba(122,43,202,0.0)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.2, y: 0.8 }}
          style={styles.glow}
          pointerEvents="none"
        />

        <View style={[styles.content, { paddingBottom: tabBarHeight + 24 }]}>
          <Header title="Network" subtitle="Manage your nodes" />

          {/* Network Summary */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { marginRight: 12 }]}>
              <View style={styles.summaryTop}>
                <View style={styles.iconWrap}>
                  <Ionicons name="server-outline" size={18} color="#60a5fa" />
                </View>
                <Text style={[styles.status, { color: '#60a5fa' }]}>{'ACTIVE'}</Text>
              </View>
              {loading ? (
                <ActivityIndicator color="#60a5fa" />
              ) : (
                <Text style={styles.value}>{nodes.length}</Text>
              )}
              <Text style={styles.label}>Nodes Online</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <View style={styles.iconWrap}>
                  <Ionicons name="pulse-outline" size={18} color="#22c55e" />
                </View>
                <Text style={[styles.status, { color: '#22c55e' }]}>{'SYNCED'}</Text>
              </View>
              {loading ? (
                <ActivityIndicator color="#22c55e" />
              ) : (
                <Text style={styles.value}>#{latestHeight ?? '—'}</Text>
              )}
              <Text style={styles.label}>Latest Height</Text>
            </View>
          </View>

          {/* Nodes List */}
          <Text style={styles.sectionTitle}>Nodes</Text>
          <View style={styles.nodesList}>
            {loading ? (
              <View style={{ padding: 16 }}>
                <ActivityIndicator color="#a78bfa" />
              </View>
            ) : nodes.length === 0 ? (
              <View style={{ padding: 16 }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>No nodes registered</Text>
              </View>
            ) : (
              nodes.map((node) => (
                <TouchableOpacity
                  key={node}
                  style={styles.nodeRow}
                  activeOpacity={0.9}
                  onPress={() => router.push({ pathname: '/network/node-details', params: { endpoint: node } })}
                  >
                   <View style={[styles.nodeAvatar, { backgroundColor: 'rgba(255,255,255,0.08)' }]}> 
                     <Ionicons name="cube-outline" size={18} color="#a78bfa" />
                   </View>
                   <View style={styles.nodeMain}>
                     <Text style={styles.nodeTitle}>{node}</Text>
                     <Text style={styles.nodeSub}>Registered endpoint</Text>
                   </View>
                   <View style={styles.nodeRight}>
                     <View style={[styles.statusDot, { backgroundColor: '#22c55e' }]} />
                     <Text style={styles.nodeStatus}>Online</Text>
                     <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
                   </View>
                 </TouchableOpacity>
               ))
             )}
           </View>
 
           {/* Add Node CTA */}
           <TouchableOpacity
             style={styles.addNodeBtn}
             activeOpacity={0.95}
             onPress={() => router.push('/network/add-node')}
          >
            <Ionicons name="add" size={18} color="#ffffff" />
            <Text style={styles.addNodeText}>Add Node</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#0f0a22',
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  glow: {
    position: 'absolute',
    top: -140,
    right: -120,
    width: 520,
    height: 520,
    borderRadius: 260,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
  },
  nodesList: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  nodeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nodeMain: {
    flex: 1,
  },
  nodeTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  nodeSub: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
  },
  nodeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nodeStatus: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    fontSize: 12,
    marginRight: 6,
  },
  addNodeBtn: {
    marginTop: 16,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#7a2bca',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addNodeText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});
