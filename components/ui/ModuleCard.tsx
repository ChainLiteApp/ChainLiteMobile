import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export type ModuleCardProps = {
  colors: [string, string];
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function ModuleCard({ colors, icon, title, subtitle, onPress, style }: ModuleCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.touch, style]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.card}>
        <View style={styles.left}>
          <View style={styles.iconBg}>
            <Ionicons name={icon} size={22} color="#ffffff" />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.9)" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touch: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  card: {
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 15,
    fontWeight: '500',
  },
});
