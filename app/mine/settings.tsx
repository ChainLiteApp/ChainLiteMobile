import React from 'react';
import { StyleSheet, Text, View, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/ui/BackHeader';

export default function MiningSettingsScreen() {
  const router = useRouter();
  const [autoMine, setAutoMine] = React.useState(true);
  const [sound, setSound] = React.useState(false);

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
});
