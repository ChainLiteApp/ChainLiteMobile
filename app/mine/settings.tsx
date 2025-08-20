import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useNavigation } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';
import { getApiBaseUrl, saveApiBaseUrl } from '@/src/services/blockchain';

export default function MiningSettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const [autoMine, setAutoMine] = useState(true);
  const [sound, setSound] = useState(false);
  const [apiBaseUrl, setApiBaseUrlState] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setApiBaseUrlState(String(getApiBaseUrl() || ''));
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveApiBaseUrl(apiBaseUrl.trim());
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#0f0a22", "#0f0a22"]} style={styles.container}>
        <BackHeader title="Mining Settings" onBack={() => router.back()} />

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.itemTitle}>Auto-mine next block</Text>
              <Switch value={autoMine} onValueChange={setAutoMine} />
            </View>
            <View style={styles.row}>
              <Text style={styles.itemTitle}>Sound effects</Text>
              <Switch value={sound} onValueChange={setSound} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>API Base URL</Text>
            <Text style={styles.sectionSub}>This is the ChainLite node your app connects to.</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={apiBaseUrl}
                onChangeText={setApiBaseUrlState}
                placeholder="http://127.0.0.1:8000"
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>
            <TouchableOpacity style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
              <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0a22' },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginTop: 16,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  itemTitle: { color: '#ffffff', fontWeight: '700' },
  sectionTitle: { color: '#ffffff', fontWeight: '800', fontSize: 16, marginBottom: 6 },
  sectionSub: { color: 'rgba(255,255,255,0.7)', marginBottom: 10 },
  inputRow: { borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)' },
  input: { color: '#ffffff', paddingHorizontal: 12, paddingVertical: 12 },
  saveBtn: { marginTop: 12, height: 44, borderRadius: 12, backgroundColor: '#7a2bca', alignItems: 'center', justifyContent: 'center' },
  saveBtnDisabled: { backgroundColor: '#6b21a8' },
  saveBtnText: { color: '#ffffff', fontWeight: '800' },
});
