import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';

export type ModuleCardProps = {
  colors: [string, string];
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
  style?: ViewStyle;
  progress?: number | null;
  density?: 'comfortable' | 'compact';
};

export default function ModuleCard({ colors, icon, title, subtitle, onPress, style, progress, density = 'comfortable' }: ModuleCardProps) {
  const isCompact = density === 'compact';
  const iconSize = isCompact ? 22 : 26;
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.touch, style]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={[styles.card, isCompact && styles.cardCompact]}>
        <View style={styles.topRow}>
          <View style={styles.left}>
            <View style={[styles.iconBg, isCompact && styles.iconBgCompact]}>
              <Ionicons name={icon} size={iconSize} color="#ffffff" />
            </View>
            <View style={styles.textWrap}>
              <Text style={[styles.title, isCompact && styles.titleCompact]}>{title}</Text>
              <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>{subtitle}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.9)" />
        </View>

        {typeof progress === 'number' && (
          <View style={[styles.progressWrap, isCompact && styles.progressWrapCompact]}>
            <ProgressBar progress={progress} height={isCompact ? 6 : 8} trackColor="rgba(255,255,255,0.35)" fillColor="#ffffff" />
            <Text style={[styles.progressText, isCompact && styles.progressTextCompact]}>{progress}% Complete</Text>
          </View>
        )}
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
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  cardCompact: {
    padding: 14,
    gap: 8,
  },
  topRow: {
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
  iconBgCompact: {
    width: 44,
    height: 44,
    borderRadius: 14,
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  titleCompact: {
    fontSize: 18,
    marginBottom: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 15,
    fontWeight: '600',
  },
  subtitleCompact: {
    fontSize: 13,
  },
  progressWrap: {
    marginTop: 6,
  },
  progressWrapCompact: {
    marginTop: 6,
  },
  progressText: {
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 6,
  },
  progressTextCompact: {
    fontSize: 12,
    marginTop: 4,
  },
});
