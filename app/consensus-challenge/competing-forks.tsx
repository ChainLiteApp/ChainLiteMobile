import BackHeader from '@/components/ui/BackHeader';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CompetingForks() {
  const router = useRouter();
  return (
    <LinearGradient colors={["#3a0a0a", "#7a1d1d"]} style={styles.container}>
      <BackHeader title="Competing Forks" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="git-compare-outline" size={40} color="#f97316" />
          </View>
          <Text style={styles.title}>Longest Chain Rule</Text>
          <Text style={styles.subtitle}>Why nodes follow the most-work chain</Text>
          <View style={styles.divider} />
          <Text style={styles.paragraph}>
            Nodes adopt the valid chain with the most accumulated work (or length in simplified models). Eventually one fork outpaces the other and becomes canonical.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#f97316" />
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/consensus-challenge/resolve-consensus')}>
            <Text style={styles.primaryButtonText}>Next: Resolve Consensus</Text>
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
  card: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  iconContainer: { width: 70, height: 70, borderRadius: 20, backgroundColor: 'rgba(249, 115, 22, 0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: 20, alignSelf: 'center' },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 16, textAlign: 'center', marginBottom: 24 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
  paragraph: { color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 24, marginBottom: 16 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(58, 10, 10, 0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  primaryButton: { backgroundColor: '#ef4444', borderRadius: 14, padding: 16, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  secondaryButton: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, flex: 0.5 },
  secondaryButtonText: { color: '#f97316', fontSize: 16, fontWeight: '600' },
});
