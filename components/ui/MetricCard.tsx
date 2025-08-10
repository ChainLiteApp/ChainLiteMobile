import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export type MetricCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  statusLabel: string;
  statusColor: string;
  value: string;
  label: string;
  style?: ViewStyle;
};

export default function MetricCard({ icon, statusLabel, statusColor, value, label, style }: MetricCardProps) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.03)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={20} color={statusColor} />
        </View>
        <Text style={[styles.status, { color: statusColor }]}>{statusLabel}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minHeight: 120,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
});
