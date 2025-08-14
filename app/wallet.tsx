import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';

export default function WalletScreen() {
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#0f0a22", "#0f0a22"]} style={styles.container}>
        <BackHeader title="Wallet" onBack={() => router.back()} />

        <View style={styles.content}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balanceValue}>124.56 CLT</Text>
          </View>

          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.95} onPress={() => router.push('/send-transaction')}>
            <Text style={styles.primaryText}>Send Transaction</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0a22' },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  balanceCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 16,
    marginTop: 16,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontWeight: '700' },
  balanceValue: { color: '#ffffff', fontWeight: '800', fontSize: 24, marginTop: 6 },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#7a2bca',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  primaryText: { color: '#ffffff', fontWeight: '800', fontSize: 16 },
});
