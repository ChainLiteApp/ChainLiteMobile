import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ModuleCard from '../../components/ui/ModuleCard';
import * as blockchainService from '../services/blockchain';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [blockchainInfo, setBlockchainInfo] = useState({
    chainLength: 1247,
    nodes: 3,
  });
  const [activeTab, setActiveTab] = useState('home');

  const fetchBlockchainData = async () => {
    try {
      setRefreshing(true);
      const [chain, , nodes] = await Promise.all([
        blockchainService.getChain(),
        blockchainService.getPendingTransactions(),
        blockchainService.getRegisteredNodes(),
      ]);
      setBlockchainInfo({
        chainLength: chain.length,
        nodes: nodes.length,
      });
    } catch (error) {
      // fallback to demo values
      setBlockchainInfo({ chainLength: 1247, nodes: 3 });
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Force status bar style when this screen is focused
      StatusBar.setBarStyle('light-content');
    }, [])
  );

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const modules = [
    {
      icon: 'play-circle-outline',
      title: 'Mine Your First Block',
      subtitle: 'Experience proof-of-work mining',
      colors: ['#22c55e', '#16a34a'],
      progress: null,
      onPress: () => {},
    },
    {
      icon: 'git-network-outline',
      title: 'Build a Network',
      subtitle: 'Connect nodes and sync blockchain',
      colors: ['#60a5fa', '#06b6d4'],
      progress: 30,
      onPress: () => {},
    },
    {
      icon: 'eye-outline',
      title: 'Block Explorer',
      subtitle: 'Dive deep into blockchain data',
      colors: ['#a855f7', '#6366f1'],
      progress: 70,
      onPress: () => {},
    },
    {
      icon: 'bookmark-outline',
      title: 'Consensus Challenge',
      subtitle: 'Resolve network conflicts',
      colors: ['#fb923c', '#ef4444'],
      progress: 100,
      onPress: () => {},
    },
  ];

  const navigationTabs = [
    { icon: 'home-outline', label: 'Homeee', id: 'home' },
    { icon: 'paper-plane-outline', label: 'Explore', id: 'explore' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchBlockchainData}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>ChainLiteeee</Text>
            <Text style={styles.subtitle}>Learn Blockchain Interactively</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardGreen]}> 
            <Ionicons name="cube-outline" size={28} color="#22c55e" style={styles.statIcon} />
            <Text style={styles.statValue}>{blockchainInfo.chainLength.toLocaleString()}</Text>
            <Text style={styles.statLabel}>LIVE Blocks Mineeee</Text>
          </View>
          <View style={[styles.statCard, styles.statCardBlue]}> 
            <Ionicons name="people-outline" size={28} color="#3b82f6" style={styles.statIcon} />
            <Text style={styles.statValue}>{blockchainInfo.nodes}</Text>
            <Text style={styles.statLabel}>Active Network Nodes</Text>
          </View>
        </View>

        {/* Interactive Learning */}
        <Text style={styles.sectionTitle}>Interactive Learning</Text>
        <View style={styles.modulesContainer}>
          {modules.map((m, idx) => (
            <View key={idx} style={{ marginBottom: 18 }}>
              <ModuleCard
                colors={m.colors}
                icon={m.icon}
                title={m.title}
                subtitle={m.subtitle}
                onPress={m.onPress}
                progress={m.progress ?? undefined}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {navigationTabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={styles.navItem}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={activeTab === tab.id ? '#0891b2' : '#94a3b8'}
            />
            <Text style={[styles.navLabel, activeTab === tab.id && styles.activeNavLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Match the dark theme background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#9ca3af',
    marginTop: 2,
    fontWeight: '400',
  },
  notificationButton: {
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#312e81', // Darker card background
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  statCardGreen: {
    borderColor: '#22c55e',
  },
  statCardBlue: {
    borderColor: '#3b82f6',
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 20,
    marginBottom: 20,
    marginTop: 8,
    letterSpacing: -0.5,
  },
  modulesContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(14px)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 80,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },
  activeNavLabel: {
    color: '#0891b2',
    fontWeight: '600',
  },
});

export default HomeScreen;
