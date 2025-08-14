import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';

export default function AddNodeScreen() {
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#0f0a22", "#0f0a22"]} style={styles.container}>
        <BackHeader title="Add Node" onBack={() => router.back()} />

        <View style={styles.content}>
          <Text style={styles.label}>Node Name</Text>
          <TextInput placeholder="e.g., Node A" placeholderTextColor="rgba(255,255,255,0.6)" style={styles.input} />

          <Text style={styles.label}>Host</Text>
          <TextInput placeholder="127.0.0.1" placeholderTextColor="rgba(255,255,255,0.6)" style={styles.input} />

          <Text style={styles.label}>Port</Text>
          <TextInput placeholder="5000" keyboardType="numeric" placeholderTextColor="rgba(255,255,255,0.6)" style={styles.input} />

          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.95}>
            <Text style={styles.primaryText}>Save Node</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
