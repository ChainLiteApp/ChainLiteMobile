import BackHeader from '@/components/ui/BackHeader';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConsensusChallenge() {
  const router = useRouter();
  const steps = [
    { label: 'Detect Conflicts', route: '/consensus-challenge/detect-conflicts', index: 1 },
    { label: 'Competing Forks', route: '/consensus-challenge/competing-forks', index: 2 },
    { label: 'Resolve Consensus', route: '/consensus-challenge/resolve-consensus', index: 3 },
  ];

  return (
    <LinearGradient colors={["#3a0a0a", "#7a1d1d"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <BackHeader title="Consensus Challenge" onBack={() => router.back()} backgroundColor="transparent" tintColor="#fff4ec" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.heroIconWrap}>
            <View style={styles.heroIconBg}>
              <Ionicons name="bookmark-outline" size={34} color="#fff4ec" />
            </View>
          </View>
          <Text style={styles.cardTitle}>Resolve Network Conflicts</Text>
          <Text style={styles.cardSubtitle}>Practice convergence under forks</Text>

          <View style={styles.steps}>
            {steps.map((step) => (
              <TouchableOpacity key={step.label} activeOpacity={0.9} style={styles.stepRow} onPress={() => router.push(step.route)}>
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
  card: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 26, padding: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  heroIconWrap: { alignItems: 'center', marginTop: 4, marginBottom: 10 },
  heroIconBg: { width: 76, height: 76, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(251, 146, 60, 0.25)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  cardTitle: { color: '#fff4ec', fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 6 },
  cardSubtitle: { color: 'rgba(255, 238, 230, 0.9)', fontSize: 15, textAlign: 'center', marginTop: 6 },
  steps: { marginTop: 16, gap: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)' },
  stepIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: 'rgba(255,255,255,0.18)' },
  stepIndex: { color: '#fff4ec', fontWeight: '800' },
  stepText: { color: '#fff4ec', fontSize: 16, fontWeight: '700', flex: 1 },
});
