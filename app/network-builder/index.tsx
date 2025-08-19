import BackHeader from '@/components/ui/BackHeader';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NetworkBuilderScreen() {
  const router = useRouter();
  const steps = [
    { label: 'Connect Nodes', route: '/network-builder/connect-nodes', index: 1 },
    { label: 'Sync the Chain', route: '/network-builder/sync-chain', index: 2 },
    { label: 'Broadcast Transactions', route: '/network-builder/broadcast-transactions', index: 3 },
  ];

  return (
    <LinearGradient colors={["#0b2040", "#0a1730"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <BackHeader title="Build a Network" onBack={() => router.back()} backgroundColor="transparent" tintColor="#eaf2ff" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.heroIconWrap}>
            <View style={styles.heroIconBg}>
              <Ionicons name="git-network-outline" size={34} color="#eaf2ff" />
            </View>
          </View>
          <Text style={styles.cardTitle}>Peer-to-Peer Basics</Text>
          <Text style={styles.cardSubtitle}>Connect nodes and keep data in sync</Text>

          <View style={styles.steps}>
            {steps.map((step) => (
              <TouchableOpacity
                key={step.label}
                activeOpacity={0.9}
                style={styles.stepRow}
                onPress={() => router.push(step.route)}
              >
                <View style={styles.stepIcon}>
                  <Text style={styles.stepIndex}>{step.index}</Text>
                </View>
                <Text style={styles.stepText}>{step.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.9)" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)'
  },
  heroIconWrap: { alignItems: 'center', marginTop: 4, marginBottom: 10 },
  heroIconBg: {
    width: 76, height: 76, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(96, 165, 250, 0.25)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)'
  },
  cardTitle: { color: '#eaf2ff', fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 6 },
  cardSubtitle: { color: 'rgba(226,237,255,0.85)', fontSize: 15, textAlign: 'center', marginTop: 6 },
  steps: { marginTop: 16, gap: 12 },
  stepRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.10)'
  },
  stepIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: 'rgba(255,255,255,0.12)' },
  stepIndex: { color: '#eaf2ff', fontWeight: '800' },
  stepText: { color: '#eaf2ff', fontSize: 16, fontWeight: '700', flex: 1 },
});
