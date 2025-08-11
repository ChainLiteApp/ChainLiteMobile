import BackHeader from '@/components/ui/BackHeader';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MiningTutorialScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    // Hide the default stack header; we render our own custom header
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  return (
    <LinearGradient colors={["#0b331f", "#0e2a1e"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      {/* Fixed, non-scrollable header */}
      <BackHeader title="Mining Tutorial" onBack={() => router.back()} backgroundColor="transparent" tintColor="#eafff2" />

      {/* Scrollable content below header */}
      <ScrollView contentContainerStyle={[styles.content]} showsVerticalScrollIndicator={false}>

        {/* Tutorial Card */}
        <View style={styles.tutorialCard}>
          <View style={styles.heroIconWrap}>
            <View style={styles.heroIconBg}>
              <Ionicons name="hardware-chip-outline" size={34} color="#eafff2" />
            </View>
          </View>
          <Text style={styles.cardTitle}>Learn Mining</Text>
          <Text style={styles.cardSubtitle}>Step-by-step mining tutorial</Text>

          {/* Steps */}
          <View style={styles.steps}>
            {[
              { label: 'What is Mining?', done: true, index: 1 },
              { label: 'Proof of Work', done: true, index: 2 },
              { label: 'Finding the Nonce', done: false, index: 3 },
              { label: 'Block Validation', done: false, index: 4 },
              { label: 'Mining Rewards', done: false, index: 5 },
            ].map((s, i) => (
              <TouchableOpacity key={s.label} activeOpacity={0.85} style={[styles.stepRow, s.done ? styles.stepRowDone : styles.stepRowTodo]}>
                <View style={[styles.stepIcon, s.done ? styles.stepIconDone : styles.stepIconTodo]}>
                  {s.done ? (
                    <Ionicons name="checkmark-circle" size={22} color="#9ef5b5" />
                  ) : (
                    <Text style={styles.stepIndex}>{s.index}</Text>
                  )}
                </View>
                <Text style={styles.stepText}>{s.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.9)" />
              </TouchableOpacity>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity activeOpacity={0.9} style={styles.ctaBtn}>
            <LinearGradient colors={["#35d07f", "#14b45a"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.ctaGrad}>
              <Text style={styles.ctaText}>Continue Tutorial</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 20 },
  content: { paddingHorizontal: 20, paddingBottom: 24 },

  tutorialCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  heroIconWrap: { alignItems: 'center', marginTop: 4, marginBottom: 10 },
  heroIconBg: {
    width: 76, height: 76, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(53, 208, 127, 0.25)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)'
  },
  cardTitle: { color: '#eafff2', fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 6 },
  cardSubtitle: { color: 'rgba(226,247,234,0.85)', fontSize: 15, textAlign: 'center', marginTop: 6 },

  steps: { marginTop: 16, gap: 12 },
  stepRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  stepRowDone: {
    backgroundColor: 'rgba(19, 144, 83, 0.2)',
    borderColor: 'rgba(96, 248, 161, 0.25)'
  },
  stepRowTodo: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.10)'
  },
  stepIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepIconDone: { backgroundColor: 'rgba(49, 196, 123, 0.28)' },
  stepIconTodo: { backgroundColor: 'rgba(255,255,255,0.12)' },
  stepIndex: { color: '#eafff2', fontWeight: '800' },
  stepText: { color: '#eafff2', fontSize: 16, fontWeight: '700', flex: 1 },

  ctaBtn: { marginTop: 18 },
  ctaGrad: { paddingVertical: 16, borderRadius: 18, alignItems: 'center' },
  ctaText: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
});
