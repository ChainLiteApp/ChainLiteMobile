import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';
import { getApiBaseUrl, saveApiBaseUrl } from '@/src/services/blockchain';

export default function SettingsScreen() {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [editUrl, setEditUrl] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // getApiBaseUrl is synchronous (axios instance default), initialize ran in RootLayout
    const url = getApiBaseUrl();
    setCurrentUrl(url || '');
    setEditUrl(url || '');
  }, []);

  const onSave = async () => {
    const trimmed = editUrl.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      Alert.alert('Invalid URL', 'Please enter a valid http(s) URL.');
      return;
    }
    try {
      setSaving(true);
      await saveApiBaseUrl(trimmed);
      setCurrentUrl(trimmed);
      Alert.alert('Saved', 'API base URL updated successfully.');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to save API base URL');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.container}>
      <BackHeader title="Settings" onBack={() => router.back()} />

      <View style={styles.section}>
        <Text style={styles.label}>Current API Base URL</Text>
        <View style={styles.readonlyBox}>
          <Text style={styles.readonlyText}>{currentUrl || 'Not set'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Update API Base URL</Text>
        <TextInput
          value={editUrl}
          onChangeText={setEditUrl}
          placeholder="http://192.168.x.x:8000"
          placeholderTextColor="rgba(255,255,255,0.5)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={styles.input}
        />
      </View>

      <TouchableOpacity disabled={saving} onPress={onSave} style={[styles.button, saving && styles.buttonDisabled]} accessibilityRole="button" accessibilityLabel="Save API Base URL">
        <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b2040',
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  section: {
    marginTop: 16,
    gap: 8,
  },
  label: {
    color: '#c7c9ff',
    fontSize: 14,
    fontWeight: '600',
  },
  readonlyBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 14,
  },
  readonlyText: {
    color: '#ffffff',
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 14,
    color: '#ffffff',
    fontSize: 14,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#7a2bca',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});
