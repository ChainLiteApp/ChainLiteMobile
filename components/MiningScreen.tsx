import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function MiningScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [miningProgress, setMiningProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nonceAttempts, setNonceAttempts] = useState(15420);
  const [hashRate, setHashRate] = useState(6704);

  // Mining animation effect
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setMiningProgress(prev => {
          if (prev >= 100) {
            setIsAnimating(false);
            return 0;
          }
          return prev + Math.random() * 15;
        });
        
        // Update nonce attempts during mining
        setNonceAttempts(prev => prev + Math.floor(Math.random() * 100));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const startMining = () => {
    setMiningProgress(0);
    setIsAnimating(true);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <LinearGradient
      colors={['#1f2937', '#065f46']}
      style={[styles.container, { paddingBottom: tabBarHeight + 16 }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mining Lab</Text>
          <Text style={styles.subtitle}>Real-time blockchain mining</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="hardware-chip" size={24} color="white" />
        </View>
      </View>

      {/* Mining Card */}
      <View style={styles.miningCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.blockTitle}>Block #1248</Text>
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
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Difficulty</Text>
          </View>
        </View>

        {/* Start Mining Button */}
        <TouchableOpacity
          style={[styles.miningButton, isAnimating && styles.miningButtonDisabled]}
          onPress={startMining}
          disabled={isAnimating}
        >
          <Text style={styles.miningButtonText}>
            {isAnimating ? 'Mining Block...' : 'Start Mining'}
          </Text>
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
    color: '#9ca3af',
    marginTop: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderTopColor: '#22c55e',
    borderRightColor: '#22c55e',
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
    color: '#22c55e',
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
    backgroundColor: '#22c55e',
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
