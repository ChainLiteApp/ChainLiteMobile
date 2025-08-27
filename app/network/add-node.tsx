import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';
import { registerNode } from '@/src/services/blockchain';

export default function AddNodeScreen() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [host, setHost] = React.useState('');
  const [port, setPort] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSave = async () => {
    if (loading) return;
    if (!host || !port) {
      Alert.alert('Missing fields', 'Please enter host and port');
      return;
    }
    const url = `http://${host}:${port}`;
    try {
      setLoading(true);
      await registerNode(url);
      Alert.alert('Node added', `${name || url} registered successfully`);
      router.back();
    } catch (e: any) {
      Alert.alert('Failed to add node', e?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <LinearGradient colors={["#0f0a22", "#0f0a22"]} style={styles.container}>
        <BackHeader title="Add Node" onBack={() => router.back()} />

        <View style={styles.content}>
          <Text style={styles.label}>Node Name</Text>
          <TextInput placeholder="e.g., Node A" placeholderTextColor="rgba(255,255,255,0.6)" style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Host</Text>
          <TextInput placeholder="127.0.0.1" placeholderTextColor="rgba(255,255,255,0.6)" style={styles.input} value={host} onChangeText={setHost} autoCapitalize="none" />

          <Text style={styles.label}>Port</Text>
          <TextInput placeholder="8000" keyboardType="numeric" placeholderTextColor="rgba(255,255,255,0.6)" style={styles.input} value={port} onChangeText={setPort} />

          <TouchableOpacity style={[styles.primaryBtn, loading && { opacity: 0.7 }]} activeOpacity={0.95} onPress={onSave} disabled={loading}>
            <Text style={styles.primaryText}>{loading ? 'Saving...' : 'Save Node'}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#0f0a22',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
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
  primaryText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});
