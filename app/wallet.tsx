import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';
import { getWallet, createWallet, importWallet, getBalance } from '@/src/services/blockchain';

export default function WalletScreen() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [importKey, setImportKey] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const w = await getWallet();
      if (!w) {
        setAddress(null);
        setBalance(null);
        return;
      }
      setAddress(w.address);
      const b = await getBalance(w.address);
      setBalance(b);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async () => {
    try {
      setLoading(true);
      const w = await createWallet();
      setAddress(w.address);
      setImportKey('');
      const b = await getBalance(w.address);
      setBalance(b);
      Alert.alert('Wallet created', 'A new wallet has been generated. Keep your private key safe.');
    } catch (e: any) {
      Alert.alert('Create failed', e?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const onImport = async () => {
    if (!importKey.trim()) {
      Alert.alert('Enter private key', 'Please paste your private key to import.');
      return;
    }
    try {
      setLoading(true);
      const w = await importWallet(importKey.trim());
      setAddress(w.address);
      setImportKey('');
      const b = await getBalance(w.address);
      setBalance(b);
      Alert.alert('Wallet imported', 'Wallet successfully imported.');
    } catch (e: any) {
      Alert.alert('Import failed', e?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <LinearGradient colors={["#0f0a22", "#0f0a22"]} style={styles.container}>
        <BackHeader title="Wallet" onBack={() => router.back()} />

        <View style={styles.content}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Address</Text>
            <Text style={styles.addrText}>{address ?? 'No wallet yet'}</Text>
            <Text style={[styles.balanceLabel, { marginTop: 10 }]}>Balance</Text>
            <Text style={styles.balanceValue}>{balance === null ? (loading ? 'Loading...' : '—') : `${balance} CLT`}</Text>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={[styles.primaryBtn, { flex: 1, marginRight: 8, opacity: loading ? 0.7 : 1 }]} onPress={onCreate} disabled={loading}>
              <Text style={styles.primaryText}>{loading ? 'Please wait...' : 'Create Wallet'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { flex: 1, marginLeft: 8, opacity: loading ? 0.7 : 1 }]} onPress={onImport} disabled={loading}>
              <Text style={styles.primaryText}>Import</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Paste private key here"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={[styles.input, { marginTop: 12 }]}
            value={importKey}
            onChangeText={setImportKey}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity style={[styles.primaryBtn, { marginTop: 12 }]} activeOpacity={0.95} onPress={() => router.push('/send-transaction')}>
            <Text style={styles.primaryText}>Send Transaction</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
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
  addrText: { color: '#ffffff', fontWeight: '700', marginTop: 6 },
  balanceValue: { color: '#ffffff', fontWeight: '800', fontSize: 24, marginTop: 6 },
  row: { flexDirection: 'row', marginTop: 16 },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#7a2bca',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  primaryText: { color: '#ffffff', fontWeight: '800', fontSize: 16 },
  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 14,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
