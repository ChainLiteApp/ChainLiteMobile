import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';

export default function MiningHistoryScreen() {
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#0f0a22", "#0f0a22"]} style={styles.container}>
        <BackHeader title="Mining History" onBack={() => router.back()} />

        <View style={styles.content}>
          <View style={styles.list}>
            {[...Array(8)].map((_, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.hash}>Block #{18245980 + i}</Text>
                <Text style={styles.sub}>2m ago • Reward 2 CLT</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0a22' },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  list: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginTop: 16,
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  hash: { color: '#ffffff', fontWeight: '800' },
  sub: { color: 'rgba(255,255,255,0.7)', marginTop: 4 },
});
