import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';

export default function NodeDetailsScreen() {
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#0f0a22", "#0f0a22"]} style={styles.container}>
        <BackHeader title="Node Details" onBack={() => router.back()} />

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Overview</Text>
            <View style={styles.row}><Text style={styles.key}>Role</Text><Text style={styles.value}>Validator</Text></View>
            <View style={styles.row}><Text style={styles.key}>IP</Text><Text style={styles.value}>127.0.0.1</Text></View>
            <View style={styles.row}><Text style={styles.key}>Port</Text><Text style={styles.value}>5000</Text></View>
            <View style={styles.row}><Text style={styles.key}>Status</Text><Text style={styles.value}>Online</Text></View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sync</Text>
            <View style={styles.row}><Text style={styles.key}>Height</Text><Text style={styles.value}>#18,245,991</Text></View>
            <View style={styles.row}><Text style={styles.key}>Peers</Text><Text style={styles.value}>4</Text></View>
            <View style={styles.row}><Text style={styles.key}>Last Block</Text><Text style={styles.value}>2m ago</Text></View>
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
    padding: 16,
    marginTop: 16,
  },
  cardTitle: { color: '#ffffff', fontWeight: '800', fontSize: 18, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  key: { color: 'rgba(255,255,255,0.7)', fontWeight: '700' },
  value: { color: '#ffffff', fontWeight: '800' },
});
