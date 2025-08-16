import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';
import { createTransaction, getWallet } from '@/src/services/blockchain';

export default function SendTransactionScreen() {
  const router = useRouter();
  const [to, setTo] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [fee, setFee] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSend = async () => {
    if (loading) return;
    const value = parseFloat(amount);
    if (!to || !/^0x[a-fA-F0-9]+$/.test(to)) {
      Alert.alert('Invalid address', 'Please enter a valid destination address (0x...)');
      return;
    }
    if (isNaN(value) || value <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount greater than 0');
      return;
    }

    try {
      setLoading(true);
      const wallet = await getWallet();
      if (!wallet) {
        Alert.alert('No wallet found', 'Please create or import a wallet first.');
        return;
      }

      await createTransaction(wallet.address, to, value, wallet.privateKey);
      Alert.alert('Success', 'Transaction submitted to mempool.');
      setTo('');
      setAmount('');
      setFee('');
      router.back();
    } catch (e: any) {
      Alert.alert('Send failed', e?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#0f0a22", "#0f0a22"]} style={styles.container}>
        <BackHeader title="Send" onBack={() => router.back()} />
        <View style={styles.content}>
          <Text style={styles.label}>To Address</Text>
          <TextInput
            placeholder="0x..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.input}
            value={to}
            onChangeText={setTo}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Amount (CLT)</Text>
          <TextInput
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Fee</Text>
          <TextInput
            placeholder="Standard"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.input}
            value={fee}
            onChangeText={setFee}
          />

          <TouchableOpacity style={[styles.primaryBtn, loading && { opacity: 0.7 }]} activeOpacity={0.95} onPress={onSend} disabled={loading}>
            <Text style={styles.primaryText}>{loading ? 'Sending...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0a22' },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  label: { color: 'rgba(255,255,255,0.85)', fontWeight: '700', marginTop: 16, marginBottom: 8 },
  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 14,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
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
