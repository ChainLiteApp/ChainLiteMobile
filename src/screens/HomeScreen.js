import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const modules = [
    {
      icon: 'hammer-outline',
      title: 'Interactive Mining',
      subtitle: 'Mine Your First proof-of-work block',
      color: '#22c55e',
      progress: null,
      onPress: () => {},
    },
    {
      icon: 'git-network-outline',
      title: 'Build a Network',
      subtitle: 'Blockchain and sync',
      color: '#3b82f6',
      progress: 80,
      onPress: () => {},
    },
    {
      icon: 'search-outline',
      title: 'Blockchain Explorer',
      subtitle: 'Dive deep into Blockchain data',
      color: '#8b5cf6',
      progress: 0,
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
          {modules.map((module, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.moduleCard, { backgroundColor: module.color }]}
              activeOpacity={0.9}
              onPress={module.onPress}
            >
              <View style={styles.moduleContent}>
                <Ionicons name={module.icon} size={24} color="#fff" style={styles.moduleIcon} />
                <View style={styles.moduleTextContainer}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
              </View>
              {typeof module.progress === 'number' && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${module.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{module.progress}% Complete</Text>
                </View>
              )}
            </TouchableOpacity>
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
            activeOpacity={0.7}
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
    backgroundColor: '#fff', // Darker purple background to match screenshot
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
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 20,
    marginBottom: 16,
  },
  modulesContainer: {
    marginHorizontal: 20,
  },
  moduleCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  moduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleIcon: {
    marginRight: 12,
  },
  moduleTextContainer: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  moduleSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '400',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
    fontWeight: '500',
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
