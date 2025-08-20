import Header from '@/components/ui/Header';
import MetricCard from '@/components/ui/MetricCard';
import ModuleCard from '@/components/ui/ModuleCard';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

type Module = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  colors: [string, string];
  progress?: number | null;
  onPress?: () => void;
};

export default function LearnScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();

  const modules: Module[] = [
  {
    icon: 'play-circle-outline',
    title: 'Mine Your First Block',
    subtitle: 'Experience proof-of-work mining',
    colors: ['#22c55e', '#16a34a'],
    progress: null,
    onPress: () => router.push('/mining-tutorial'),
  },
  {
    icon: 'git-network-outline',
    title: 'Build a Network',
    subtitle: 'Connect nodes and sync blockchain',
    colors: ['#60a5fa', '#06b6d4'],
    progress: 30,
    onPress: () => router.push('/network-builder'),
  },
  {
    icon: 'eye-outline',
    title: 'Block Explorer',
    subtitle: 'Dive deep into blockchain data',
    colors: ['#a855f7', '#6366f1'],
    progress: 70,
    onPress: () => router.push('/block-explorer'),
  },
  {
    icon: 'bookmark-outline',
    title: 'Consensus Challenge',
    subtitle: 'Resolve network conflicts',
    colors: ['#fb923c', '#ef4444'],
    progress: 100,
    onPress: () => router.push('/consensus-challenge'),
  },
  ];

  return (
    <LinearGradient
      colors={['#1d0b3b', '#7a2bca']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header title="ChainLite" subtitle="Learn Blockchain Interactively" />

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <MetricCard icon="flash-outline" statusLabel="LIVE" statusColor="#22c55e" value="1,247" label="Blocks Mined" style={{ marginRight: 12 }} />
          <MetricCard icon="power-outline" statusLabel="ACTIVE" statusColor="#60a5fa" value="3" label="Network Nodes" />
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Interactive Learning</Text>

        {/* Modules */}
        <View style={styles.modulesContainer}>
          {modules.map((m, idx) => (
            <View key={idx}>
              <ModuleCard density="compact" colors={m.colors} icon={m.icon} title={m.title} subtitle={m.subtitle} progress={m.progress ?? undefined} onPress={m.onPress} />
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  scrollContent: {
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBell: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  headerIconWallet: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  notifyDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fb7185',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#c7c9ff',
    marginTop: 4,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
  },
  modulesContainer: {
    gap: 12,
    marginBottom: 8,
  },
  moduleTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  moduleCard: {
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moduleIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  moduleText: {
    flex: 1,
  },
  moduleTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  moduleSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
});
