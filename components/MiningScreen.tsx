import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getMiningStatus, mineBlock, getWallet } from '@/src/services/blockchain';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function MiningScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [miningProgress, setMiningProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nonceAttempts, setNonceAttempts] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [currentBlock, setCurrentBlock] = useState<number | null>(null);

  // Mining animation effect (progress only)
  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setMiningProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return Math.min(100, prev + Math.random() * 15);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isAnimating]);

  // Poll mining status from backend
  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      try {
        const status = await getMiningStatus();
        if (!mounted) return;
        setHashRate(Math.floor(status.hashRate || 0));
        setNonceAttempts(status.nonceAttempts || 0);
        setDifficulty(status.difficulty ?? null);
        setIsAnimating(!!status.inProgress);
        setCurrentBlock(status.lastBlock?.index ?? null);
      } catch (e) {
        // ignore
      }
    };
    poll();
    const id = setInterval(poll, 1000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const startMining = async () => {
    try {
      setMiningProgress(0);
      setIsAnimating(true);
      const wallet = await getWallet();
      await mineBlock(wallet?.address);
    } catch (e) {
      // optionally show a toast
    } finally {
      // allow polling to update state
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <LinearGradient
        colors={['#0b331f', '#0e2a1e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { paddingBottom: tabBarHeight + 16 }]}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View>
            <Text style={styles.title}>Mining</Text>
            <Text style={styles.subtitle}>Real-time blockchain mining</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.smallButton, styles.smallButtonMuted]} onPress={() => router.push('/mine/history')}>
              <Ionicons name="time-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.smallButton, styles.smallButtonAccent]} onPress={() => router.push('/mine/settings')}>
              <Ionicons name="settings-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Mining Card */}
        <View style={styles.miningCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.blockTitle}>Block #{currentBlock ?? '—'}</Text>
          <Text style={styles.blockSubtitle}>Finding the perfect nonce...</Text>
        </View>

        {/* Mining Progress Circle */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <View style={[styles.progressFill, { 
              transform: [{ 
                rotate: `${(miningProgress / 100) * 360}deg` 
              }] 
            }]} />
            <View style={styles.progressInner}>
              <Text style={styles.progressText}>{Math.floor(miningProgress)}%</Text>
              <Text style={styles.progressLabel}>Mining Progress</Text>
            </View>
          </View>
        </View>

          {/* Mining Stats */}
          <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{nonceAttempts.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Nonce{'\n'}Attempts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{hashRate.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Hash Rate{'\n'}(H/s)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{difficulty ?? '—'}</Text>
            <Text style={styles.statLabel}>Difficulty</Text>
          </View>
          </View>

          {/* Start Mining Button */}
          <TouchableOpacity
            style={[styles.miningButton, isAnimating && styles.miningButtonDisabled]}
            onPress={startMining}
            disabled={isAnimating}
            activeOpacity={0.9}
          >
            <LinearGradient colors={["#35d07f", "#14b45a"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.miningButtonGrad}>
              <Text style={styles.miningButtonText}>
                {isAnimating ? 'Mining Block...' : 'Start Mining'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Educational Card */}
        <View style={styles.educationCard}>
          <View style={styles.educationIcon}>
            <Ionicons name="code" size={16} color="white" />
          </View>
          <View style={styles.educationContent}>
            <Text style={styles.educationTitle}>Mining Explained</Text>
            <Text style={styles.educationText}>
              Mining involves finding a nonce (random number) that, when combined
              with block data, produces a hash starting with a specific number of
              zeros. This proves computational work was done.
            </Text>
          </View>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    fontSize: 15,
    color: '#c7c9ff',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  smallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonMuted: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  smallButtonAccent: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  miningCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  blockTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  blockSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: '#7a2bca',
    borderRightColor: '#7a2bca',
  },
  progressInner: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  progressLabel: {
    fontSize: 14,
    color: '#a78bfa',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
  miningButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  miningButtonGrad: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  miningButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  miningButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  educationCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  educationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  educationContent: {
    flex: 1,
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#93c5fd',
    marginBottom: 4,
  },
  educationText: {
    fontSize: 14,
    color: '#bfdbfe',
    lineHeight: 20,
  },
});
