import BackHeader from '@/components/ui/BackHeader';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SyncChain() {
  const router = useRouter();
  return (
    <LinearGradient colors={["#0b2040", "#0a1730"]} style={styles.container}>
      <BackHeader title="Sync the Chain" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="sync-outline" size={40} color="#38bdf8" />
          </View>
          <Text style={styles.title}>Chain Synchronization</Text>
          <Text style={styles.subtitle}>How nodes reach a consistent view</Text>

          <View style={styles.divider} />
          <Text style={styles.paragraph}>
            Nodes exchange headers and blocks, validating each as they go. If they discover a longer valid chain, they switch to it to maintain consensus.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#38bdf8" />
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/network-builder/broadcast-transactions')}>
            <Text style={styles.primaryButtonText}>Next: Broadcast Tx</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 16, textAlign: 'center', marginBottom: 24 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginVertical: 20 },
  paragraph: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 16, lineHeight: 24, marginBottom: 16 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16,
    backgroundColor: 'rgba(11, 32, 64, 0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)'
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  primaryButton: { backgroundColor: '#38bdf8', borderRadius: 14, padding: 16, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  secondaryButton: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, flex: 0.5 },
  secondaryButtonText: { color: '#38bdf8', fontSize: 16, fontWeight: '600' },
});
